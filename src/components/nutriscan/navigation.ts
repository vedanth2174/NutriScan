export const navigationMap = {
  public: ['welcome', 'onboarding', 'building', 'plan-ready', 'auth'],
  tabs: ['home', 'diet-plan', 'progress', 'nutribites', 'profile'],
  modal: ['scan-hub', 'food-result', 'scan-history', 'paywall'],
} as const

export type Screen =
  | (typeof navigationMap.public)[number]
  | (typeof navigationMap.tabs)[number]
  | (typeof navigationMap.modal)[number]
