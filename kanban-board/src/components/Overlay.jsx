import Board from "../pages/Board";
import Home from "../pages/Home";
import Header from "./Header";

export default function Overlay(props) {
  const { page } = props;
  let elem;
  console.log(page);
  if (page == "Board") {
    elem = <Board />;
  } else {
    elem = <Home />;
  }

  return (
    <>
      <div className="w-screen h-screen grid grid-cols-1 place-items-center">
        <div className="w-5/6 h-screen grid grid-rows-10">
          <div className="row-span-1 grid grid-cols-12">
            <Header />
          </div>
          <div className="row-span-9">{elem}</div>
        </div>
      </div>
    </>
  );
}
