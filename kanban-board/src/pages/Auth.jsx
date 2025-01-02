import { appSignIn, appSignOut } from "../Firebase";
import React, { useContext } from "react";
import { AuthContext } from "../AuthContext"; // Adjust path as needed

export default function Auth() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while determining auth state
  }

  if (user) {
    return (
      <div>
        Welcome, {user.displayName}{" "}
        <button
          onClick={appSignOut}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>
    ); // Show user data after sign-in
  }

  return (
    <div className="auth">
      <h1>Sign In</h1>
      <button
        onClick={appSignIn}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}
