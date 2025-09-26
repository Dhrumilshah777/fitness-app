// src/pages/Login.jsx
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { auth } from "../firebase";
import { signInWithCredential, GoogleAuthProvider, signOut } from "firebase/auth";

export default function Login() {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setUser(decoded);
      setJwt(credentialResponse.credential);

      // Link Google login with Firebase Auth
      const credential = GoogleAuthProvider.credential(credentialResponse.credential);
      await signInWithCredential(auth, credential);

      console.log("User:", decoded);
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setJwt(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {!user ? (
        <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log("Login Failed")} />
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-lg font-bold mb-2">Welcome {user.name}</h2>
          <p className="text-sm text-gray-600 mb-2">Email: {user.email}</p>
          {/* <p className="text-xs text-gray-500 break-all">JWT: {jwt}</p> */}
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}