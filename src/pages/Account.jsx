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
import { makeRequest } from "../makeRequest.js";
import { delay } from "motion-dom";

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

  const [loginUsername, setLoginUsername] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPasswordRepeat, setLoginPasswordRepeat] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [saved, setSaved] = useState("");

  const wishlist = (data || []).filter((product) =>
    state.wishlist.includes(product.id),
  );

  const initials = useMemo(() => {
    if (!user) return "GU";

    return `${user.name?.charAt(0) || ""}
            ${user.surname?.charAt(0) || ""}`.toUpperCase();
  }, [user]);

  const saveAccount = async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      const { data } = await makeRequest.put(`/users/${user.id}`, user);
    } catch (err) {
      console.error(err);
    }

    setSaved("Saved");
    await delay(2000);
    setSaved("Save changes");
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

  const login = async (event) => {
    event.preventDefault();

    const email = loginEmail.trim();
    const password = loginPassword.trim();
    const passwordRepeat = loginPasswordRepeat.trim();

    if (!email) {
      setAuthMessage("Email is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setAuthMessage("Enter a valid email address.");
      return;
    }

    if (!password) {
      setAuthMessage("Password is required.");
      return;
    }

    if (password.length < 6) {
      setAuthMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== passwordRepeat) {
      setAuthMessage("Passwords do not match.");
      return;
    }

    try {
      await loginWithEmail(email, password);
      setAuthMessage("Account created successfully.");
    } catch (err) {
      setAuthMessage(
        err.response?.data?.error?.message || "Registration failed.",
      );
    }
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
            <img src={user?.photo} alt={`${user?.name} ${user?.surname}`} />
          ) : (
            initials
          )}
        </div>
        <div>
          <h1>
            {user?.name} {user?.surname}
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
                value={user?.name || ""}
                onChange={(event) => updateUser("name", event.target.value)}
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

        <OrderList />

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
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  minLength={6}
                  required
                />
              </label>

              <label>
                Repeat password
                <input
                  type="password"
                  value={loginPasswordRepeat}
                  onChange={(e) => setLoginPasswordRepeat(e.target.value)}
                  placeholder="Password repeat"
                  minLength={6}
                  required
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
