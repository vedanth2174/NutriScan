"use client";

import NextImage from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { endAuthSession, startGoogleSignIn } from "@/lib/auth-browser";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  Barcode,
  Bell,
  BookOpen,
  Bot,
  Camera,
  Check,
  ChevronRight,
  CircleUserRound,
  Cloud,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  Heart,
  History,
  Home,
  Image,
  Leaf,
  ListChecks,
  Mic,
  Moon,
  MoreHorizontal,
  RefreshCw,
  ScanLine,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Sun,
  Target,
  ThumbsDown,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  Utensils,
  WalletCards,
  Waves,
  WifiOff,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Screen } from "./navigation";
import { meals, reportMetrics } from "./mocks/data";
import {
  defaultNutritionProfile,
  nutritionService,
  type FoodAnalysis,
  type NutritionProfile,
  type ScanMode,
} from "./services/nutrition";

type IconButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
};

function IconButton({
  icon: Icon,
  label,
  onClick,
  className = "",
}: IconButtonProps) {
  return (
    <button
      className={`icon-button ${className}`}
      onClick={onClick}
      aria-label={label}
    >
      <Icon size={20} strokeWidth={2.2} />
    </button>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "accent" | "ghost" | "dark";
  className?: string;
}) {
  return (
    <button
      className={`button button-${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Chip({
  children,
  active = false,
  onClick,
  tone = "",
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  tone?: string;
}) {
  return (
    <button
      className={`chip ${active ? "chip-active" : ""} ${tone}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Card({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <section className={`card ${className}`} onClick={onClick}>
      {children}
    </section>
  );
}

function MiniBars({ color = "lime" }: { color?: string }) {
  return (
    <div className={`mini-bars ${color}`} aria-hidden="true">
      {[32, 48, 38, 62, 50, 74, 66].map((height, index) => (
        <i key={index} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

function MacroBar({
  label,
  value,
  target,
  color,
}: {
  label: string;
  value: number;
  target: number;
  color: string;
}) {
  const percentage = Math.min(100, Math.round((value / target) * 100));
  return (
    <div className="macro">
      <div className="row">
        <span>{label}</span>
        <strong>
          {value}
          <small> / {target}g</small>
        </strong>
      </div>
      <div className="track">
        <span style={{ width: `${percentage}%`, background: color }} />
      </div>
    </div>
  );
}

function DotRing({
  score = 84,
  label = "Readiness",
}: {
  score?: number;
  label?: string;
}) {
  const dots = Array.from({ length: 28 });
  return (
    <div className="dot-ring" aria-label={`${label} score ${score}`}>
      {dots.map((_, index) => {
        const angle = (index / dots.length) * 360;
        return (
          <i
            key={index}
            style={{
              transform: `rotate(${angle}deg) translateY(-62px)`,
              opacity: index < score / 3.57 ? 1 : 0.14,
            }}
          />
        );
      })}
      <div>
        <strong>{score}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function Header({
  title,
  eyebrow,
  action,
  back,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  back?: () => void;
}) {
  return (
    <header className="screen-header">
      <div className="row">
        {back && <IconButton icon={ArrowLeft} label="Go back" onClick={back} />}
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
        </div>
        {action}
      </div>
    </header>
  );
}

function Welcome({ go }: { go: (screen: Screen) => void }) {
  return (
    <main className="welcome">
      <div className="welcome-brand">
        <div className="brand-mark">
          <Leaf size={20} fill="currentColor" />
        </div>
        <strong>NutriScan</strong>
      </div>
      <div className="food-mosaic">
        <div className="mosaic-stat float-one">
          <span>Fast</span>
          <strong>14:26</strong>
          <small>of 16 hours</small>
        </div>
        <NextImage
          className="food-main"
          src={meals[1].image}
          alt="Colorful paneer nourish bowl"
          width={500}
          height={600}
          unoptimized
          priority
        />
        <div className="mosaic-stat float-two">
          <Footprints size={18} />
          <strong>7,842</strong>
          <small>steps today</small>
        </div>
        <div className="voice-bubble">
          <Waves size={16} /> “How was my lunch?”
        </div>
        <div className="protein-bubble">
          <Dumbbell size={17} />
          <span>Protein</span>
          <strong>72 / 104g</strong>
        </div>
      </div>
      <div className="welcome-copy">
        <span className="eyebrow">Nutrition that knows you</span>
        <h1>
          Feel better.
          <br />
          <em>Every single day.</em>
        </h1>
        <p>
          Scan meals, understand your body, and make your next best choice with
          an AI buddy built around you.
        </p>
        <Button onClick={() => go("onboarding")}>
          Start free <ArrowRight size={19} />
        </Button>
        <button className="text-link" onClick={() => go("auth")}>
          Already a member? <strong>Log in</strong>
        </button>
      </div>
    </main>
  );
}

const onboardingSteps = [
  {
    title: "Snap a meal.",
    accent: "Know everything.",
    copy: "One photo reveals calories, macros, ingredients and what it means for your goals.",
    icon: Camera,
  },
  {
    title: "What's your",
    accent: "main goal?",
    copy: "We'll shape every recommendation around what matters most to you.",
    options: [
      "Lose fat",
      "Build muscle",
      "Maintain weight",
      "Feel more energetic",
    ],
  },
  {
    title: "How active are",
    accent: "your days?",
    copy: "This helps us calculate an honest daily target.",
    options: ["Mostly seated", "Lightly active", "Very active", "Athlete mode"],
  },
  {
    title: "Your food,",
    accent: "your rules.",
    copy: "Choose the pattern that feels natural. You can change it anytime.",
    options: ["Eggitarian", "Vegetarian", "Vegan", "Non-vegetarian", "Jain"],
  },
  {
    title: "Anything we should",
    accent: "keep you safe from?",
    copy: "We'll flag conflicts before you add food.",
    options: ["Peanuts", "Lactose", "Gluten", "Shellfish", "No allergies"],
  },
  {
    title: "Health context",
    accent: "changes everything.",
    copy: "Optional, private, and used only to personalize nutrition.",
    options: ["Diabetes", "PCOS", "Thyroid", "High BP", "Pregnancy", "None"],
  },
  {
    title: "What works in",
    accent: "real life?",
    copy: "Recommendations will fit your budget, cuisine and cooking time.",
    options: [
      "₹250/day",
      "Indian home food",
      "Under 20 min",
      "Meal prep friendly",
    ],
  },
  {
    title: "What's driving",
    accent: "this change?",
    copy: "We'll keep this close when motivation dips.",
    options: [
      "Upcoming event",
      "Doctor's advice",
      "Better confidence",
      "Family health",
      "Sports performance",
    ],
  },
];

function Onboarding({
  go,
  onProfileChange,
}: {
  go: (screen: Screen) => void;
  onProfileChange: (profile: NutritionProfile) => void;
}) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Record<number, string[]>>({});
  const current = onboardingSteps[step];
  const Icon = current.icon;
  const toggle = (value: string) => {
    setSelected((previous) => {
      const values = previous[step] ?? [];
      return {
        ...previous,
        [step]: values.includes(value)
          ? values.filter((item) => item !== value)
          : [...values, value],
      };
    });
  };
  const continueOnboarding = () => {
    if (step !== onboardingSteps.length - 1) {
      setStep(step + 1);
      return;
    }
    onProfileChange({
      goal: selected[1]?.[0] ?? defaultNutritionProfile.goal,
      allergies: (selected[4] ?? defaultNutritionProfile.allergies).filter(
        (item) => item !== "No allergies",
      ),
      healthConditions: (
        selected[5] ?? defaultNutritionProfile.healthConditions
      ).filter((item) => item !== "None"),
    });
    go("building");
  };

  return (
    <main className="onboarding page">
      <div className="onboarding-top">
        <IconButton
          icon={ArrowLeft}
          label="Previous"
          onClick={() => (step ? setStep(step - 1) : go("welcome"))}
        />
        <div className="segments">
          {onboardingSteps.map((_, index) => (
            <i key={index} className={index <= step ? "filled" : ""} />
          ))}
        </div>
        <span>
          {step + 1}/{onboardingSteps.length}
        </span>
      </div>
      <div className="onboarding-body" key={step}>
        {Icon && (
          <div className="feature-orbit">
            <Icon size={42} />
            <span />
            <span />
            <span />
          </div>
        )}
        <span className="eyebrow">
          {step === 0
            ? "Meet your nutrition co-pilot"
            : "Personalised assessment"}
        </span>
        <h1>
          {current.title}
          <br />
          <em>{current.accent}</em>
        </h1>
        <p>{current.copy}</p>
        {current.options && (
          <div className="option-list">
            {current.options.map((option) => (
              <button
                key={option}
                className={`option ${selected[step]?.includes(option) ? "selected" : ""}`}
                onClick={() => toggle(option)}
              >
                <span>{option}</span>
                <span className="option-check">
                  <Check size={16} />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="onboarding-actions">
        <Button onClick={continueOnboarding}>
          {step === 0
            ? "Show me how"
            : step === onboardingSteps.length - 1
              ? "Build my plan"
              : "Continue"}{" "}
          <ArrowRight size={18} />
        </Button>
        {step > 0 && (
          <button
            className="text-link"
            onClick={() =>
              setStep(step + 1 < onboardingSteps.length ? step + 1 : step)
            }
          >
            Skip for now
          </button>
        )}
      </div>
    </main>
  );
}

function Building({ go }: { go: (screen: Screen) => void }) {
  const [progress, setProgress] = useState(7);
  useEffect(() => {
    const timer = window.setInterval(
      () => setProgress((value) => Math.min(100, value + 3)),
      65,
    );
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (progress === 100) window.setTimeout(() => go("plan-ready"), 500);
  }, [progress, go]);
  const tasks = [
    "Analyzing your goal",
    "Calculating your macros",
    "Checking 1,248 foods",
    "Balancing your 28-day plan",
  ];
  return (
    <main className="building page">
      <div className="scan-visual">
        <div className="scan-core">
          <Sparkles size={36} />
        </div>
        <i />
        <i />
        <i />
      </div>
      <span className="eyebrow">Personalizing everything</span>
      <h1>
        Building your
        <br />
        <em>nutrition blueprint</em>
      </h1>
      <div className="build-number">
        {progress}
        <small>%</small>
      </div>
      <div className="build-track">
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="checklist">
        {tasks.map((task, index) => (
          <div key={task} className={progress > (index + 1) * 21 ? "done" : ""}>
            <span>
              {progress > (index + 1) * 21 ? (
                <Check size={15} />
              ) : (
                <RefreshCw size={15} />
              )}
            </span>
            {task}
          </div>
        ))}
      </div>
      <p className="food-count">
        <strong>{Math.round(progress * 12.48).toLocaleString()}</strong> foods
        analyzed for your preferences
      </p>
    </main>
  );
}

function PlanReady({ go }: { go: (screen: Screen) => void }) {
  return (
    <main className="page plan-ready">
      <div className="ready-confetti">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <span className="eyebrow">Your custom plan is ready</span>
      <h1>
        Built to get you to
        <br />
        <em>64 kg by 18 Aug</em>
      </h1>
      <Card className="weight-curve-card">
        <div className="row">
          <div>
            <span className="label">Projected weight</span>
            <strong className="big">−4.4 kg</strong>
          </div>
          <span className="positive-pill">
            <TrendingDown size={14} /> On track
          </span>
        </div>
        <svg
          viewBox="0 0 320 100"
          role="img"
          aria-label="Projected weight trend going down"
        >
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#D4F06B" stopOpacity=".3" />
              <stop offset="1" stopColor="#D4F06B" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 16 C50 12, 58 34, 105 31 S165 54, 205 57 S270 78, 320 82 L320 100 L0 100Z"
            fill="url(#area)"
          />
          <path
            d="M0 16 C50 12, 58 34, 105 31 S165 54, 205 57 S270 78, 320 82"
            fill="none"
            stroke="#D4F06B"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <div className="chart-labels">
          <span>Today · 68.4</span>
          <span>18 Aug · 64.0</span>
        </div>
      </Card>
      <div className="plan-grid">
        <Card className="calorie-card">
          <span className="label">Daily energy</span>
          <strong>1,820</strong>
          <small>kcal / day</small>
          <div className="mini-arc" />
        </Card>
        <Card>
          <span className="label">Daily essentials</span>
          <div className="essential">
            <Leaf size={16} /> Fiber <strong>28g</strong>
          </div>
          <div className="essential water">
            <Droplets size={16} /> Water <strong>2.4L</strong>
          </div>
        </Card>
      </div>
      <Card className="macro-card">
        <MacroBar label="Protein" value={104} target={104} color="#B58CFF" />
        <MacroBar label="Carbs" value={208} target={208} color="#FFB454" />
        <MacroBar label="Fat" value={62} target={62} color="#2F80FF" />
      </Card>
      <Button onClick={() => go("auth")}>
        Lock in my plan <ArrowRight size={18} />
      </Button>
    </main>
  );
}

function Auth({ go }: { go: (screen: Screen) => void }) {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/app-auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const body = (await response.json()) as {
        message?: string;
        errors?: Record<string, string>;
      };
      if (!response.ok) {
        throw new Error(
          body.message ||
            Object.values(body.errors ?? {})[0] ||
            "Sign in failed.",
        );
      }
      const savedProfile = sessionStorage.getItem("nutriscan-profile");
      if (savedProfile) {
        const profileResponse = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ profile: JSON.parse(savedProfile) }),
        });
        if (profileResponse.ok) sessionStorage.removeItem("nutriscan-profile");
      }
      window.location.reload();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  };
  const continueWithGoogle = async () => {
    setError("");
    try {
      await startGoogleSignIn();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Google sign-in is unavailable.",
      );
    }
  };
  return (
    <main className="page auth">
      <IconButton
        icon={ArrowLeft}
        label="Back"
        onClick={() => go("plan-ready")}
      />
      <div className="auth-mark">
        <Leaf size={28} fill="currentColor" />
      </div>
      <span className="eyebrow">Save your progress</span>
      <h1>
        Your plan deserves
        <br />
        <em>a permanent home.</em>
      </h1>
      <p>Sync your meals, goals and AI insights across every device.</p>
      {mode === "signup" && (
        <label className="field">
          <span>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
          />
        </label>
      )}
      <label className="field">
        <span>Email address</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </label>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      <Button onClick={submit}>
        {busy
          ? "Please wait…"
          : mode === "signup"
            ? "Create account"
            : "Sign in"}
      </Button>
      <button
        className="text-link"
        onClick={() => setMode(mode === "signup" ? "login" : "signup")}
      >
        {mode === "signup"
          ? "Already have an account? Sign in"
          : "New to NutriScan? Create account"}
      </button>
      <div className="divider">
        <span>or</span>
      </div>
      <Button variant="dark" onClick={continueWithGoogle}>
        <span className="google-dot">G</span> Continue with Google
      </Button>
      <div className="auth-links">
        <button>Have a referral code?</button>
      </div>
      <small className="legal">
        By continuing, you agree to our Terms and Privacy Policy.
      </small>
    </main>
  );
}

function TopStatus() {
  return (
    <div className="status-row">
      <span className="sync-pill">
        <span /> Synced just now
      </span>
      <button aria-label="Notifications">
        <Bell size={19} />
        <i />
      </button>
    </div>
  );
}

function TodayDecision() {
  return (
    <Card className="decision-card">
      <div className="decision-bg" />
      <div className="row">
        <span className="eyebrow">
          <Sparkles size={13} /> Today's best decision
        </span>
        <button>
          <MoreHorizontal size={19} />
        </button>
      </div>
      <h2>
        Make dinner
        <br />
        <em>protein-forward.</em>
      </h2>
      <p>You trained today, slept 7h 24m, and have 32g protein left.</p>
      <button className="decision-action">
        See 3 dinner ideas <ArrowRight size={16} />
      </button>
    </Card>
  );
}

function HomeScreen({ go }: { go: (screen: Screen) => void }) {
  const [section, setSection] = useState("Overall");
  const [water, setWater] = useState(1250);
  return (
    <main className="page tab-page home-screen">
      <TopStatus />
      <Header
        title="Good afternoon, Aanya"
        eyebrow="Thursday, 12 June"
        action={
          <div className="weather">
            <Sun size={16} /> 29°
          </div>
        }
      />
      <div className="tab-chips">
        {["Overall", "New", "Water", "Fasting"].map((item) => (
          <Chip
            key={item}
            active={section === item}
            onClick={() => setSection(item)}
          >
            {item}
          </Chip>
        ))}
      </div>
      {section === "Overall" && (
        <>
          <TodayDecision />
          <Card className="today-card">
            <div className="row">
              <div>
                <span className="label">Today's count</span>
                <h2>
                  You're doing <em>great.</em>
                </h2>
              </div>
              <div className="calorie-ring">
                <strong>572</strong>
                <small>left</small>
              </div>
            </div>
            <div className="calorie-summary">
              <span>
                <strong>1,248</strong>
                <small>Eaten</small>
              </span>
              <span>
                <strong>1,820</strong>
                <small>Target</small>
              </span>
              <span>
                <strong>312</strong>
                <small>Burned</small>
              </span>
            </div>
            <MacroBar label="Protein" value={72} target={104} color="#B58CFF" />
            <MacroBar label="Carbs" value={148} target={208} color="#FFB454" />
            <MacroBar label="Fat" value={46} target={62} color="#2F80FF" />
          </Card>
          <div className="section-title">
            <div>
              <span className="eyebrow">Context-aware picks</span>
              <h2>Eat next</h2>
            </div>
            <button>See all</button>
          </div>
          <div className="meal-scroll">
            {meals.map((meal, index) => (
              <article
                className="meal-card"
                key={meal.name}
                onClick={() => go("food-result")}
              >
                <NextImage
                  src={meal.image}
                  alt={meal.name}
                  width={424}
                  height={270}
                  unoptimized
                />
                <div className="safe-badge">
                  <ShieldCheck size={12} /> Safe
                </div>
                <div>
                  <strong>
                    {index === 0 ? "Greek yogurt crunch" : meal.name}
                  </strong>
                  <span>
                    {index === 0 ? "Fills your 18g protein gap" : meal.meta}
                  </span>
                </div>
              </article>
            ))}
          </div>
          <Card className="gap-card">
            <div className="row">
              <div className="gap-icon">
                <Target size={21} />
              </div>
              <span className="score-pill">82% balanced</span>
            </div>
            <h2>Close your nutrition gaps</h2>
            <p>
              You're <strong>18g short on protein</strong> and could use more
              iron today.
            </p>
            <MacroBar
              label="Protein gap"
              value={72}
              target={104}
              color="#B58CFF"
            />
            <MacroBar label="Iron gap" value={9} target={18} color="#FFB454" />
          </Card>
          <div className="two-col">
            <Card className="water-card">
              <Droplets size={21} />
              <span className="label">Hydration</span>
              <strong>{(water / 1000).toFixed(2)}L</strong>
              <small>of 2.4L</small>
              <button onClick={() => setWater((value) => value + 250)}>
                + 250 ml
              </button>
            </Card>
            <Card className="fasting-card">
              <Flame size={21} />
              <span className="label">16:8 fast</span>
              <strong>14:26</strong>
              <small>1h 34m to go</small>
              <div className="fast-line">
                <span />
              </div>
            </Card>
          </div>
          <Card className="insight-card">
            <div className="insight-icon">
              <Moon size={19} />
            </div>
            <div>
              <span className="eyebrow">AI pattern found</span>
              <h3>Sleep 7h+ → meals improve 18%</h3>
              <p>Your next-day choices are more balanced after good sleep.</p>
            </div>
            <ChevronRight size={20} />
          </Card>
          <div className="section-title">
            <div>
              <span className="eyebrow">10 signals, one view</span>
              <h2>Your health report</h2>
            </div>
            <button onClick={() => go("progress")}>Details</button>
          </div>
          <div className="report-grid">
            {reportMetrics.map(([label, value, trend], index) => (
              <Card key={label}>
                <span className="label">{label}</span>
                <strong>{value}</strong>
                <MiniBars
                  color={
                    index % 3 === 0
                      ? "purple"
                      : index % 3 === 1
                        ? "orange"
                        : "lime"
                  }
                />
                <small className={trend}>
                  {trend === "up" ? "↑" : "↓"} vs last week
                </small>
              </Card>
            ))}
          </div>
          <Card className="club-card">
            <div className="row">
              <div>
                <span className="eyebrow">From the club</span>
                <h2>Consistency league</h2>
              </div>
              <Award size={25} />
            </div>
            {[
              ["1", "Mira", "96%"],
              ["2", "You", "91%"],
              ["3", "Arjun", "89%"],
            ].map((row, i) => (
              <div
                className={`leader-row ${i === 1 ? "you" : ""}`}
                key={row[1]}
              >
                <span>{row[0]}</span>
                <div className="avatar">{row[1][0]}</div>
                <strong>{row[1]}</strong>
                <span>{row[2]}</span>
              </div>
            ))}
          </Card>
        </>
      )}
      {section === "Water" && <WaterDetail water={water} setWater={setWater} />}
      {section === "Fasting" && <FastingDetail />}
      {section === "New" && <NewInsights />}
      <button
        className="camera-fab"
        onClick={() => go("scan-hub")}
        aria-label="Open scan hub"
      >
        <Camera size={25} />
        <span>5</span>
        <small>scans left</small>
      </button>
    </main>
  );
}

function WaterDetail({
  water,
  setWater,
}: {
  water: number;
  setWater: (value: number) => void;
}) {
  return (
    <div className="detail-state">
      <div className="water-orb">
        <Droplets size={42} />
        <strong>{water}</strong>
        <span>of 2,400 ml</span>
      </div>
      <h2>Hydration keeps everything moving.</h2>
      <p>You're 2 glasses behind your usual Thursday pace.</p>
      <div className="quick-grid">
        {[250, 500, 750].map((value) => (
          <Button
            key={value}
            variant="dark"
            onClick={() => setWater(water + value)}
          >
            + {value} ml
          </Button>
        ))}
      </div>
      <Card>
        <span className="label">Today's rhythm</span>
        <MiniBars />
        <p>Best hydration window: 8–11am</p>
      </Card>
    </div>
  );
}

function FastingDetail() {
  return (
    <div className="detail-state">
      <div className="fast-orb">
        <Flame size={38} />
        <strong>14:26</strong>
        <span>of 16 hours</span>
      </div>
      <h2>Your body is in the fat-burning zone.</h2>
      <p>Stay hydrated. Your eating window opens at 6:30pm.</p>
      <Button variant="accent">End fast early</Button>
      <Card>
        <div className="row">
          <span>
            <strong>8 day</strong>
            <small>Current streak</small>
          </span>
          <span>
            <strong>12 day</strong>
            <small>Best streak</small>
          </span>
        </div>
      </Card>
    </div>
  );
}

function NewInsights() {
  return (
    <div className="detail-state">
      <Card className="insight-feature">
        <Sparkles size={24} />
        <span className="eyebrow">Fresh today</span>
        <h2>Your fiber rhythm is changing.</h2>
        <p>
          You hit 25g+ on 4 of the last 6 days. Your evening cravings fell 12%
          in the same period.
        </p>
        <Button variant="dark">Explore pattern</Button>
      </Card>
      <Card>
        <Cloud size={22} />
        <h3>Warm weather pick</h3>
        <p>
          Cucumber chaas is ranked #1 for hydration, budget, and your
          preferences.
        </p>
      </Card>
    </div>
  );
}

function DietPlan() {
  const [tab, setTab] = useState("Diet Plan");
  const [swapped, setSwapped] = useState(false);
  const tabs = ["Diet Plan", "Grocery List", "Supplements", "Lifestyle"];
  return (
    <main className="page tab-page">
      <TopStatus />
      <Header
        title="Your 28-day plan"
        eyebrow="Week 2 · Day 11"
        action={<IconButton icon={Settings2} label="Edit plan" />}
      />
      <div className="tab-chips scroll">
        {tabs.map((item) => (
          <Chip key={item} active={tab === item} onClick={() => setTab(item)}>
            {item}
          </Chip>
        ))}
      </div>
      {tab === "Diet Plan" && (
        <>
          <Card className="target-card">
            <span className="eyebrow">Today's target</span>
            <div className="row">
              <strong>
                1,820 <small>kcal</small>
              </strong>
              <span className="positive-pill">Eggitarian</span>
            </div>
            <p>104g protein · 208g carbs · 62g fat</p>
            <div className="target-track">
              <span />
            </div>
          </Card>
          <div className="calendar-strip">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <div
                className={index === 3 ? "active" : index < 3 ? "done" : ""}
                key={`${day}${index}`}
              >
                <span>{day}</span>
                <strong>{9 + index}</strong>
                {index < 3 && <Check size={11} />}
              </div>
            ))}
          </div>
          <div className="section-title">
            <div>
              <span className="eyebrow">Morning · 8:30am</span>
              <h2>Breakfast</h2>
            </div>
            <span>420 kcal</span>
          </div>
          {[0, 1, 2].map((option) => (
            <Card
              className={`meal-option ${option === 0 ? "selected" : ""}`}
              key={option}
            >
              <span className="option-tag">Option {option + 1}</span>
              <NextImage
                src={meals[option].image}
                alt=""
                width={124}
                height={124}
                sizes="62px"
                unoptimized
              />
              <div>
                <strong>
                  {option === 0
                    ? swapped
                      ? "Spinach feta omelette"
                      : "Masala omelette & toast"
                    : meals[option].name}
                </strong>
                <span>
                  {option === 0 ? "28g protein · 12 min" : meals[option].meta}
                </span>
                <div className="rank-score">
                  <Sparkles size={12} /> {94 - option * 5}% fit
                </div>
              </div>
              <button onClick={() => setSwapped(true)}>
                <RefreshCw size={17} /> Swap
              </button>
            </Card>
          ))}
          <Button variant="dark">
            <RefreshCw size={17} /> Regenerate today
          </Button>
        </>
      )}
      {tab === "Grocery List" && <GroceryList />}
      {tab === "Supplements" && <Supplements />}
      {tab === "Lifestyle" && <Lifestyle />}
    </main>
  );
}

function GroceryList() {
  return (
    <div className="stack">
      <Card className="budget-card">
        <div className="row">
          <div>
            <span className="label">Weekly budget</span>
            <strong>
              ₹1,680 <small>/ ₹2,000</small>
            </strong>
          </div>
          <WalletCards size={25} />
        </div>
        <div className="target-track">
          <span style={{ width: "84%" }} />
        </div>
      </Card>
      {[
        ["Produce", "Spinach, cucumber, tomato", "₹420"],
        ["Protein", "Eggs, paneer, Greek yogurt", "₹780"],
        ["Pantry", "Oats, lentils, seeds", "₹480"],
      ].map(([aisle, items, price]) => (
        <Card key={aisle}>
          <div className="row">
            <div>
              <span className="eyebrow">{aisle}</span>
              <h3>{items}</h3>
            </div>
            <strong>{price}</strong>
          </div>
          <button className="cheap-link">
            Find cheaper swaps <ChevronRight size={14} />
          </button>
        </Card>
      ))}
      <Button variant="accent">
        <ShoppingBasket size={18} /> Shop this list
      </Button>
    </div>
  );
}

function Supplements() {
  return (
    <div className="stack">
      <Card className="safety-card">
        <ShieldCheck size={23} />
        <div>
          <strong>Evidence-first suggestions</strong>
          <p>Always confirm supplements with your clinician.</p>
        </div>
      </Card>
      {[
        [
          "Vitamin D3",
          "Your intake and sun exposure suggest a gap",
          "High confidence",
        ],
        [
          "Omega-3",
          "Helpful with your current eggitarian pattern",
          "Medium confidence",
        ],
      ].map(([name, copy, confidence]) => (
        <Card key={name}>
          <div className="row">
            <div>
              <h3>{name}</h3>
              <p>{copy}</p>
            </div>
            <span className="score-pill">{confidence}</span>
          </div>
          <button className="cheap-link">
            View evidence <ChevronRight size={14} />
          </button>
        </Card>
      ))}
    </div>
  );
}

function Lifestyle() {
  return (
    <div className="stack">
      {[
        [Moon, "Sleep anchor", "Aim for 10:45pm tonight", "7h 24m"],
        [Footprints, "Movement snack", "10 minute walk after lunch", "2 of 3"],
        [Droplets, "Hydration rhythm", "Drink before each coffee", "1.25L"],
      ].map(([Icon, title, copy, metric]) => {
        const C = Icon as LucideIcon;
        return (
          <Card key={String(title)} className="lifestyle-row">
            <div className="lifestyle-icon">
              <C size={21} />
            </div>
            <div>
              <strong>{String(title)}</strong>
              <p>{String(copy)}</p>
            </div>
            <span>{String(metric)}</span>
          </Card>
        );
      })}
    </div>
  );
}

function ProgressScreen() {
  const [range, setRange] = useState("Week");
  return (
    <main className="page tab-page">
      <TopStatus />
      <Header
        title="Progress, not perfection"
        eyebrow="Your last 30 days"
        action={<IconButton icon={MoreHorizontal} label="More" />}
      />
      <Card className="streak-hero">
        <div>
          <span className="eyebrow">Current streak</span>
          <strong>
            11 <small>days</small>
          </strong>
          <p>Top 8% of the NutriScan club</p>
        </div>
        <div className="streak-flame">
          <Flame size={38} fill="currentColor" />
        </div>
      </Card>
      <div className="tab-chips">
        {["Today", "Week", "30 Days"].map((item) => (
          <Chip
            key={item}
            active={range === item}
            onClick={() => setRange(item)}
          >
            {item}
          </Chip>
        ))}
      </div>
      <Card className="consistency">
        <div className="row">
          <div>
            <span className="label">Weekly consistency</span>
            <strong>91%</strong>
          </div>
          <span className="positive-pill">
            <TrendingUp size={13} /> +6%
          </span>
        </div>
        <div className="week-bars">
          {[70, 88, 78, 96, 89, 100, 91].map((value, index) => (
            <div key={index}>
              <i>
                <span style={{ height: `${value}%` }} />
              </i>
              <small>{["M", "T", "W", "T", "F", "S", "S"][index]}</small>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="row">
          <div>
            <span className="label">June activity</span>
            <h2>Calendar heatmap</h2>
          </div>
          <span className="score-pill">22 active days</span>
        </div>
        <div className="heatmap">
          {Array.from({ length: 35 }).map((_, index) => (
            <i key={index} className={`heat-${index % 5}`} />
          ))}
        </div>
      </Card>
      <Card className="forecast-card">
        <div className="row">
          <div>
            <span className="eyebrow">Predictive trend</span>
            <h2>64.8 kg by August</h2>
          </div>
          <TrendingDown size={22} />
        </div>
        <svg viewBox="0 0 330 100">
          <path
            d="M0 14 C50 20 80 21 110 38 S175 42 210 61 S275 72 330 88"
            fill="none"
            stroke="#D4F06B"
            strokeWidth="4"
          />
          <path
            d="M210 61 C255 70 280 78 330 88"
            fill="none"
            stroke="#D4F06B"
            strokeDasharray="6 8"
            strokeWidth="4"
          />
        </svg>
        <p>
          If protein adherence stays above 80%, your goal remains comfortably in
          range.
        </p>
      </Card>
      <div className="section-title">
        <div>
          <span className="eyebrow">AI-detected</span>
          <h2>Behavior patterns</h2>
        </div>
      </div>
      <Card className="pattern-row">
        <div className="pattern-icon">
          <Moon size={20} />
        </div>
        <div>
          <strong>Sleep protects your choices</strong>
          <p>Good-sleep days average 146 fewer snack calories.</p>
        </div>
      </Card>
      <Card className="pattern-row">
        <div className="pattern-icon orange">
          <Activity size={20} />
        </div>
        <div>
          <strong>Lunch timing risk</strong>
          <p>Lunch after 3pm doubles evening cravings.</p>
        </div>
      </Card>
      <Button variant="dark">
        <BookOpen size={17} /> Export health report
      </Button>
    </main>
  );
}

function NutriBites() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hi Aanya. I connected your meals, sleep, activity and goals. What would you like to understand today?",
    },
  ]);
  const [thinking, setThinking] = useState(false);
  const send = async (text = message) => {
    if (!text.trim()) return;
    setMessages((items) => [...items, { type: "user", text }]);
    setMessage("");
    setThinking(true);
    try {
      const response = await nutritionService.askAI(text);
      setMessages((items) => [...items, { type: "ai", text: response }]);
    } catch (reason) {
      setMessages((items) => [
        ...items,
        {
          type: "ai",
          text:
            reason instanceof Error
              ? reason.message
              : "I couldn’t answer that right now.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };
  return (
    <main className="chat-page tab-page">
      <div className="chat-header">
        <IconButton icon={MoreHorizontal} label="Chat history" />
        <div>
          <strong>NutriBites</strong>
          <span>
            <i /> Your nutrition co-pilot
          </span>
        </div>
        <IconButton icon={Settings2} label="AI memory" />
      </div>
      <div className="chat-scroll">
        <div className="ai-intro">
          <div className="bot-orb">
            <Sparkles size={27} />
          </div>
          <span className="eyebrow">Powered by your whole health picture</span>
          <h1>
            Ask better questions.
            <br />
            <em>Get personal answers.</em>
          </h1>
        </div>
        <div className="suggestion-grid">
          {[
            "What should I eat next?",
            "Why is my energy low?",
            "Compare paneer vs tofu",
            "Plan a high-protein dinner",
          ].map((text) => (
            <button key={text} onClick={() => send(text)}>
              {text}
              <ArrowRight size={14} />
            </button>
          ))}
        </div>
        {messages.map((item, index) => (
          <div className={`message ${item.type}`} key={index}>
            {item.type === "ai" && (
              <div className="mini-bot">
                <Bot size={14} />
              </div>
            )}
            <div>
              <p>{item.text}</p>
              {item.type === "ai" && index > 0 && (
                <>
                  <div className="citations">
                    <span>WHO</span>
                    <span>ICMR</span>
                    <span>USDA</span>
                    <span>94% confidence</span>
                  </div>
                  <div className="feedback">
                    <button>
                      <ThumbsUp size={14} />
                    </button>
                    <button>
                      <ThumbsDown size={14} />
                    </button>
                    <button>More like this</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="message ai">
            <div className="mini-bot">
              <Bot size={14} />
            </div>
            <div className="thinking">
              <span>Searching trusted sources</span>
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
      </div>
      <div className="universal-input">
        <button aria-label="Attach image">
          <Image size={20} />
        </button>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && send()}
          placeholder="Ask with text, voice or image..."
        />
        <button aria-label="Voice input">
          <Mic size={20} />
        </button>
        <button className="send" onClick={() => send()} aria-label="Send">
          <ArrowRight size={19} />
        </button>
      </div>
    </main>
  );
}

function Profile({
  go,
  profile,
  user,
}: {
  go: (screen: Screen) => void;
  profile: NutritionProfile;
  user: { name?: string; email?: string } | null;
}) {
  const [light, setLight] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);
  const groups = [
    {
      title: "Your nutrition",
      items: [
        ["All meals", Utensils],
        ["Favourites", Heart],
        ["Diet plan", ListChecks],
        ["Modify macros", Activity],
        ["Repeat meals", RefreshCw],
      ],
    },
    {
      title: "Preferences",
      items: [
        ["Personalised assessment", Target],
        ["Customize home", Settings2],
        ["Units & language", BookOpen],
        ["Appearance", light ? Moon : Sun],
        ["Vacation mode", Cloud],
      ],
    },
    {
      title: "Connected health",
      items: [
        ["Health Connect", Activity],
        ["Reminders", Bell],
        ["Share food timeline", ArrowRight],
        ["Data & account", ShieldCheck],
      ],
    },
  ];
  return (
    <main className="page tab-page profile-page">
      <TopStatus />
      <div className="profile-hero">
        <div className="profile-avatar">
          {(user?.name || user?.email || "N").slice(0, 1).toUpperCase()}
          <i />
        </div>
        <div>
          <h1>{user?.name || "NutriScan member"}</h1>
          <p>{user?.email || "Your private nutrition profile"}</p>
          <div>
            <span>Eggitarian</span>
            <span>{profile.goal}</span>
            {profile.healthConditions[0] && (
              <span>{profile.healthConditions[0]}</span>
            )}
          </div>
        </div>
        <IconButton icon={Settings2} label="Settings" />
      </div>
      <Card className="prompt-card">
        <span className="eyebrow">Ask yourself</span>
        <h2>What choice today made you feel proud?</h2>
        <button>
          Write a reflection <ArrowRight size={15} />
        </button>
      </Card>
      <Card className="memory-card">
        <div className="row">
          <div>
            <span className="eyebrow">AI memory</span>
            <h2>What NutriBites remembers</h2>
          </div>
          <Bot size={23} />
        </div>
        <div className="memory-tags">
          <span>Hates mushrooms</span>
          <span>Prefers Indian breakfasts</span>
          <span>Budget-conscious</span>
        </div>
        <button>Edit memory</button>
      </Card>
      <Card className="safety-profile">
        <ShieldCheck size={23} />
        <div>
          <strong>Allergy & safety profile</strong>
          <p>Peanut alert active · Lactose sensitivity</p>
        </div>
        <ChevronRight size={18} />
      </Card>
      {groups.map((group) => (
        <div className="settings-group" key={group.title}>
          <span className="eyebrow">{group.title}</span>
          <Card>
            {group.items.map(([label, Icon], index) => {
              const C = Icon as LucideIcon;
              return (
                <button
                  key={String(label)}
                  onClick={() =>
                    label === "Appearance"
                      ? setLight(!light)
                      : label === "Diet plan"
                        ? go("diet-plan")
                        : undefined
                  }
                >
                  <span>
                    <C size={18} />
                    {String(label)}
                  </span>
                  {label === "Appearance" ? (
                    <i className={`switch ${light ? "on" : ""}`} />
                  ) : (
                    <ChevronRight size={17} />
                  )}
                </button>
              );
            })}
          </Card>
        </div>
      ))}
      <Card className="premium-card">
        <div>
          <span className="eyebrow">NutriScan Premium</span>
          <h2>Unlock your full health picture</h2>
          <p>Unlimited scans, deeper trends and smarter plans.</p>
        </div>
        <Button variant="accent" onClick={() => go("paywall")}>
          Unlock Premium
        </Button>
      </Card>
      <div className="widget-preview">
        <span className="eyebrow">Home screen widget</span>
        <Card>
          <div className="widget-ring">72%</div>
          <div>
            <strong>Protein pace</strong>
            <p>32g left today</p>
          </div>
          <span>NutriScan</span>
        </Card>
      </div>
      <Button
        variant="dark"
        onClick={async () => {
          await fetch("/api/app-auth/logout", { method: "POST" });
          await endAuthSession().catch(() => undefined);
          window.location.assign("/");
        }}
      >
        Sign out
      </Button>
    </main>
  );
}

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
};

function BarcodeScanner({
  onFound,
  onCancel,
  onClose,
  loading,
  error,
}: {
  onFound: (code: string) => void;
  onCancel: () => void;
  onClose: () => void;
  loading: boolean;
  error: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const foundRef = useRef(onFound);
  const [manualCode, setManualCode] = useState("");
  const [cameraMessage, setCameraMessage] = useState("Starting camera…");

  useEffect(() => {
    foundRef.current = onFound;
  }, [onFound]);

  useEffect(() => {
    let stream: MediaStream | undefined;
    let timeout = 0;
    let stopped = false;
    let detecting = false;
    const Detector = (
      window as unknown as { BarcodeDetector?: BarcodeDetectorConstructor }
    ).BarcodeDetector;
    const detector = Detector
      ? new Detector({
          formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"],
        })
      : null;

    const detect = async () => {
      const video = videoRef.current;
      if (stopped || !video || !detector) return;
      if (video.readyState >= 2 && !detecting) {
        detecting = true;
        try {
          const results = await detector.detect(video);
          if (results[0]?.rawValue) {
            stopped = true;
            foundRef.current(results[0].rawValue);
            return;
          }
        } catch {
          // Individual frames can fail while the camera is focusing; keep scanning.
        } finally {
          detecting = false;
        }
      }
      timeout = window.setTimeout(detect, 350);
    };

    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraMessage(
          "Camera scanning isn’t supported here. Enter the barcode below.",
        );
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (stopped || !videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraMessage(
          detector
            ? "Center the barcode inside the frame"
            : "Automatic detection isn’t supported on this browser. Enter the number below.",
        );
        if (detector) detect();
      } catch {
        setCameraMessage(
          "Camera access was blocked. Enter the barcode number below.",
        );
      }
    };

    start();
    return () => {
      stopped = true;
      window.clearTimeout(timeout);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const submit = () => {
    if (!loading) onFound(manualCode);
  };

  return (
    <div className="barcode-scanner">
      <div className="row barcode-heading">
        <IconButton
          icon={ArrowLeft}
          label="Back to scan options"
          onClick={onCancel}
        />
        <div>
          <span className="eyebrow">Packaged food</span>
          <h2>Scan the barcode</h2>
        </div>
        <IconButton icon={X} label="Close" onClick={onClose} />
      </div>
      <div className="camera-preview">
        <video
          ref={videoRef}
          muted
          playsInline
          aria-label="Barcode camera preview"
        />
        <div className="barcode-frame">
          <i />
          <i />
          <i />
          <i />
          <span className="scan-beam" />
        </div>
        <div className="camera-hint">
          <Barcode size={16} />
          {cameraMessage}
        </div>
      </div>
      <div className="manual-divider">
        <span>or enter it manually</span>
      </div>
      <label className="barcode-input">
        <span>Barcode number</span>
        <div>
          <Barcode size={20} />
          <input
            value={manualCode}
            onChange={(event) =>
              setManualCode(event.target.value.replace(/\D/g, "").slice(0, 14))
            }
            onKeyDown={(event) => event.key === "Enter" && submit()}
            inputMode="numeric"
            autoComplete="off"
            placeholder="e.g. 3017620422003"
            aria-label="Barcode number"
          />
        </div>
      </label>
      {error && (
        <div className="barcode-error" role="alert">
          <WifiOff size={16} />
          <span>{error}</span>
        </div>
      )}
      <Button variant="accent" onClick={submit}>
        <Search size={18} /> Look up food
      </Button>
      <button className="demo-barcode" onClick={() => onFound("1234567890128")}>
        No product nearby? <strong>Try a demo barcode</strong>
      </button>
      {loading && (
        <div className="scan-loading">
          <div className="spinner" />
          Fetching product nutrition…
        </div>
      )}
    </div>
  );
}

function ScanHub({
  go,
  onResult,
  profile,
}: {
  go: (screen: Screen) => void;
  onResult: (food: FoodAnalysis) => void;
  profile: NutritionProfile;
}) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"menu" | "barcode">("menu");
  const [error, setError] = useState("");
  const [pendingMode, setPendingMode] = useState<
    "camera" | "label" | "gallery"
  >("camera");
  const fileInput = useRef<HTMLInputElement>(null);

  const scan = async (mode: ScanMode) => {
    if (mode === "barcode") {
      setMode("barcode");
      return;
    }
    if (mode === "camera" || mode === "label" || mode === "gallery") {
      setPendingMode(mode);
      fileInput.current?.click();
      return;
    }
    const description = window.prompt(
      mode === "voice"
        ? "Describe what you ate"
        : "Type the food or meal you ate",
    );
    if (!description) return;
    setLoading(true);
    setError("");
    try {
      const result = await nutritionService.analyzeFood(mode, profile, {
        description,
      });
      onResult(result);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "We couldn’t analyze that food.",
      );
      setLoading(false);
    }
  };
  const analyzeImage = async (file?: File) => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const result = await nutritionService.analyzeFood(pendingMode, profile, {
        image: file,
      });
      onResult(result);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "We couldn’t analyze that image.",
      );
      setLoading(false);
    }
  };
  const lookupBarcode = async (code: string) => {
    setError("");
    setLoading(true);
    try {
      const result = await nutritionService.lookupBarcode(code);
      onResult(result);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "We couldn’t look up that product.",
      );
      setLoading(false);
    }
  };
  const actions: [string, string, LucideIcon, ScanMode][] = [
    ["Camera", "Recognize a meal", Camera, "camera"],
    ["Barcode", "Scan a product", Barcode, "barcode"],
    ["Food label", "Read ingredients", ScanLine, "label"],
    ["Gallery", "Choose a photo", Image, "gallery"],
    ["Voice", "Describe your meal", Mic, "voice"],
    ["Text", "Type what you ate", Search, "text"],
  ];
  return (
    <div className="modal-layer">
      <button
        className="modal-backdrop"
        onClick={() => go("home")}
        aria-label="Close"
      />
      <section className="bottom-sheet">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          capture={pendingMode === "gallery" ? undefined : "environment"}
          hidden
          onChange={(event) => {
            void analyzeImage(event.target.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
        <div className="sheet-handle" />
        {mode === "barcode" ? (
          <BarcodeScanner
            onFound={lookupBarcode}
            onCancel={() => setMode("menu")}
            onClose={() => go("home")}
            loading={loading}
            error={error}
          />
        ) : (
          <>
            <div className="row">
              <div>
                <span className="eyebrow">Universal AI input</span>
                <h2>How do you want to scan?</h2>
              </div>
              <IconButton icon={X} label="Close" onClick={() => go("home")} />
            </div>
            <div className="scan-grid">
              {actions.map(([title, copy, Icon, actionMode]) => (
                <button key={title} onClick={() => scan(actionMode)}>
                  <span>
                    <Icon size={23} />
                  </span>
                  <strong>{title}</strong>
                  <small>{copy}</small>
                </button>
              ))}
            </div>
            <button className="multi-scan" onClick={() => scan("camera")}>
              <Sparkles size={21} />
              <div>
                <strong>Multi-item meal</strong>
                <span>Recognize everything on your plate at once</span>
              </div>
              <ChevronRight size={18} />
            </button>
            <button className="multi-scan" onClick={() => go("scan-history")}>
              <History size={21} />
              <div>
                <strong>Scan history</strong>
                <span>View your previously analyzed foods</span>
              </div>
              <ChevronRight size={18} />
            </button>
            <div className="quota">
              <span>
                <Zap size={14} /> 5 free scans left
              </span>
              <span>Resets in 2 days</span>
            </div>
            {error && (
              <div className="barcode-error" role="alert">
                <WifiOff size={16} />
                <span>{error}</span>
              </div>
            )}
            {loading && (
              <div className="scan-loading">
                <div className="spinner" />
                Analyzing your food...
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function BarcodeFoodResult({
  go,
  food,
  backScreen,
}: {
  go: (screen: Screen) => void;
  food: FoodAnalysis;
  backScreen: Screen;
}) {
  const scoreColor =
    food.personalizedScore >= 80
      ? "#D4F06B"
      : food.personalizedScore >= 65
        ? "#3DDBB0"
        : food.personalizedScore >= 45
          ? "#FFB454"
          : "#FF6B6B";
  const nutrients = [
    ["Energy", `${food.calories}`, "kcal"],
    ["Protein", food.protein.toFixed(1), "g"],
    ["Carbs", food.carbs.toFixed(1), "g"],
    ["Fat", food.fat.toFixed(1), "g"],
    ["Fiber", food.fiber.toFixed(1), "g"],
    ["Sugar", food.sugar.toFixed(1), "g"],
  ];

  return (
    <main className="food-result barcode-result">
      <div className="product-hero">
        <IconButton
          icon={ArrowLeft}
          label="Back"
          onClick={() => go(backScreen)}
        />
        <div className="product-image">
          {food.image ? (
            <NextImage
              src={food.image}
              alt={`${food.name} package`}
              width={320}
              height={320}
              unoptimized={food.image.startsWith("http")}
            />
          ) : (
            <Barcode size={72} strokeWidth={1.2} />
          )}
        </div>
        <div className="verified-product">
          <ShieldCheck size={14} /> Product data found
        </div>
      </div>
      <div className="result-body product-body">
        <div className="product-title">
          <span className="eyebrow">{food.brand || "Packaged food"}</span>
          <h1>{food.name}</h1>
          <span className="barcode-number">
            <Barcode size={13} /> {food.barcode}
          </span>
        </div>
        <Card className="personal-score-card">
          <div
            className="personal-score-ring"
            style={{
              background: `conic-gradient(${scoreColor} ${food.personalizedScore}%, var(--subtle) 0)`,
            }}
          >
            <div>
              <strong>{food.personalizedScore}</strong>
              <span>/100</span>
            </div>
          </div>
          <div>
            <span className="eyebrow">Your NutriScore</span>
            <h2 style={{ color: scoreColor }}>{food.scoreLabel}</h2>
            <p>
              Personalized for{" "}
              {food.healthConditions.join(" + ") || "your health profile"}
            </p>
          </div>
        </Card>
        <Card className="score-explanation">
          <Sparkles size={21} />
          <div>
            <h3>Why this score?</h3>
            <p>{food.explanation}</p>
          </div>
        </Card>
        <div className="score-signals">
          <div>
            <span>What works</span>
            {food.positives.slice(0, 2).map((item) => (
              <p key={item}>
                <Check size={14} /> {item}
              </p>
            ))}
          </div>
          <div>
            <span>Watch out</span>
            {food.cautions.slice(0, 2).map((item) => (
              <p key={item}>
                <Activity size={14} /> {item}
              </p>
            ))}
          </div>
        </div>
        <div className="section-title">
          <div>
            <span className="eyebrow">Per 100 grams</span>
            <h2>Nutrition details</h2>
          </div>
          {food.servingSize && (
            <span className="serving-pill">Serving {food.servingSize}</span>
          )}
        </div>
        <Card className="nutrition-grid">
          {nutrients.map(([label, value, unit]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>
                {value}
                <small>{unit}</small>
              </strong>
            </div>
          ))}
        </Card>
        {food.ingredients.length > 0 && (
          <>
            <div className="section-title">
              <div>
                <span className="eyebrow">From the package</span>
                <h2>Ingredients</h2>
              </div>
            </div>
            <Card className="product-ingredients">
              {food.ingredients.map((ingredient, index) => (
                <span key={`${ingredient}-${index}`}>{ingredient}</span>
              ))}
            </Card>
          </>
        )}
        <p className="score-disclaimer">
          This score is nutrition guidance, not a medical diagnosis. Check the
          package for allergy information.
        </p>
        <Button onClick={() => go("scan-hub")}>
          <Barcode size={18} /> Scan another product
        </Button>
      </div>
    </main>
  );
}

function ScanHistory({
  go,
  onSelect,
}: {
  go: (screen: Screen) => void;
  onSelect: (food: FoodAnalysis) => void;
}) {
  type Scan = Awaited<
    ReturnType<typeof nutritionService.getScanHistory>
  >["scans"];

  const [scans, setScans] = useState<Scan>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    nutritionService
      .getScanHistory()
      .then((data) => {
        if (active) setScans(data.scans);
      })
      .catch((reason) => {
        if (active) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Could not load your scan history.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="page">
      <div className="row">
        <IconButton icon={ArrowLeft} label="Back" onClick={() => go("home")} />
        <span className="eyebrow">Your nutrition journey</span>
        <span />
      </div>

      <div style={{ marginTop: 28, marginBottom: 24 }}>
        <span className="eyebrow">Past activity</span>
        <h1>Scan History</h1>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Your previously analyzed foods and products.
        </p>
      </div>

      {loading && (
        <div className="scan-loading">
          <div className="spinner" />
          Loading your scans...
        </div>
      )}

      {error && (
        <div className="barcode-error" role="alert">
          <WifiOff size={16} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && scans.length === 0 && (
        <Card>
          <History size={30} />
          <h3>No scans yet</h3>
          <p>Your saved food scans will appear here.</p>
          <Button onClick={() => go("scan-hub")}>Start scanning</Button>
        </Card>
      )}

      {!loading && scans.length > 0 && (
        <div className="stack">
          {scans.map((scan) => (
            <Card
              key={scan.id}
              className="scan-history-card"
              onClick={() => onSelect(scan.result)}
            >
              <div className="row">
                <div style={{ minWidth: 0, flex: 1 }}>
                  <span className="eyebrow">{scan.mode} scan</span>
                  <h3>{scan.foodName}</h3>
                  {scan.brand && (
                    <p style={{ color: "var(--muted)" }}>{scan.brand}</p>
                  )}
                  <small style={{ color: "var(--muted)" }}>
                    {new Date(scan.createdAt).toLocaleString()}
                  </small>
                </div>

                <div className="grade">
                  {scan.personalizedScore ?? scan.result.personalizedScore}
                  <small>Score</small>
                </div>

                <ChevronRight size={18} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

function FoodResult({
  go,
  food,
  backScreen,
}: {
  go: (screen: Screen) => void;
  food: FoodAnalysis | null;
  backScreen: Screen;
}) {
  const [portion, setPortion] = useState(150);

  if (!food) {
    return (
      <main className="page">
        <IconButton
          icon={ArrowLeft}
          label="Back"
          onClick={() => go(backScreen)}
        />
        <h2>Result unavailable</h2>
        <p>No food analysis is available to display.</p>
      </main>
    );
  }

  if (food.source === "barcode") {
    return <BarcodeFoodResult go={go} food={food} backScreen={backScreen} />;
  }

  const multiplier = portion / 150;
  const scoreColor =
    food.personalizedScore >= 80
      ? "#D4F06B"
      : food.personalizedScore >= 65
        ? "#3DDBB0"
        : food.personalizedScore >= 45
          ? "#FFB454"
          : "#FF6B6B";

  const nutrients = [
    ["Energy", `${Math.round(food.calories * multiplier)}`, "kcal"],
    ["Protein", food.protein * multiplier, "g"],
    ["Carbs", food.carbs * multiplier, "g"],
    ["Fat", food.fat * multiplier, "g"],
    ["Fiber", food.fiber * multiplier, "g"],
    ["Sugar", food.sugar * multiplier, "g"],
  ] as const;

  return (
    <main className="food-result">
      <div className="food-hero">
        {food.image ? (
          <NextImage
            src={food.image}
            alt={food.name}
            width={800}
            height={730}
            unoptimized={food.image.startsWith("http")}
            priority
          />
        ) : (
          <div className="product-image">
            <Utensils size={72} strokeWidth={1.2} />
          </div>
        )}
        <div className="food-overlay" />
        <IconButton
          icon={ArrowLeft}
          label="Back"
          onClick={() => go(backScreen)}
        />
        <div className="portion-frame">
          <span>{portion}g estimate</span>
        </div>
      </div>

      <div className="result-body">
        <div className="row result-title">
          <div>
            <span className="eyebrow">AI meal analysis</span>
            <h1>{food.name}</h1>
          </div>
          <div className="grade">
            {food.nutriScore}
            <small>NutriScore</small>
          </div>
        </div>

        <div className="confidence">
          <span>
            <ShieldCheck size={15} /> {food.confidence}% confidence
          </span>
          <span>{food.servingSize || "Estimated portion"}</span>
        </div>

        <div className="macro-summary">
          <span>
            <strong>{Math.round(food.calories * multiplier)}</strong>
            <small>kcal</small>
          </span>
          <span>
            <strong>{(food.protein * multiplier).toFixed(1)}g</strong>
            <small>protein</small>
          </span>
          <span>
            <strong>{(food.carbs * multiplier).toFixed(1)}g</strong>
            <small>carbs</small>
          </span>
          <span>
            <strong>{(food.fat * multiplier).toFixed(1)}g</strong>
            <small>fat</small>
          </span>
        </div>

        <Card className="personal-score-card">
          <div
            className="personal-score-ring"
            style={{
              background: `conic-gradient(${scoreColor} ${food.personalizedScore}%, var(--subtle) 0)`,
            }}
          >
            <div>
              <strong>{food.personalizedScore}</strong>
              <span>/100</span>
            </div>
          </div>
          <div>
            <span className="eyebrow">Your nutrition score</span>
            <h2 style={{ color: scoreColor }}>{food.scoreLabel}</h2>
            <p>
              Personalized for{" "}
              {food.healthConditions.join(" + ") || "your nutrition profile"}
            </p>
          </div>
        </Card>

        <Card className="safety-banner">
          <ShieldCheck size={23} />
          <div>
            <strong>Profile considerations</strong>
            <p>
              {food.cautions.length > 0
                ? food.cautions.join(". ")
                : "No specific cautions were returned by the analysis."}
            </p>
          </div>
        </Card>

        <Card>
          <div className="row">
            <div>
              <span className="label">Portion estimate</span>
              <h2>{portion} grams</h2>
            </div>
            <span className="score-pill">Estimated</span>
          </div>
          <input
            className="portion-slider"
            type="range"
            min="80"
            max="350"
            value={portion}
            onChange={(event) => setPortion(Number(event.target.value))}
          />
          <div className="slider-labels">
            <span>Small</span>
            <span>Large</span>
          </div>
        </Card>

        <div className="section-title">
          <div>
            <span className="eyebrow">Ingredient intelligence</span>
            <h2>What's inside</h2>
          </div>
        </div>

        <Card className="ingredients">
          {food.ingredients.length > 0 ? (
            food.ingredients.map((ingredient, index) => (
              <div key={`${ingredient}-${index}`}>
                <span className={`ingredient-dot i${index % 4}`} />
                <div>
                  <strong>{ingredient}</strong>
                </div>
              </div>
            ))
          ) : (
            <p>No ingredients were identified in this analysis.</p>
          )}
        </Card>

        <Card className="nutrition-grid">
          {nutrients.map(([label, value, unit]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>
                {typeof value === "number" ? value.toFixed(1) : value}
                <small>{unit}</small>
              </strong>
            </div>
          ))}
        </Card>

        <div className="score-strip">
          {(["A", "B", "C", "D", "E"] as const).map((grade) => (
            <span
              key={grade}
              className={food.nutriScore === grade ? "active" : ""}
            >
              {grade}
            </span>
          ))}
        </div>

        <Card className="why-card">
          <Sparkles size={21} />
          <div>
            <h3>Why this score?</h3>
            <p>{food.explanation}</p>
          </div>
        </Card>

        {food.positives.length > 0 && (
          <Card>
            <h3>What works</h3>
            {food.positives.map((item, index) => (
              <p key={`${item}-${index}`}>
                <Check size={14} /> {item}
              </p>
            ))}
          </Card>
        )}

        {food.cautions.length > 0 && (
          <Card>
            <h3>Things to watch</h3>
            {food.cautions.map((item, index) => (
              <p key={`${item}-${index}`}>
                <Activity size={14} /> {item}
              </p>
            ))}
          </Card>
        )}

        <p className="score-disclaimer">
          Nutrition values are estimates and may vary with ingredients and
          portion size. This analysis is not a medical diagnosis.
        </p>

        <Button onClick={() => go("scan-hub")}>
          <ScanLine size={18} /> Scan another food
        </Button>
      </div>
    </main>
  );
}

function Comparison() {
  return (
    <Card className="comparison">
      <span className="winner">Best fit</span>
      <div>
        <section>
          <strong>Current bowl</strong>
          <span>486 kcal</span>
          <small>31g protein</small>
          <small>₹220</small>
        </section>
        <div>vs</div>
        <section className="winning">
          <strong>Tofu power bowl</strong>
          <span>428 kcal</span>
          <small>34g protein</small>
          <small>₹185</small>
        </section>
      </div>
      <p>Better protein, 12% fewer calories, and under your lunch budget.</p>
    </Card>
  );
}

function Paywall({ go }: { go: (screen: Screen) => void }) {
  return (
    <main className="paywall page">
      <IconButton icon={X} label="Close" onClick={() => go("profile")} />
      <div className="premium-orbit">
        <Sparkles size={42} />
        <i />
        <i />
        <i />
      </div>
      <span className="eyebrow">NutriScan Premium</span>
      <h1>
        See the whole story
        <br />
        <em>behind every bite.</em>
      </h1>
      <p>Turn daily food choices into lasting health progress.</p>
      <Card>
        {[
          [
            ScanLine,
            "Unlimited AI scans",
            "Food, label, barcode and multi-item",
          ],
          [Bot, "Deeper AI memory", "Answers that learn with you"],
          [
            TrendingUp,
            "Predictive health trends",
            "See where your habits are heading",
          ],
          [
            ListChecks,
            "Adaptive meal plans",
            "Plans that change when life does",
          ],
        ].map(([Icon, title, copy]) => {
          const C = Icon as LucideIcon;
          return (
            <div className="benefit" key={String(title)}>
              <span>
                <C size={20} />
              </span>
              <div>
                <strong>{String(title)}</strong>
                <p>{String(copy)}</p>
              </div>
              <Check size={18} />
            </div>
          );
        })}
      </Card>
      <div className="price">
        <span>Annual</span>
        <strong>
          ₹1,499 <small>/ year</small>
        </strong>
        <em>Save 58%</em>
      </div>
      <Button variant="accent">Unlock Premium</Button>
      <small>7 days free · Cancel anytime · No hidden fees</small>
    </main>
  );
}

const navItems: [Screen, string, LucideIcon][] = [
  ["home", "Home", Home],
  ["diet-plan", "Diet Plan", Utensils],
  ["progress", "Progress", Activity],
  ["nutribites", "NutriBites", Bot],
  ["profile", "You", CircleUserRound],
];

function BottomNav({
  current,
  go,
}: {
  current: Screen;
  go: (screen: Screen) => void;
}) {
  return (
    <nav className="bottom-nav">
      {navItems.map(([screen, label, Icon]) => (
        <button
          key={screen}
          className={current === screen ? "active" : ""}
          onClick={() => go(screen)}
        >
          <span>
            <Icon
              size={21}
              fill={current === screen ? "currentColor" : "none"}
            />
            {screen === "profile" && <i />}
          </span>
          <small>{label}</small>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [baseScreen, setBaseScreen] = useState<Screen>("home");
  const [scannedFood, setScannedFood] = useState<FoodAnalysis | null>(null);
  const [resultReturnScreen, setResultReturnScreen] =
    useState<Screen>("scan-hub");
  const [nutritionProfile, setNutritionProfile] = useState<NutritionProfile>(
    defaultNutritionProfile,
  );
  const [currentUser, setCurrentUser] = useState<{
    name?: string;
    email?: string;
  } | null>(null);
  useEffect(() => {
    void fetch("/api/app-auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((body: { user?: { name?: string; email?: string } | null }) => {
        if (body.user) {
          setCurrentUser(body.user);
          setScreen("home");
          const savedProfile = sessionStorage.getItem("nutriscan-profile");
          if (savedProfile) {
            void fetch("/api/profile", {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ profile: JSON.parse(savedProfile) }),
            }).then((response) => {
              if (response.ok) sessionStorage.removeItem("nutriscan-profile");
            });
          }
        }
      })
      .catch(() => undefined);
  }, []);
  const go = (next: Screen) => {
    if (
      ["home", "diet-plan", "progress", "nutribites", "profile"].includes(next)
    )
      setBaseScreen(next);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const content = useMemo(() => {
    switch (screen) {
      case "welcome":
        return <Welcome go={go} />;
      case "onboarding":
        return (
          <Onboarding
            go={go}
            onProfileChange={(profile) => {
              setNutritionProfile(profile);
              sessionStorage.setItem(
                "nutriscan-profile",
                JSON.stringify(profile),
              );
            }}
          />
        );
      case "building":
        return <Building go={go} />;
      case "plan-ready":
        return <PlanReady go={go} />;
      case "auth":
        return <Auth go={go} />;
      case "home":
        return <HomeScreen go={go} />;
      case "diet-plan":
        return <DietPlan />;
      case "progress":
        return <ProgressScreen />;
      case "nutribites":
        return <NutriBites />;
      case "profile":
        return (
          <Profile go={go} profile={nutritionProfile} user={currentUser} />
        );
      case "scan-hub":
        return (
          <>
            <HomeScreen go={go} />
            <ScanHub
              go={go}
              onResult={(food) => {
                setScannedFood(food);
                setResultReturnScreen("scan-hub");
                go("food-result");
              }}
              profile={nutritionProfile}
            />
          </>
        );
      case "scan-history":
        return (
          <ScanHistory
            go={go}
            onSelect={(food) => {
              setScannedFood(food);
              setResultReturnScreen("scan-history");
              go("food-result");
            }}
          />
        );
      case "food-result":
        return (
          <FoodResult
            go={go}
            food={scannedFood}
            backScreen={resultReturnScreen}
          />
        );
      case "paywall":
        return <Paywall go={go} />;
    }
  }, [screen, scannedFood, nutritionProfile, currentUser, resultReturnScreen]);
  const showNav = [
    "home",
    "diet-plan",
    "progress",
    "nutribites",
    "profile",
    "scan-hub",
  ].includes(screen);
  return (
    <div className="app-shell">
      <div className="phone-frame">
        <div className="app-content">{content}</div>
        {showNav && (
          <BottomNav
            current={screen === "scan-hub" ? baseScreen : screen}
            go={go}
          />
        )}
      </div>
    </div>
  );
}
