import {
  addDoc,
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import * as React from "react";
import { useParams } from "react-router-dom";
import { db } from "../Firebase";
import { AuthContext } from "../AuthContext";
import Column from "../components/Column";
import {
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DialogTitle from "@mui/material/DialogTitle";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TextField from "@mui/material/TextField";
import { updateEmail } from "firebase/auth";

const createItem = async ({
  title,
  user,
  assignee,
  priority,
  group,
  desc,
  boardId,
  due,
  status,
}) => {
  if (!boardId) {
    console.error("Error: boardId is required to create an item.");
    return;
  }
  try {
    const docRef = await addDoc(collection(db, "boards", boardId, "items"), {
      title,
      by: user.displayName,
      assignee,
      created_at: new Date(),
      priority,
      group,
      due,
      desc,
      status,
    });
    console.log("Item created with ID: ", docRef.id);
  } catch (error) {
    console.error("Error creating item: ", error);
  }
};

const editBoardData = async (id, updated) => {
  try {
    await updateDoc(doc(db, "boards", id), {
      members: updated.members,
      name: updated.name,
    });
    console.log("Board Updated");
  } catch (error) {
    console.error("Error updating board: ", error);
  }
};

export default function Board() {
  const { id } = useParams();
  const initialFormData = {
    title: "",
    by: "",
    assignee: "",
    priority: "",
    group: "",
    desc: "",
    boardId: id,
    due: "",
    status: "icebox",
  };
  const [items, setItems] = React.useState([]);
  const { user, authLoading } = React.useContext(AuthContext);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [boardSettingsOpen, setBoardSettingsOpen] = React.useState(false);
  const [newItemData, setNewItemData] = React.useState(initialFormData);
  const columns = ["Icebox", "Queued", "Working", "Review", "Completed"];
  const [boardData, setBoardData] = React.useState(null);
  const [newBoardData, setNewBoardData] = React.useState(null);

  React.useEffect(() => {
    if (!id) return;
    const getBoardData = async (boardId) => {
      try {
        const boardDoc = await getDoc(doc(db, "boards", boardId));
        if (boardDoc.exists()) {
          setBoardData(boardDoc.data());
          setNewBoardData(boardDoc.data());
        } else {
          console.error("No such board found!");
          return null;
        }
      } catch (error) {
        console.error("Error fetching board data: ", error);
      }
    };
    const q = collection(db, "boards", id, "items");
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(items);
    });
    getBoardData(id);
    return () => unsubscribe(); // Clean up listener on unmount
  }, [id]);

  const handleAddModalClose = () => {
    setNewItemData(initialFormData);
    setAddModalOpen(false);
  };

  const handleItemCreate = () => {
    if (newItemData.title.trim() != "") {
      createItem({
        title: newItemData.title,
        user: user,
        assignee: newItemData.assignee,
        priority: newItemData.priority,
        group: newItemData.group,
        desc: newItemData.desc,
        boardId: id,
        due: newItemData.due,
        status: newItemData.status,
      });
      handleAddModalClose();
    }
  };

  const updateFormValues = (e) => {
    const { name, value } = e.target;
    setNewItemData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSettingsClose = () => {
    console.log(newBoardData);
    // setNewBoardData(boardData);
    setBoardSettingsOpen(false);
  };

  const updateSettings = (e) => {
    const { name, value } = e.target;
    setNewBoardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSettingsSave = () => {
    if (newBoardData != "") {
      if (newBoardData.members.toString() != boardData.members.toString()) {
        console.log("splitted");
        newBoardData.members = newBoardData.members.split("\n");
      }
      editBoardData(id, newBoardData);
    }
    handleSettingsClose();
  };

  return (
    <>
      <div className="grid grid-cols-12 ">
        <h1 className="text-3xl text-muiBlue font-bold text-nowrap ml-4">
          {newBoardData ? newBoardData.name : "loading"}
        </h1>
        <div className="col-span-9"></div>
        <Button
          onClick={() => {
            setBoardSettingsOpen(true);
          }}
        >
          <SettingsOutlinedIcon />
        </Button>
        <Button
          variant="contained"
          size="medium"
          onClick={() => {
            setAddModalOpen(true);
          }}
          endIcon={<AddCircleIcon />}
        >
          Add
        </Button>
      </div>
      <div className="size-full">
        <div className="overflow-auto h-full grid gap-x-6 grid-cols-5">
          {columns.map((col) => (
            <Column
              key={col}
              name={col}
              items={items.filter((item) => item.status === col.toLowerCase())}
            />
          ))}
        </div>
      </div>

      <Dialog
        fullWidth={true}
        open={addModalOpen}
        onClose={handleAddModalClose}
      >
        <DialogTitle>Create a New Board</DialogTitle>
        <TextField
          label="Title"
          name="title"
          value={newItemData.title}
          onChange={updateFormValues}
          margin="normal"
          required
        />

        <FormControl margin="normal">
          <InputLabel id="status-label">Status *</InputLabel>
          <Select
            labelId="status-label"
            name="status"
            value={newItemData.status || "icebox"}
            onChange={updateFormValues}
            required
          >
            <MenuItem value="icebox">Icebox</MenuItem>
            <MenuItem value="queued">Queued</MenuItem>
            <MenuItem value="working">Working</MenuItem>
            <MenuItem value="review">Review</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Assignee"
          name="assignee"
          value={newItemData.assignee}
          onChange={updateFormValues}
          margin="normal"
        />

        <FormControl margin="normal">
          <InputLabel id="priority-label">Priority</InputLabel>
          <Select
            labelId="priority-label"
            name="priority"
            value={newItemData.priority}
            onChange={updateFormValues}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <FormControl margin="normal">
          <TextField
            label="Group/Subteam"
            name="group"
            value={newItemData.group}
            onChange={updateFormValues}
            margin="normal"
          />
        </FormControl>

        <TextField
          label="Description"
          name="desc"
          value={newItemData.desc}
          onChange={updateFormValues}
          multiline
          rows={4}
          margin="normal"
        />

        <FormControl margin="normal">
          <TextField
            label="Due Date"
            name="due"
            value={newItemData.due}
            onChange={updateFormValues}
            margin="normal"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <DialogActions>
          <Button onClick={handleAddModalClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleItemCreate}
            color="primary"
            disabled={newItemData.title.trim() === ""}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth={true}
        open={boardSettingsOpen}
        onClose={handleSettingsClose}
      >
        <DialogTitle>Board Settings</DialogTitle>
        {newBoardData ? (
          <>
            <TextField
              label="Board Title"
              name="name"
              value={newBoardData.name}
              onChange={updateSettings}
              margin="normal"
              required
            />

            <TextField
              label="Members"
              name="members"
              value={newBoardData.members.join('\n')}
              onChange={updateSettings}
              margin="normal"
              multiline
              rows={5}
              required
            />
          </>
        ) : (
          <p>Loading board data...</p>
        )}
        <DialogActions>
          <Button
            onClick={handleSettingsSave}
            disabled={
              boardData &&
              newBoardData &&
              newBoardData.members.toString() != "" &&
              boardData.name == newBoardData.name &&
              newBoardData.members.toString() == boardData.members.toString()
            }
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
