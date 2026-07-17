import styles from "./OrderList.module.css";
import useFetch from "../../hooks/useFetch";
import Drawer from "@mui/material/Drawer";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const getStatusTheme = (status) => {
  const normStatus = status?.toLowerCase();

  switch (normStatus) {
    case "accepted":
      return {
        bg: "rgba(30,143,79,0.15)",
        text: "var(--success)",
      };

    case "declined":
      return {
        bg: "rgba(224,80,80,0.15)",
        text: "#e05050",
      };

    default:
      return {
        bg: "rgba(240,155,55,0.15)",
        text: "#f09b37",
      };
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

export const OrderList = () => {
  const { user } = useAuth();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data: orders, loading } = useFetch(
    `orders?filters[user][$eq]=${user?.id}&populate[order_items][populate][product][populate]=images` ??
      null,
  );
  const baseUrl = process.env.REACT_APP_API_UPLOAD_URL;

  if (!user) {
    return <p>Login to see orders</p>;
  }

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className={styles.ordersWrapper}>
      <article className={styles.statCard}>
        <h2 className={styles.title}>Orders</h2>

        <div className={styles.orderListContainer}>
          {orders?.map((order) => {
            const isUnpaid = order.paymentMethod === "Cash on delivery";

            const status = getStatusTheme(order.statusOrder);

            return (
              <button
                key={order.id}
                className={`${styles.orderItem} ${
                  selectedOrder?.id === order.id ? styles.activeOrder : ""
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className={styles.orderItemLeft}>
                  <strong>#{order.orderId}</strong>

                  <span>{formatDate(order.createdAt)}</span>
                </div>

                <div className={styles.orderItemRight}>
                  <span
                    className={styles.statusBadge}
                    style={{
                      backgroundColor: status.bg,
                      color: status.text,
                    }}
                  >
                    {order.statusOrder || "Waiting"}
                  </span>

                  <span className={isUnpaid ? styles.unpaid : styles.paid}>
                    {isUnpaid ? "Unpaid" : "Paid"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </article>

      <Drawer
        anchor="right"
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        slotProps={{
          className: styles.drawerPaper,
          sx: {
            width: {
              xs: "100%",
              sm: "600px",
              lg: "720px",
            },
          },
        }}
      >
        {selectedOrder && (
          <div className={styles.orderDetails}>
            <header className={styles.header}>
              <h2>Order Details</h2>

              <button onClick={() => setSelectedOrder(null)}>×</button>
            </header>

            <section className={styles.orderTop}>
              <div>
                <h3>#{selectedOrder.orderId}</h3>

                <p>{formatDate(selectedOrder.createdAt)}</p>
              </div>

              <span
                className={styles.status}
                style={{
                  backgroundColor: getStatusTheme(selectedOrder.statusOrder).bg,

                  color: getStatusTheme(selectedOrder.statusOrder).text,
                }}
              >
                {selectedOrder.statusOrder || "Waiting"}
              </span>
            </section>

            <section className={styles.products}>
              {selectedOrder.order_items?.map((item) => (
                <div className={styles.product} key={item.id}>
                  <img
                    src={`${baseUrl}${item.product?.images?.[0]?.url}`}
                    alt={item.product?.name || "Product"}
                  />

                  <div>
                    <strong>{item.product?.name}</strong>

                    <p>${item.price}</p>
                  </div>

                  <span className={styles.qty}>Qty: {item.quantity}</span>
                </div>
              ))}
            </section>

            <section className={styles.paymentBox}>
              <div>
                <span>Amount</span>

                <strong>${selectedOrder.totalPrice}</strong>
              </div>

              <div>
                <span>Discount</span>

                <strong>${selectedOrder.discount ?? 0}</strong>
              </div>

              <div>
                <span>Payment method</span>

                <strong>{selectedOrder.paymentMethod}</strong>
              </div>
            </section>
          </div>
        )}
      </Drawer>
    </div>
  );
};
