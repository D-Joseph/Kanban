import { Button, Tooltip } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { yellow } from '@mui/material/colors';
export default function BoardItem( item ) {
  item = item.item
  return <><Button>
             <div
              key={item.id}
              className="p-2 m-2 w-full text-left rounded-lg border-2 text-sm grid grid-cols-1 grid-rows-4 border-muiBlue"
            >
              <div className="grid grid-cols-2">
                <div className="font-bold text-base">{item.title}</div>
                <div className="text-right">
                  <Tooltip title={"Priority: " + item.priority}>
                  {item.priority == 'high' &&  <KeyboardDoubleArrowUpIcon color="red"/>}
                  {item.priority == 'medium' &&  <KeyboardArrowUpIcon />}
                  </Tooltip>
                </div>
              </div>
              <div> 
                {item.group}
              </div>
              <div> 
                {item.assignee}
              </div>

            </div>
            </Button>
  </>;
}
