import { useDrop } from "react-dnd";
import BoardItem from "./BoardItem";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import React from "react";
import { useParams } from "react-router-dom";

export default function Column({ name, items }) {
  const {id} = useParams();
  const [, drop] = useDrop(() => ({
    accept: "BOARD_ITEM",
    drop: (draggedItem) => {
      // Update the item's status
      const updatedItem = { ...draggedItem, status: name.toLowerCase() };
      updateItemStatus(id, updatedItem);
    },
  }));

  const updateItemStatus = async (boardId, updatedItem) => {
    console.log(boardId, updatedItem)
    try {
      await updateDoc(doc(db, "boards", boardId, "items", updatedItem.id), {
        status: updatedItem.status,
      });
      console.log("Item moved to", updatedItem.status);
    } catch (error) {
      console.error("Error updating item status:", error);
    }
  };

  return (
    <div ref={drop} className="mt-4 min-w-60">
      <h1 className="text-lg text-center font-bold underline text-muiBlue">{name}</h1>
      <div className="grid grid-cols-1">
        {items.map((item) => (
          <BoardItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
