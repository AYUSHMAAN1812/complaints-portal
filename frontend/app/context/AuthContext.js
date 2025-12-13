"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebaseConfig.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokenID, setTokenID] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      // ✅ Restrict access to "iith.ac.in" domain only
      if (!user.email.endsWith("@iith.ac.in")) {
        alert("Access restricted to iith.ac.in users only.");
        return ;
      }

      setUser(user); // ✅ Set only authorized user
      setTokenID(token);
      console.log("Google Sign-In successful:", user);
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      alert(error.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // ✅ Ensure user is fully logged out
      setTokenID(null);
    } catch (error) {
      console.error("Sign-Out Error:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser,currentTokenID) => {
      if (currentUser && currentUser.email.endsWith("@iith.ac.in")&&currentTokenID) {
        setUser(currentUser);
        setTokenID(currentTokenID);
      } else {
        setUser(null);
        setTokenID(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };

    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ user, tokenID ,googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
