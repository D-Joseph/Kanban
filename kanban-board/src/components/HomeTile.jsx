import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function HomeTile(props) {
  const nav = useNavigate();
  const { id, name } = props;

  const visitBoard = () => {
    nav(`/board/${id}`);
  };

  const truncatedName = name.length > 11 ? name.slice(0, 11) + "..." : name;
  return (
    <div className="h-32 w-32 grid place-content-center rounded-lg border-4 border-muiBlue">
      <Button className="h-32 w-32" onClick={visitBoard}>
        <h1>{truncatedName}</h1>
      </Button>
    </div>
  );
}
