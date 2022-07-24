import React, {useState, useEffect} from "react";
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, CircularProgress, TextField } from "@mui/material";
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import {register, reset} from '../features/auth/authSlice';
import Button from '@mui/material/Button';
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
export const CreateUser = () => {
    console.log(process.env.SECRET_TOKEN);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user, isError, isLoading, isSuccess, message} = useSelector(state => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
    const handleClickShowConfirmedPassword = () => setShowConfirmedPassword(!showConfirmedPassword);
    const handleMouseDownConfirmedPassword = () => setShowConfirmedPassword(!showConfirmedPassword);
    useEffect(() => {
        if(isSuccess){
            toast.success("User created successfully");
            navigate("/");
        }
        if(isError) {
            toast.error(message);
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);
    if(isLoading){
        return <CircularProgress />;
    }
    const registerUserAndCheckFields = () => {
        switch(true){
            case email === "":
                toast.error("Email is required");
                return;
            case password === "":
                toast.error("Password is required");
                return;
            case confirmPassword === "":
                toast.error("Confirm password is required");
                return;
            case username === "":
                toast.error("Username is required");
                return;
            case password !== confirmPassword:
                toast.error("Passwords do not match");
                return;
            case password.length < 4:
                toast.error("Password must be at least 4 characters");
                return;
            case !email.includes("@"):
                toast.error("Eamil must be a valid email");
                return;
            case !username.match(/^[a-zA-Z0-9]+$/):
                toast.error("Username must be alphanumeric");
                return;
            case !email.includes('.'):
                toast.error("Give a real email");
                return;
            default:
                dispatch(register({email, password, name:username}));
        }
    }
    return(
        <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <h1>Register</h1>
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
                <InputLabel htmlFor="username">Username</InputLabel>
                    <OutlinedInput
                    id="username"
                    value={username}
                    label="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    />
            </FormControl>
            <FormControl>
                <TextField
                id="password"
                value={password}
                type={showPassword ? "text" : "password"}
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
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
            <FormControl>
            <TextField
                id="confirmedPassword"
                value={confirmPassword}
                type={showConfirmedPassword ? "text" : "password"}
                label="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmedPassword}
                        onMouseDown={handleMouseDownConfirmedPassword}
                        >
                        {showConfirmedPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                    )
                }}
                />
            </FormControl>
            <Button style={{marginTop: 10}} variant="contained" color="primary" onClick={() => {
                if (password === confirmPassword){
                    registerUserAndCheckFields(email, password, username);

                }
                else{
                    toast.error('Passwords do not match!')
                }
            }
            }>
                Register
            </Button>
        </div>
    )
}