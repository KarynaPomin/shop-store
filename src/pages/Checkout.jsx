import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Page from "../components/common/Page.jsx";
import Seo from "../components/common/Seo.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { currency } from "../utils/format.js";
import styles from "./Checkout.module.css";
import { useAuth } from "../context/AuthContext.jsx";
import { makeRequest } from "../makeRequest.js";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(6, "Enter a delivery address"),
  city: z.string().min(2, "Enter a city"),
  delivery: z.enum(["standard", "express", "pickup"]),
  payment: z.enum(["PayPal", "BLIK", "Credit Card", "Cash on delivery"]),
});

export default function Checkout() {
  const navigate = useNavigate();
  const { state, cartTotals, clearCart } = useStore();
  // const session = (() => {
  //   try {
  //     return JSON.parse(localStorage.getItem('shop-session')) || { loggedIn: false, email: '' };
  //   } catch {
  //     return { loggedIn: false, email: '' };
  //   }
  // })();
  const { user, session, isLoggedIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user ? `${user.name} ${user.surname}` : "",
      email: user?.email || "",
      address: user?.address || "",
      delivery: "standard",
      paymentMethod: "cash",
    },
  });

  const onSubmit = async (e) => {
    try {
      const { data: order } = await makeRequest.post("/orders", {
        data: {
          orderId: `ORD-${Date.now()}`,
          createAt: new Date().toISOString(),
          totalPrice: cartTotals.total,
          statusOrder: "waiting",
          shippingAdress: e.address,
          paymentMethod: e.payment,
          delivery: e.delivery,
          user: user.id,
          discount: cartTotals.discount,
          notes: "",
        },
      });

      const orderId = order.data.id;

      for (const item of state.cart) {
        await makeRequest.post("/order-items", {
          data: {
            quantity: item.quantity,
            price: item.salePrice || item.price,
            size: item.size,
            color: item.color,
            product: item.id,
            order: orderId,
          },
        });
      }

      alert("Order send!");
    } catch (err) {
      console.error(err);
      console.log(err.response?.data);
    }

    // localStorage.setItem("shop-last-order", JSON.stringify(order));
    clearCart({ type: "CLEAR_CART" });
    navigate("/confirmation");
  };

  return (
    <Page className={styles.page}>
      <Seo
        title="Checkout"
        description="Frontend checkout architecture prepared for payment integrations."
      />
      <h1>Checkout</h1>
      <form className={styles.layout} onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.form}>
          <div className={styles.checkoutMode}>
            <strong>
              {isLoggedIn ? "Account checkout" : "Guest checkout"}
            </strong>
            <p>
              {isLoggedIn
                ? `You are ordering as ${session.email}.`
                : "No account needed. Use your email to receive order updates."}
            </p>
          </div>
          <h2>Shipping address</h2>
          {[
            ["name", "Full name"],
            ["email", "Email"],
            ["address", "Address"],
            ["city", "City"],
          ].map(([name, label]) => (
            <label key={name}>
              {label}
              <input {...register(name)} />
              {errors[name] && <span>{errors[name].message}</span>}
            </label>
          ))}
          <h2>Delivery method</h2>
          <div className={styles.options}>
            <label>
              <input type="radio" value="standard" {...register("delivery")} />{" "}
              Standard delivery
            </label>
            <label>
              <input type="radio" value="express" {...register("delivery")} />{" "}
              Express delivery
            </label>
            <label>
              <input type="radio" value="pickup" {...register("delivery")} />{" "}
              Store pickup
            </label>
          </div>
          <h2>Payment</h2>
          <div className={styles.options}>
            <label>
              <input type="radio" value="PayPal" {...register("payment")} />{" "}
              PayPal placeholder
            </label>
            <label>
              <input
                type="radio"
                value="Cash on delivery"
                {...register("payment")}
              />{" "}
              Cash on delivery
            </label>
          </div>
        </section>
        <aside className={styles.summary}>
          <h2>Order summary</h2>
          {state.cart.map((item) => (
            <p key={`${item.id}-${item.size}`}>
              <span>
                {item.quantity} x {item.name}
              </span>
              <strong>
                {currency((item.salePrice || item.price) * item.quantity)}
              </strong>
            </p>
          ))}
          <p className={styles.total}>
            <span>Total</span>
            <strong>{currency(cartTotals.total)}</strong>
          </p>
          <button className="button buttonDark" type="submit">
            Confirm order
          </button>
        </aside>
      </form>
    </Page>
  );
}
