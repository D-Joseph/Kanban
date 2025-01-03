import * as React from "react";
import { useParams } from "react-router-dom";

export default function Board() {
  const id = useParams().id;
  console.log(id);
  return (
    <>
      <h1>Board {id}</h1>
    </>
  );
}
