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
  Button
} from "@mui/material";
import { Outlet, Link, useLocation, useNavigate} from "react-router-dom";
import DrawerComponent from "./Drawer";
import {useSelector, useDispatch} from 'react-redux';
import {logout, reset} from '../features/auth/authSlice';

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  if(location.pathname === "/"){
    return <Outlet />;
  }
  return (
    <div>
      <AppBar position="static">
        <CssBaseline />
        <Toolbar>
          <Typography variant="h4" >
            Music!
            
          </Typography>
          {isMobile ? (
            <DrawerComponent />
          ) : (
            <div>
              <Link to="/" >
                Home
              </Link>
              {user && 
              
              <Link to="/favouritesongs" >
                Favourite Songs
              </Link>
              }
              <Link to="/songs" >
                Songs
              </Link>
              
              <FormControlLabel
              label= {user ? "loggedin" : "loggedout"}
              control={<Switch color="primary" checked={user ? true : false} />}
              labelPlacement="start"
              disabled={true}
            />
            {user ? (
              <div>
              <Button variant="contained" color="primary" onClick={()=>{
                console.log("Logout!");
                dispatch(logout());
                dispatch(reset());
                navigate("/");
              }}>
                Logout
              </Button>
              </div>

            ) : (<div>
              <Link to="/login" >
                Login
              </Link>
              <Link to="/createuser" >
                Register
              </Link>
              </div>
              )
            }

            </div>
            
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </div>
  );
}
export default Navbar;
