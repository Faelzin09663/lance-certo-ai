export const STRIPE_PLANS = {
  starter: {
    price_id: "price_1SSoHkDHUiJM3dnRCILFgJWr",
    product_id: "prod_TPdY2x0VDdT389",
    name: "Starter",
    price: "R$ 49,99",
  },
  premium: {
    price_id: "price_1SSoHxDHUiJM3dnRO0JzyuM6",
    product_id: "prod_TPdZry595rL8FP",
    name: "Premium",
    price: "R$ 99,99",
  },
} as const;

export type PlanKey = keyof typeof STRIPE_PLANS;
