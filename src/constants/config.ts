import Stripe from 'stripe';

export const stripeConfig: Stripe.StripeConfig = {
  typescript: true,
  apiVersion: '2024-06-20'
};

export const plan_lookup_keys = ['basic_plan', 'advance_plan'];
