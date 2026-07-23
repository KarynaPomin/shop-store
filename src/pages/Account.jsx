import { useMemo, useState } from "react";
import Page from "../components/common/Page.jsx";
import Seo from "../components/common/Seo.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./Dashboard.module.css";
import { GoogleLogin } from "@react-oauth/google";
import { OrderList } from "../components/account/OrderList.jsx";
import { makeRequest } from "../makeRequest.js";

export default function Account() {
  const { theme, setTheme } = useTheme();
  const {
    user,
    session,
    isLoggedIn,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    updateUser,
  } = useAuth();

  const [isRegister, setIsRegister] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPasswordRepeat, setLoginPasswordRepeat] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [saved, setSaved] = useState("");

  const initials = useMemo(() => {
    if (!user) return "GU";

    return `${user.name?.charAt(0) || ""}
            ${user.surname?.charAt(0) || ""}`.toUpperCase();
  }, [user]);

  const MEDIA_URL = process.env.REACT_APP_API_URL.replace(/\/api\/?$/, "");

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    const formData = new FormData();
    formData.append("files", file);

    try {
      const { data: uploaded } = await makeRequest.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileId = uploaded[0].id;
      const fileUrl = uploaded[0].url;

      await makeRequest.put(`/users/${user.id}`, { photo: fileId });

      updateUser("photo", `${MEDIA_URL}${fileUrl}`);
    } catch (err) {
      console.error(err);
    }
  };

  const saveAccount = async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      const { photo, id, ...editableFields } = user;
      await makeRequest.put(`/users/${user.id}`, editableFields);
      setSaved("Saved");
    } catch (err) {
      console.error(err);
      setSaved("Error");
    }

    await delay(2000);
    setSaved("Save changes");
  };

  const login = async (event) => {
    event.preventDefault();

    const email = loginEmail.trim();
    const password = loginPassword.trim();

    try {
      if (isRegister) {
        if (password !== loginPasswordRepeat.trim()) {
          setAuthMessage("Passwords do not match.");
          return;
        }

        await registerWithEmail(email, password);
        setAuthMessage("Account created.");
      } else {
        await loginWithEmail(email, password);
        setAuthMessage("Logged in.");
      }
    } catch (err) {
      setAuthMessage(err.message);
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

        {!user ? (
          <div className={styles.profileActions}>
            <a href="#login" className={styles.uploadButton}>
              Log in to save changes
            </a>
          </div>
        ) : (
          <div className={styles.profileActions}>
            <label className={styles.uploadButton}>
              Add photo
              <input type="file" accept="image/*" onChange={uploadPhoto} />
            </label>
            <button onClick={saveAccount}>{saved || "Save changes"}</button>
          </div>
        )}
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

        <article className={styles.statCard} id="login">
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

              {isRegister && (
                <label>
                  Repeat password
                  <input
                    type="password"
                    value={loginPasswordRepeat}
                    onChange={(e) => setLoginPasswordRepeat(e.target.value)}
                    placeholder="Repeat password"
                    minLength={6}
                    required
                  />
                </label>
              )}
              <button type="submit">
                {isRegister ? "Register" : "Log in"}
              </button>

              <GoogleLogin
                onSuccess={loginWithGoogle}
                onError={() => setAuthMessage("Google login failed")}
              />

              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => {
                  setIsRegister((prev) => !prev);
                  setAuthMessage("");
                }}
              >
                {isRegister
                  ? "Already have an account? Log in"
                  : "Don't have an account? Register"}
              </button>
            </form>
          )}

          {authMessage && <p>{authMessage}</p>}
        </article>
      </section>
    </Page>
  );
}
