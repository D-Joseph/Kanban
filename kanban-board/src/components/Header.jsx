import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HomeIcon from '@mui/icons-material/HomeOutlined';

export default function Header() {
  return (
    <>
      <div className="grid place-items-center">
        <HomeIcon fontSize='large' />
      </div>
      <div className="col-span-10"></div>
      <div className="grid place-items-center">
        <AccountCircleOutlinedIcon fontSize='large'/>
      </div>
    </>
  );
}
