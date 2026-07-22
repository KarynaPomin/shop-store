/**
 * order controller
 */

import { factories } from "@strapi/strapi";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY as string);

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async checkout(ctx) {
      const { orderId } = ctx.request.body;

      if (!orderId) {
        ctx.response.status = 400;
        return { error: "orderId is required" };
      }

      try {
        const orders = (await strapi.entityService.findMany(
          "api::order.order",
          {
            filters: {
              orderId,
            },
            populate: {
              order_items: {
                populate: {
                  product: {
                    populate: ["images"],
                  },
                },
              },
            },
          },
        )) as any;

        const order = orders[0];

        if (!order || !order.order_items?.length) {
          ctx.response.status = 404;
          return { error: "Order not found or has no items" };
        }

        const lineItems = order.order_items.map((item: any) => {
          if (!item.product) {
            throw new Error(`order_item ${item.id} has no linked product`);
          }
          return {
            price_data: {
              currency: "usd",
              product_data: { name: item.product.name },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
          };
        });

        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          success_url: `${process.env.CLIENT_URL}?succes=true&orderId=${orderId}`,
          cancel_url: `${process.env.CLIENT_URL}?succes=false`,
          line_items: lineItems,
          shipping_address_collection: { allowed_countries: ["US", "CA"] },
          payment_method_types: ["card"],
          metadata: { orderId },
        });

        return { stripeSession: session };
      } catch (err: any) {
        strapi.log.error("Checkout error:", err);
        ctx.response.status = 500;
        return { error: err.message };
      }
    },
  }),
);
