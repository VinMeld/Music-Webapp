import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";


function DrawerComponent() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const {user} = useSelector(state => state.auth);
  return (
    <>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List>
         <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/">Home</Link>
            </ListItemText>
          </ListItem>
          {user && 
          
            <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/favouritesongs">Favourite Songs</Link>
            </ListItemText>
          </ListItem>
          }
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/songs">Songs</Link>
            </ListItemText>
          </ListItem>
          { !user &&
            <div>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/login">Log in</Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/createuser">Register</Link>
            </ListItemText>
          </ListItem>
          </div>
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
