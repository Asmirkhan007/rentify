import { message } from "antd";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setCurrentUser({ uid: user.uid, token, ...userDoc.data() });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
      });

      message.success("Signup successful! Please log in.");
      navigate("/login"); // Redirect to login after signup
    } catch (error) {
      console.error("Error during signup:", error);
      message.error("An error occurred during sign up.");

      // Clean up by deleting the user from Firebase Auth if Firestore write failed
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
    }
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();

    const userDoc = await getDoc(doc(db, "users", user.uid));
    setCurrentUser({ uid: user.uid, token, ...userDoc.data() });

    if (userDoc.data().role === "seller") {
      navigate("/seller-dashboard");
    } else {
      navigate("/buyer-dashboard");
    }
  };

  const logout = async () => {
    await auth.signOut();
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, signup, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
