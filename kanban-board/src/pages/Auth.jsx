import { appSignIn, appSignOut } from "../Firebase";
import React, { useContext } from "react";
import { AuthContext } from "../AuthContext"; // Adjust path as needed
import { Button } from "@mui/material";
export default function Auth() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while determining auth state
  }

  if (user) {
    return (
      <div className="p-10 grid grid-rows-4">
        <div className="">{user.displayName}</div>
        <div>{user.email}</div>
        <Button onClick={appSignOut} variant="contained">
          Sign Out
        </Button>
      </div>
    ); // Show user data after sign-in
  }

  return (
    <div className="auth">
      <Button onClick={appSignIn} variant="contained">
        Sign in with Google
      </Button>
    </div>
  );
}
