import { createContext, useContext, useEffect, useState } from "react";

import { googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { makeRequest } from "../makeRequest";

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

  const MEDIA_URL = process.env.REACT_APP_API_UPLOAD_URL;

  async function syncUserWithStrapi(account) {
    const { data: users } = await makeRequest.get(
      `/users?filters[email][$eq]=${account.email}&populate=photo`,
    );

    if (users.length > 0) {
      return users[0];
    }

    const randomPassword = crypto.randomUUID();

    try {
      const { data: newUser } = await makeRequest.post("/users", {
        username: account.username,
        email: account.email,
        password: randomPassword,
        provider: "google",
        confirmed: true,
        role: 1,
      });

      return newUser;
    } catch (error) {
      console.log(error.response?.data);

      return;
    }
  }

  const loginWithGoogle = async (credentialResponse) => {
    const profile = jwtDecode(credentialResponse.credential);

    const account = {
      name: profile.given_name,
      surname: profile.family_name,
      username: profile.email.split("@")[0],
      email: profile.email,
    };

    const strapiUser = await syncUserWithStrapi(account);

    setUser({
      ...account,
      id: strapiUser.id,
      photo: strapiUser.photo?.url
        ? `${MEDIA_URL}${strapiUser.photo.url}`
        : profile.picture,
    });

    setSession({ loggedIn: true, email: profile.email, provider: "google" });
  };

  const loginWithEmail = async (email, password) => {
    const { data: authData } = await makeRequest.post("/auth/local", {
      identifier: email,
      password,
    });

    const { data: fullUser } = await makeRequest.get(
      `/users/${authData.user.id}?populate=photo`,
    );

    setUser({
      ...fullUser,
      photo: fullUser.photo?.url ? `${MEDIA_URL}${fullUser.photo.url}` : null,
    });

    setSession({
      loggedIn: true,
      email,
      provider: "email",
    });
  };

  const registerWithEmail = async (email, password) => {
    const { data: authData } = await makeRequest.post("/auth/local/register", {
      username: email.split("@")[0],
      email,
      password,
    });

    const { data: fullUser } = await makeRequest.get(
      `/users/${authData.user.id}?populate=photo`,
    );

    setUser({
      ...fullUser,
      photo: fullUser.photo?.url ? `${MEDIA_URL}${fullUser.photo.url}` : null,
    });

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
        registerWithEmail,
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
