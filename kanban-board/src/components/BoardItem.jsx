import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import * as React from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { useParams } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useDrag } from "react-dnd";
const editItemData = async (boardId, updated) => {
  try {
    await updateDoc(doc(db, "boards", boardId, "items", updated.id), {
      assignee: updated.assignee,
      desc: updated.desc,
      group: updated.group,
      priority: updated.priority,
      status: updated.status,
      due: updated.due,
      title: updated.title,
    });
    console.log("Item Updated");
  } catch (error) {
    console.error("Error updating item: ", error);
  }
};

const deleteItem = async(boardId, updated) => {
  try {
    await deleteDoc(doc(db, "boards", boardId, "items", updated.id));
    console.log("Item Deleted");
  } catch (error) {
    console.error("Error deleting item: ", error);
  }
} 

export default function BoardItem(item) {
  item = item.item;
  const { id } = useParams();
  const [viewItem, setViewItem] = React.useState(false);
  const [editedItem, setEditedItem] = React.useState(item)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BOARD_ITEM",
    item: { id: item.id, status: item.status }, // Pass the item data
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  
  const handleModalClose = () => {
    setEditedItem(item)
    setViewItem(false);
  };

  const updateFormValues = (e) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemCreate = () => {
    editItemData(id, editedItem)
    setViewItem(false);
    // handleModalClose()
  };

  const handleItemDelete = () => {
    deleteItem(id, editedItem)
  }

  return (
    <>
        <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="w-full text-left min-w-60 truncate rounded-lg text-xs grid grid-cols-1"
    >
      <Button
        onClick={() => {
          setViewItem(true);
        }}
      >
        <div
          key={item.id}
          className="p-1 m-1 w-60 text-left truncate rounded-lg border-2 text-xs grid grid-cols-1 grid-rows-4 border-muiBlue"
        >
          <div className="grid grid-cols-5">
            <div className="font-bold col-span-4 truncate text-sm">
              {item.title}
            </div>
            <div className="text-right">
              <Tooltip title={"Priority: " + item.priority}>
                {item.priority == "high" && (
                  <KeyboardDoubleArrowUpIcon color="red" />
                )}
                {item.priority == "medium" && <KeyboardArrowUpIcon />}
              </Tooltip>
                {item.priority == "low" && <KeyboardArrowUpIcon sx={{color:'#ffffff'}}/>}
            </div>
          </div>
          <div><PersonIcon fontSize="small"/> {item.assignee}</div>
          <div><GroupsIcon fontSize="small"/> {item.group}</div>
          <div><CalendarMonthIcon fontSize="small"/> {item.due}</div>
        </div>
      </Button> </div>

      <Dialog fullWidth={true} open={viewItem} onClose={handleModalClose}>
        <div className="grid grid-rows-4 place-content-center">
          <DialogTitle>Add a New Task</DialogTitle>
          <TextField
            label="Title"
            name="title"
            value={editedItem.title}
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
                  value={editedItem.status || "icebox"}
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
                value={editedItem.due}
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
                value={editedItem.priority}
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
              value={editedItem.group}
              onChange={updateFormValues}
              fullWidth={true}
              margin="normal"
            />
            <TextField
              label="Assigned To"
              name="assignee"
              value={editedItem.assignee}
              fullWidth={true}
              onChange={updateFormValues}
              margin="normal"
            />
          </div>

          <TextField
            label="Description"
            name="desc"
            value={editedItem.desc}
            onChange={updateFormValues}
            multiline
            rows={4}
            margin="normal"
          />
        </div>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleItemDelete} color="error">
            Delete
          </Button>
          <Button
            onClick={handleItemCreate}
            color="primary"
            disabled={editedItem.title && editedItem.title.trim() === ""}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
