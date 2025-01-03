import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import * as React from "react";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Auth from "../pages/Auth";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  
  const nav = useNavigate();
  const goHome = () =>{
    nav('/')
  }
  
  return (
    <>
      <div className="grid place-items-center">
        <Button onClick={goHome}>
            <HomeIcon fontSize="large" />
        </Button>
      </div>
      <div className="col-span-10"></div>
      <div className="grid place-items-center">
        <Button aria-describedby={id} onClick={handleClick}>
          <AccountCircleOutlinedIcon fontSize="large" />
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
            <Auth />
        </Popover>
      </div>
    </>
  );
}
