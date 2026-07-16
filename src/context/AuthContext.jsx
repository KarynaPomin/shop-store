import { createContext, useContext, useEffect, useState } from "react";

import { googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { makeRequest } from "../makeRequest";
import useFetch from "../hooks/useFetch";

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
    return JSON.parse(localStorage.getItem(ACCOUNT_KEY)) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);
  const [user, setUser] = useState(loadAccount);

  useEffect(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ACCOUNT_KEY);
    }
  }, [user]);

  const API_URL = process.env.REACT_APP_API_URL;

  async function syncUserWithStrapi(account) {
    const check = await fetch(
      `${API_URL}/users?filters[email][$eq]=${account.email}`,
    );

    const users = await check.json();

    if (users.length > 0) {
      return users[0];
    }

    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: account.username,
        email: account.email,
        provider: "google",
        confirmed: true,
      }),
    });

    return await response.json();
  }

  const loginWithGoogle = async (credentialResponse) => {
    const profile = jwtDecode(credentialResponse.credential);

    const account = {
      name: profile.given_name,
      surname: profile.family_name,
      username: profile.email.split("@")[0],
      email: profile.email,
      photo: profile.picture,
    };

    const strapiUser = await syncUserWithStrapi(account);

    setUser({
      ...account,
      strapiId: strapiUser.id,
    });

    setSession({
      loggedIn: true,
      email: profile.email,
      provider: "google",
    });
  };

  const loginWithEmail = async (email, password) => {
    try {
      const { data: users } = await makeRequest.get(
        `users?filters[email][$eq]=${email}`,
      );

      if (users.length > 0) {
        const { data } = await makeRequest.post("/auth/local", {
          identifier: email,
          password,
        });

        setUser(data.user);

        setSession({
          loggedIn: true,
          email,
          provider: "email",
        });

        return;
      }

      const { data } = await makeRequest.post("/auth/local/register", {
        username: email.split("@")[0],
        email,
        password,
      });

      setUser(data.user);

      setSession({
        loggedIn: true,
        email,
        provider: "email",
      });
    } catch (err) {
      console.error(err);

      if (err.response?.data?.error?.message) {
        throw new Error(err.response.data.error.message);
      }

      throw new Error("Authentication failed.");
    }
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
