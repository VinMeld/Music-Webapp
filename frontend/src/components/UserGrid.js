import React, {useState} from 'react';
import {SongInfo} from './SongInfo';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import {style} from './style';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import CircularProgress from '@mui/material/CircularProgress';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import {createSong} from '../features/songs/songSlice';
import {getSongs, reset} from '../features/songs/songSlice';
export const UserGrid = (props) => {
    const [createNewSong, setCreateNewSong] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);
    const {songs, isError, isLoading, isSuccess, message} = useSelector(state => state.songs);
    useEffect(() => {
        if(!user){
            navigate("/");
        }
        if(isError){
            toast.error(message);
        }
        dispatch(getSongs());
        
        return () => {
            dispatch(reset());
        }
    }, [user, navigate, isError, message, dispatch]);
    if(isLoading) {
        return <CircularProgress />;
    }
    return(
        <div style={style.main}>
            <div style={style.header}>
                <h1>Welcome {user && user.name}!</h1>
                <h2>Your songs!</h2>
            </div>
            <div style={style.box}>
                <Grid container spacing={3}>
                    {   
                        songs.map(song => {
                            return(
                                    <SongInfo song={song} title={song.text} description={song.description} image={song.link}  />
                            );
                        })
                    }
                    {!createNewSong ? 
                        <IconButton aria-label="add new Song" style={{marginLeft: 10}} onClick={() => setCreateNewSong(true)}>
                            <AddCircleOutlineIcon />
                        </IconButton> :
                        <div>
                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { m: 1 },
                                }}
                                noValidate
                                autoComplete="off"
                                >
                                <Card>
                                    <CardContent>
                                        <FormControl>
                                            <InputLabel htmlFor="component-outlined">Title</InputLabel>
                                                <OutlinedInput
                                                id="component-outlined"
                                                value={title}
                                                label="Title"
                                                onChange={(e) => setTitle(e.target.value)}
                                                />
                                        </FormControl>           
                                        <FormControl>
                                            <InputLabel htmlFor="component-outlined">Description</InputLabel>
                                                <OutlinedInput
                                                id="component-outlined"
                                                value={description}
                                                label="Description"
                                                onChange={(e) => setDescription(e.target.value)}
                                                />
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel htmlFor="component-outlined">Youtube Link</InputLabel>
                                                <OutlinedInput
                                                id="component-outlined"
                                                value={image}
                                                label="Youtube Link"
                                                onChange={(e) => setImage(e.target.value)}
                                                />
                                        </FormControl>
                                        <Button 
                                        style={{marginLeft: 10}} 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => {
                                            dispatch(createSong({text:title, description, link:image, user}));
                                            setCreateNewSong(false); setTitle(""); setDescription(""); setImage("")}}>
                                        Add Song</Button>
                                        <IconButton aria-label="cancel" style={{marginLeft: 10}} onClick={() => setCreateNewSong(false)}>
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    </CardContent>
                                </Card>
                            </Box>
                        </div>
                    }
                </Grid>
            </div>
        </div>
    );
}