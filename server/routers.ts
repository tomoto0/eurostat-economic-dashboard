import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  dashboard: router({
    getEconomicData: publicProcedure.query(async () => {
      const { getAllEconomicData } = await import("./db");
      return getAllEconomicData();
    }),
    getCountryData: publicProcedure.input((val: any) => {
      if (typeof val !== "string") throw new Error("Country code must be a string");
      return val;
    }).query(async ({ input }) => {
      const { getEconomicDataByCountry } = await import("./db");
      return getEconomicDataByCountry(input);
    }),
    getIndicatorData: publicProcedure.input((val: any) => {
      if (typeof val !== "string") throw new Error("Indicator code must be a string");
      return val;
    }).query(async ({ input }) => {
      const { getEconomicDataByIndicator } = await import("./db");
      return getEconomicDataByIndicator(input);
    }),
    getAnalysisResults: publicProcedure.input((val: any) => {
      return {
        analysisType: val?.analysisType as string | undefined,
        targetCode: val?.targetCode as string | undefined,
      };
    }).query(async ({ input }) => {
      const { getAIAnalysisResults } = await import("./db");
      return getAIAnalysisResults(input.analysisType, input.targetCode);
    }),
  }),

  payment: router({
    createCheckoutSession: publicProcedure.input((val: any) => {
      return {
        productId: val?.productId as string,
      };
    }).mutation(async ({ input, ctx }) => {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const { PREMIUM_ANALYSIS_REPORT } = await import("./products");

      if (!ctx.user) {
        throw new Error("User must be authenticated to create checkout session");
      }

      const product = input.productId === "premium_analysis_report" ? PREMIUM_ANALYSIS_REPORT : null;
      if (!product) {
        throw new Error("Product not found");
      }

      const origin = ctx.req.headers.origin || "https://eurodash-ygpctjpf.manus.space";

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: product.currency.toLowerCase(),
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: product.priceInCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/payment-cancel`,
        customer_email: ctx.user.email || undefined,
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          customer_email: ctx.user.email || "",
          customer_name: ctx.user.name || "",
          product_id: product.id,
        },
        allow_promotion_codes: true,
      });

      if (!session.id) {
        throw new Error("Failed to create checkout session");
      }

      return {
        checkoutUrl: session.url,
        sessionId: session.id,
      };
    }),

    getPurchaseHistory: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new Error("User must be authenticated");
      }

      const { getPurchasesByUserId } = await import("./db");
      return getPurchasesByUserId(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
