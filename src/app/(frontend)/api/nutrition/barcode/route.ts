
import config from "@payload-config";
import { getPayload } from "payload";
import { personalizeProduct } from "@/lib/barcode";
import { getCurrentAppUser } from "@/lib/current-user";
import { normalizeProfile } from "@/lib/nutrition-domain";
import type { User } from "@/payload-types";

const fields =
  "product_name,brands,image_front_url,image_url,serving_size,ingredients_text,allergens,allergens_tags,nutriscore_grade,nutriments";

type OpenFoodFactsResponse = {
  status?: number;
  product?: {
    product_name?: string;
    brands?: string;
    image_front_url?: string;
    image_url?: string;
    ingredients_text?: string;
    nutriscore_grade?: string;
    nutriments?: Record<string, number | string | undefined>;
    [key: string]: unknown;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const barcode =
      typeof body.code === "string" ? body.code.replace(/\D/g, "") : "";

    if (barcode.length < 8 || barcode.length > 14) {
      return Response.json(
        { message: "Enter a valid 8-14 digit barcode." },
        { status: 400 },
      );
    }

    const user = await getCurrentAppUser();

    if (!user) {
      return Response.json(
        {
          message:
            "Sign in to get a barcode score personalized to your saved profile.",
        },
        { status: 401 },
      );
    }

    const profile = normalizeProfile(user.nutritionProfile);

    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?fields=${fields}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "NutriScan/1.0",
        },
        next: { revalidate: 86_400 },
      },
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");

      console.error("[Open Food Facts] Upstream request failed:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody.slice(0, 500),
      });

      throw new Error(
        `Food database unavailable (HTTP ${response.status}).`,
      );
    }

    const payloadBody =
      (await response.json()) as OpenFoodFactsResponse;

    const product = payloadBody.product;

    if (payloadBody.status !== 1 || !product) {
      return Response.json(
        {
          message:
            "Product not found. Check the barcode or try another product.",
        },
        { status: 404 },
      );
    }

    const hasProductInformation = Boolean(
      product.product_name?.trim() ||
        product.brands?.trim() ||
        product.image_front_url ||
        product.image_url ||
        product.ingredients_text?.trim() ||
        product.nutriscore_grade?.trim() ||
        Object.keys(product.nutriments ?? {}).length > 0,
    );

    if (!hasProductInformation) {
      return Response.json(
        {
          message:
            "This barcode exists in Open Food Facts, but its product details and nutrition data are unavailable.",
        },
        { status: 422 },
      );
    }

    const result = personalizeProduct(product, barcode, profile);

    const payload = await getPayload({ config });

    await payload.create({
      collection: "food-scans",
      data: {
        owner: user.id,
        mode: "barcode",
        barcode,
        foodName: result.name,
        brand: result.brand,
        result: JSON.parse(JSON.stringify(result)),
        ...(result.personalizedScore !== null
          ? { personalizedScore: result.personalizedScore }
          : {}),
      },
      user: user as unknown as User,
      overrideAccess: false,
      draft: false,
    });

    return Response.json(result);
  } catch (error) {
    console.error("[Barcode API] Failed:", error);

    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Could not look up this product.",
      },
      { status: 502 },
    );
  }
}
