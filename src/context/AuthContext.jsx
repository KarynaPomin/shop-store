import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const SESSION_KEY = "shop-session";
const ACCOUNT_KEY = "shop-account";

function loadSession() {
  try {
    return (
      JSON.parse(localStorage.getItem(SESSION_KEY)) || {
        loggedIn: false,
      }
    );
  } catch {
    return {
      loggedIn: false,
    };
  }
}

function loadAccount() {
  try {
    return (
      JSON.parse(localStorage.getItem(ACCOUNT_KEY)) || null
    );
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);
  const [user, setUser] = useState(loadAccount);

  useEffect(() => {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session)
    );
  }, [session]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        ACCOUNT_KEY,
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(ACCOUNT_KEY);
    }
  }, [user]);

  const loginWithGoogle = (credentialResponse) => {
    const profile = jwtDecode(
      credentialResponse.credential
    );

    const account = {
      firstName: profile.given_name,
      surname: profile.family_name,
      username: profile.email.split("@")[0],
      email: profile.email,
      photo: profile.picture,
      phone: "",
      address: "",
      pickupStore: "Central Store",
      newsletter: true,
      orderUpdates: true,
    };

    setUser(account);

    setSession({
      loggedIn: true,
      email: profile.email,
      provider: "google",
    });
  };

  const loginWithEmail = (email) => {
    const account = {
      firstName: "",
      surname: "",
      username: email.split("@")[0],
      email,
      photo: "",
      phone: "",
      address: "",
      pickupStore: "Central Store",
      newsletter: true,
      orderUpdates: true,
    };

    setUser(account);

    setSession({
      loggedIn: true,
      email,
      provider: "email",
    });
  };

  const logout = () => {
    if (session.provider === "google") {
      googleLogout();
    }

    setSession({
      loggedIn: false,
    });

    setUser(null);

    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(ACCOUNT_KEY);
  };

  const updateUser = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoggedIn: session.loggedIn,
        loginWithGoogle,
        loginWithEmail,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}