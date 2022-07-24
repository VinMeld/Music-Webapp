import React from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import {useSelector, useDispatch} from 'react-redux';
import {logout, reset} from '../features/auth/authSlice';
import {Button} from '@mui/material';
import logo from "../images/logo.png";	// import the logo

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
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '10%'}}>
            <img src={logo} style={{width: "15%", height: "15%", margin: 10}}alt="music" />
            <nav style={{display: "flex", alighItems:"center", flexDirection: 'column', flexWrap: 'wrap'}}>
                <Link to="/songs">
                    <Button>Songs</Button>
                </Link>
                {user &&
                    <Link to="/favouritesongs">
                        <Button color="secondary">Favourite Songs</Button>
                    </Link>
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
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Link to="/login">
                    <Button variant="contained" color="primary" >
                        Login
                    </Button>
                    </Link>
                    <Link to="/createuser">
                    <Button variant="contained" color="primary" style={{marginTop: 10}}>
                    Create User
                    </Button>
                    </Link>
                    </div>
                )}
            </nav>
            </div>
        </>
    )
}
