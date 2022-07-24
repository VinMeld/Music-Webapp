import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  ListItemIcon
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import {logout, reset} from '../features/auth/authSlice';
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../images/logo.png";

function DrawerComponent() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const {user} = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List>
         <ListItem onClick={() => setOpenDrawer(false)}>

            <ListItemText>
              <Link to="/">
              <Button>
              Home
              </Button>
              </Link>
            </ListItemText>
          </ListItem>
          {user && 
          
            <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/favouritesongs">
              <Button> Favourite Songs </Button>
              </Link>
            </ListItemText>
          </ListItem>
          }
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/songs">
                <Button>Songs</Button>
              </Link>
            </ListItemText>
          </ListItem>
          { !user &&
            <div>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/login">
                <Button variant="contained" color="primary">
                  Login
                </Button>
              </Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/createuser">
                <Button variant="contained" color="primary" style={{marginTop: 10}}>
                Register
                </Button>
              </Link>
            </ListItemText>
          </ListItem>
          </div>
          }
          {user &&
          <ListItem onClick={() => {
            console.log("Logout!");
            dispatch(logout());
            dispatch(reset());
            navigate("/");
          }
          }>

            <ListItemText>
              <Button variant="contained" color="primary" style={{marginTop: 10}}>
                Logout
              </Button>
            </ListItemText>
          </ListItem>
          }
        </List>
      </Drawer>
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
        <MenuIcon />
      </IconButton>
    </>
  );
}
export default DrawerComponent;
