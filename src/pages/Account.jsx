import { useMemo, useState } from "react";
import Page from "../components/common/Page.jsx";
import Seo from "../components/common/Seo.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useFetch from "../hooks/useFetch.js";
import styles from "./Dashboard.module.css";
import { GoogleLogin } from "@react-oauth/google";
import { OrderList } from "../components/account/OrderList.jsx";

export default function Account() {
  const { data, loading, error } = useFetch("products?populate=*");

  const { state } = useStore();
  const { theme, setTheme } = useTheme();
  const {
    user,
    session,
    isLoggedIn,
    loginWithGoogle,
    loginWithEmail,
    logout,
    updateUser,
  } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [saved, setSaved] = useState("");

  const wishlist = (data || []).filter((product) =>
    state.wishlist.includes(product.id),
  );

  const initials = useMemo(() => {
    if (!user) return "GU";

    return `${user.firstName?.charAt(0) || ""}
            ${user.surname?.charAt(0) || ""}`.toUpperCase();
  }, [user]);

  const saveAccount = () => {
    setSaved("Saved");
  };

  const uploadPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      updateUser("photo", reader.result);
    };

    reader.readAsDataURL(file);
  };

  const login = (event) => {
    event.preventDefault();

    const email = loginEmail.trim();

    if (!email.includes("@")) {
      setAuthMessage("Enter valid email");
      return;
    }

    loginWithEmail(email);
    setAuthMessage("Logged in");
  };

  return (
    <Page className={styles.page}>
      <Seo
        title="Account"
        description="Manage profile, photo, addresses, preferences, orders and wishlist."
      />
      <header className={styles.profile}>
        <div className={styles.avatar}>
          {user?.photo ? (
            <img
              src={user?.photo}
              alt={`${user?.firstName} ${user?.surname}`}
            />
          ) : (
            initials
          )}
        </div>
        <div>
          <h1>
            {user?.firstName} {user?.surname}
          </h1>
          <p>
            {session.loggedIn
              ? `Logged in as ${session.email}`
              : `@${user?.username}`}
          </p>
        </div>
        <div className={styles.profileActions}>
          <label className={styles.uploadButton}>
            Add photo
            <input type="file" accept="image/*" onChange={uploadPhoto} />
          </label>
          <button onClick={saveAccount}>{saved || "Save changes"}</button>
        </div>
      </header>

      <section className={styles.grid}>
        <article className={styles.formCard}>
          <h2>Profile</h2>
          <div className={styles.formGrid}>
            <label>
              Name
              <input
                value={user?.firstName || ""}
                onChange={(event) =>
                  updateUser("firstName", event.target.value)
                }
              />
            </label>
            <label>
              Surname
              <input
                value={user?.surname || ""}
                onChange={(event) => updateUser("surname", event.target.value)}
              />
            </label>
            <label>
              Username
              <input
                value={user?.username || ""}
                onChange={(event) => updateUser("username", event.target.value)}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={user?.email || ""}
                onChange={(event) => updateUser("email", event.target.value)}
                readOnly
              />
            </label>
            <label>
              Phone
              <input
                value={user?.phone || ""}
                onChange={(event) => updateUser("phone", event.target.value)}
              />
            </label>
            <label>
              Theme
              <select
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
                aria-label="Theme selector"
              >
                <option value="light">Light theme</option>
                <option value="dark">Dark theme</option>
              </select>
            </label>
          </div>
        </article>

        <article className={styles.formCard}>
          <h2>Addresses</h2>
          <label>
            Delivery address
            <textarea
              rows="4"
              value={user?.address || ""}
              onChange={(event) => updateUser("address", event.target.value)}
            />
          </label>
          <label>
            Store pickup
            <select
              value={user?.pickupStore || ""}
              onChange={(event) =>
                updateUser("pickupStore", event.target.value)
              }
            >
              <option>Central Store</option>
              <option>North Gallery Pickup</option>
              <option>South Point Pickup</option>
            </select>
          </label>
        </article>

        <article className={styles.formCard}>
          <h2>Preferences</h2>
          <label className={styles.switchRow}>
            <input
              type="checkbox"
              checked={user?.newsletter}
              onChange={(event) =>
                updateUser("newsletter", event.target.checked)
              }
            />
            New collection emails
          </label>
          <label className={styles.switchRow}>
            <input
              type="checkbox"
              checked={user?.orderUpdates}
              onChange={(event) =>
                updateUser("orderUpdates", event.target.checked)
              }
            />
            Order status updates
          </label>
          <p>Google Login placeholder is ready for OAuth connection.</p>
        </article>

        {/* ORDERS */}

        <OrderList />

        {/* ORDERS */}

        <article className={styles.statCard}>
          <h2>Security</h2>

          {isLoggedIn ? (
            <>
              <p>
                <strong>Email login</strong>
                <span>{session.email}</span>
              </p>

              <button className={styles.secondaryButton} onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <form className={styles.authForm} onSubmit={login}>
              <label>
                Email
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <button type="submit">Log in</button>

              <GoogleLogin
                onSuccess={loginWithGoogle}
                onError={() => setAuthMessage("Google login failed")}
              />
            </form>
          )}

          {authMessage && <p>{authMessage}</p>}
        </article>
      </section>
    </Page>
  );
}
