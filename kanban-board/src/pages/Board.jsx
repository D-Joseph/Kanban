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
import { DndProvider } from "react-dnd";
import GroupsIcon from "@mui/icons-material/Groups";
import { HTML5Backend } from "react-dnd-html5-backend";

const createItem = async ({
  title,
  user,
  assignee,
  priority,
  group,
  desc,
  boardId,
  created_at,
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
      by: user.email,
      assignee,
      created_at,
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
    priority: "low",
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
  const [groupFilter, setGroupFilter] = React.useState("");
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
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const date = `${year}-${month}-${day}`;
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
        created_at: date,
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

  const displayMembers = () => {
    let res = newBoardData.members;
    if (Array.isArray(res)) {
      res = res.join("\n");
    }
    return res;
  };

  const applyGroupFilter = (e) => {
    setGroupFilter(e.target.value);
  };
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="flex items-center justify-between gap-4 p-2">
          <h1 className="text-3xl text-muiBlue font-bold whitespace-nowrap ml-4">
            {newBoardData ? newBoardData.name : "loading"}
          </h1>
          <div className="flex-grow"></div>
          {boardData && boardData.groups && (
            <FormControl margin="normal" sx={{ width: "120px" }}>
              <InputLabel id="group-filter-label">
                <GroupsIcon />
              </InputLabel>
              <Select
                labelId="group-filter-label"
                name="group"
                value={groupFilter}
                onChange={applyGroupFilter}
                sx={{ width: "120px", height: "33px" }}
              >
                <MenuItem value="">None</MenuItem>
                {boardData.groups.map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {boardData && user.email === boardData.created_by && (
            <Button
              onClick={() => setBoardSettingsOpen(true)}
              sx={{ minWidth: 40 }}
            >
              <SettingsOutlinedIcon />
            </Button>
          )}

          <Button
            variant="contained"
            size="medium"
            onClick={() => setAddModalOpen(true)}
            sx={{ minWidth: 100 }}
            endIcon={<AddCircleIcon />}
          >
            Add
          </Button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-max h-full grid gap-x-6 grid-cols-5">
            {columns.map((col) => (
              <Column
                key={col}
                name={col}
                items={items.filter(
                  (item) =>
                    item.status === col.toLowerCase() &&
                    (groupFilter === "" || item.group === groupFilter)
                )}
              />
            ))}
          </div>
        </div>

        <Dialog
          fullWidth={true}
          open={addModalOpen}
          onClose={handleAddModalClose}
        >
          <div className="grid grid-rows-4 place-content-center">
            <DialogTitle>Add a New Task</DialogTitle>
            <TextField
              label="Title"
              name="title"
              value={newItemData.title}
              onChange={updateFormValues}
              margin="normal"
              required
            />

            <div className="grid grid-cols-5 gap-2 place-content-center">
              <div className="col-span-2">
                <FormControl margin="normal" sx={{ width: "100%" }}>
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
              </div>
              <div className="col-span-2">
                <TextField
                  label="Due Date"
                  name="due"
                  value={newItemData.due}
                  onChange={updateFormValues}
                  margin="normal"
                  sx={{ width: "100%" }}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>

              <FormControl margin="normal" sx={[{ width: "100%" }]}>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  sx={{ width: "100px" }}
                  value={newItemData.priority || "low"}
                  onChange={updateFormValues}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="grid grid-cols-2 gap-2 place-content-center">
              <TextField
                label="Group/Subteam"
                name="group"
                value={newItemData.group}
                onChange={updateFormValues}
                fullWidth={true}
                margin="normal"
              />
              <TextField
                label="Assigned To"
                name="assignee"
                value={newItemData.assignee}
                fullWidth={true}
                onChange={updateFormValues}
                margin="normal"
              />
            </div>

            <TextField
              label="Description"
              name="desc"
              value={newItemData.desc}
              onChange={updateFormValues}
              multiline
              rows={4}
              margin="normal"
            />
          </div>
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
                label="Members (1 Per Line)"
                name="members"
                value={displayMembers()}
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
      </DndProvider>
    </>
  );
}
