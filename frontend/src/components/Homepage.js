import React from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import {useSelector, useDispatch} from 'react-redux';
import {logout, reset} from '../features/auth/authSlice';
import {Button} from '@mui/material';
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
export const Homepage = () => {
    const {user} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    if(location.pathname !== "/"){
        <Navbar />
        return null;
    }
    return (
        <>
            <Navbar />
            <h1>Music</h1>
            <img src="https://cdn.mos.cms.futurecdn.net/y9siWhBdEnkwL9HhGakpQK.jpg" style={{width: "25%", height: "25%"}}alt="music" />
            <nav style={{display: "flex", alighItems:"center", flexDirection: 'column', flexWrap: 'wrap'}}>
                <Link to="/songs">Songs</Link>
                {user &&
                    <Link to="/favouritesongs">Favorite Songs</Link>
                }
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
                ) : (
                    <div>
                    <Link to="/login">Login</Link> | {}
                    <Link to="/createuser">Create User</Link>
                    </div>
                )}
            </nav>

        </>
    )
}
