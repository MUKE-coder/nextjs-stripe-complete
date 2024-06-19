import { CheckoutProductProps } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function getActiveProducts() {
  const stripeProducts = await stripe.products.list();
  const activeProducts = stripeProducts.data.filter(
    (item: any) => item.active === true
  );
  return activeProducts;
}
export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json();
    const checkoutProducts: CheckoutProductProps[] = products;
    // Creating Stripe Non existing Stripe Products
    let activeProducts = await getActiveProducts();
    try {
      for (const product of checkoutProducts) {
        const stripeProduct = activeProducts?.find(
          (stripeProduct: any) =>
            stripeProduct?.name?.toLowerCase() === product?.name?.toLowerCase()
        );

        if (stripeProduct === undefined) {
          const unitAmount = Math.round(product.price * 100);

          const prod = await stripe.products.create({
            name: product.name,
            default_price_data: {
              unit_amount: unitAmount,
              currency: "usd",
            },
            images: [product.image],
          });
          console.log(`Product created: ${prod.name}`);
        } else {
          console.log("Product already exists");
        }
      }
    } catch (error) {
      console.error("Error creating products:", error);
    }

    //Creating Checkout Stripe Items
    activeProducts = await getActiveProducts();
    let checkoutStripeProducts: any = [];
    for (const product of checkoutProducts) {
      const stripeProduct = activeProducts?.find(
        (stripeProduct: any) =>
          stripeProduct?.name?.toLowerCase() === product?.name?.toLowerCase()
      );

      if (stripeProduct) {
        checkoutStripeProducts.push({
          price: stripeProduct?.default_price,
          quantity: product.qty,
        });
      }
    }

    //Creating Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log(checkoutStripeProducts);
    const session = await stripe.checkout.sessions.create({
      line_items: checkoutStripeProducts,
      mode: "payment",
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
    });
    console.log(session?.url);
    return NextResponse.json({
      url: session?.url,
    });
  } catch (error) {
    console.log(error);
  }
}
