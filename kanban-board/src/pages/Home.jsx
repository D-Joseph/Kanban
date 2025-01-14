import * as React from "react";
import Button from "@mui/material/Button";
import { db } from "../Firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import HomeTile from "../components/HomeTile";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FormDialog from "../components/FormDialog"; // Assuming this component exists
import { AuthContext } from "../AuthContext";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Alert } from "@mui/material";

// Function to create a new board
const createBoard = async (name, user) => {
  try {
    const docRef = await addDoc(collection(db, "boards"), {
      name: name,
      created_by: user.email,
      members: [user.email],
      created_at: new Date(),
    });
    console.log("Board created with ID: ", docRef.id);
  } catch (error) {
    console.error("Error creating board: ", error);
  }
};

export default function Home() {
  const { user, loading } = React.useContext(AuthContext);
  const [open, setOpen] = React.useState(false); // Dialog open state
  const [boardName, setBoardName] = React.useState(""); // State to handle form input
  const [boards, setBoards] = React.useState([]);

  React.useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "boards"),
        where("members", "array-contains", user.email)
      );
      // Set up the Firestore listener
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          ...doc.data(),
        }));
        console.log("Fetched boards: ", data); // Log the fetched boards
        setBoards(data); 
      });

      return () => unsubscribe();
    }
  }, [user]);

  // State Management for Add Modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateBoard = () => {
    if (boardName.trim() !== "") {
      createBoard(boardName, user);
      setOpen(false);
      setBoardName("");
    } 
  };

  return (
    <div className="">
      <h1 className="text-3xl text-center font-bold underline text-muiBlue">
        Your Boards
      </h1>
      <div className=" grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        <Button
          className="h-32 w-32"
          variant="contained"
          onClick={handleClickOpen}
        >
          <div className="grid place-content-center rounded-lg">
            <AddCircleIcon fontSize="large" />
          </div>
        </Button>

        {boards.map((item) => (
          <HomeTile key={item.id} id={item.id} name={item.name} />
        ))}
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Board</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Board Name"
            fullWidth
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)} // Handle input change
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateBoard} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
