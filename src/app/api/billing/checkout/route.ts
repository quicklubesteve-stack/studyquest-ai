import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

/**
 * POST /api/billing/checkout
 * Initiates Stripe Test Mode Checkout for StudyQuest Plus (CAD $9.99/mo).
 * Safely falls back to instant local test upgrade if mock keys are present.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      const demoUser = await prisma.user.findFirst({ where: { role: "LEARNER" } });
      if (demoUser) userId = demoUser.id;
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required to manage subscriptions." },
        { status: 401 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    // Check if running in mock/demo mode (placeholder key or dev mode)
    if (!stripeSecretKey || stripeSecretKey.includes("placeholder")) {
      // Instant Test Mode upgrade for seamless local developer testing
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionTier: "PLUS",
          subscriptionStatus: "active",
        },
      });

      return NextResponse.json({
        success: true,
        testModeSimulated: true,
        redirectUrl: `${appUrl}/?billing_status=upgraded&tier=PLUS`,
        message: "Simulated Stripe Test Mode Upgrade applied successfully (CAD $9.99/mo Plus Tier active).",
      });
    }

    // Live Stripe Test Mode integration
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-11-20.acacia" as any,
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "StudyQuest Plus Subscription",
              description: "Unlimited AI Tutor, Voice Learning, Document Studio & Multi-Grade Curriculum",
            },
            unit_amount: 999, // CAD $9.99 in cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: user.email,
      client_reference_id: user.id,
      success_url: `${appUrl}/?billing_status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?billing_status=cancelled`,
      metadata: {
        userId: user.id,
        plan: "PLUS",
      },
    });

    return NextResponse.json({
      success: true,
      testModeSimulated: false,
      redirectUrl: checkoutSession.url,
    });
  } catch (error) {
    console.error("Billing Checkout Error:", error);
    return NextResponse.json(
      { error: "Failed to initiate Stripe checkout." },
      { status: 500 }
    );
  }
}
