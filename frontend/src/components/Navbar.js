import React from "react";
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  useTheme,
  useMediaQuery,
  FormControlLabel,
  Switch,
  Button,
  IconButton
} from "@mui/material";
import { Outlet, Link, useLocation, useNavigate} from "react-router-dom";
import DrawerComponent from "./Drawer";
import {useSelector, useDispatch} from 'react-redux';
import {logout, reset} from '../features/auth/authSlice';
import logo from "../images/logo.png";	// import the logo
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
function Navbar() {
  const navbar = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
} 
// registerStuff on the navbar to the right of the navbar
const registerStuff = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginLeft: 10,
}
// mainLinks in the center
const mainLinks ={
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  if(location.pathname === "/"){
    return <Outlet />;
  }
  const changeTheme = () => {
    const newTheme = theme.palette.type === "light" ? "dark" : "light";
    theme.palette.type = newTheme;
    console.log(theme.palette.type);
  }
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          {isMobile ? (
            <DrawerComponent />
          ) : (
            
            <div style={navbar}>

            <img onClick={() => {
              navigate("/");
            }} src={logo} style={{width: "3%", height: "3%", margin: 10}}alt="music" />
            <div style={mainLinks}>
              <Link style={{textDecoration: 'none'}} to="/">
              <Button>Home</Button>
              </Link>
              {user && 
              
              <Link style={{textDecoration: 'none'}} to="/favouritesongs">
                <Button>Favourite Songs</Button>
              </Link>
              }
              <Link style={{textDecoration: 'none'}} to="/songs">
                <Button>Songs</Button>
              </Link>
             
             {/* <FormControlLabel 
              label= {theme.palette.mode === "dark" ? "Dark mode" : "Light mode"}
              control={   
                <IconButton onClick={() => changeTheme()}>
                  {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              }
              labelPlacement="start"
            />*/}
            </div>
            <div style={registerStuff}>
            {user ? (
              <div>
              <Button variant="contained" color="primary" style={{marginLeft: 10}} onClick={()=>{
                console.log("Logout!");
                dispatch(logout());
                dispatch(reset());
                navigate("/");
              }}>
                Logout
              </Button>
              </div>

            ) : (<div>
              <Link style={{textDecoration: 'none'}} to="/login" >
                <Button variant="contained">Login</Button>
              </Link>
              <Link style={{textDecoration: 'none'}} to="/createuser" >
                <Button variant="contained" style={{marginLeft: 10}}>Register</Button>
              </Link>
              </div>
              )
            }

              </div>
            </div>
            
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </div>
  );
}
export default Navbar;
