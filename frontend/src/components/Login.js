import React, {useState, useEffect} from "react";
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, CircularProgress, TextField} from "@mui/material";
import Button from '@mui/material/Button';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from "react-router-dom";
import {login, reset} from "../features/auth/authSlice";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

import {toast} from 'react-toastify';
export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    
    const {user, isError, isLoading, isSuccess, message} = useSelector(state => state.auth);
    useEffect(() => {
        if(isSuccess){
            toast.success("User logged in successfully");
            navigate("/");
        }
        if(isError) {
            console.log("In error")
            toast.error(message);
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);
    if(isLoading){
        return <CircularProgress />;
    }
    return(
        <div>
            <h1>Login</h1>
            <FormControl>
                <InputLabel htmlFor="email">Email</InputLabel>
                    <OutlinedInput
                    id="email"
                    value={email}
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    />
            </FormControl>
            <FormControl>
                    <TextField
                    id="password"
                    value={password}
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{ // <-- This is where the toggle button is added.
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
            </FormControl>
            <Button variant="contained" color="primary" onClick={()=>{
                console.log("Login!");
                dispatch(login({email, password}));
                
            }}>
                Login
            </Button>
        </div>
    )
}