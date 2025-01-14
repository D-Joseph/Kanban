import { AuthContext } from "../AuthContext";
import * as React from "react";
import { appSignIn } from "../Firebase";
import Board from "../pages/Board";
import Home from "../pages/Home";
import Header from "./Header";
export default function Overlay(props) {
  const {loading, user} = React.useContext(AuthContext);
  const { page } = props;
  let elem;
  if (page == "Board") {
    elem = <Board />;
  } else {
    elem = <Home />;
  }

  // Force user sign in if not logged in
  if (!loading && !user) {
    appSignIn();
  }

  return (
    <>
      <div className="w-screen h-screen grid grid-cols-1 place-items-center">
        <div className="h-screen grid grid-cols-1 grid-rows-10">
          <div className="w-screen row-span-1 grid grid-cols-12">
            <Header />
          </div>
          <div className="row-span-9">{elem}</div>
        </div>
      </div>
    </>
  );
}
