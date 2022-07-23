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
import {Select, MenuItem} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import {createSong} from '../features/songs/songSlice';
import {getSongs, reset, getPublicSongs, setSongs} from '../features/songs/songSlice';
import ChipsArray from './helperComponents/Tags.js';
import axios from 'axios';
export const UserGrid = (props) => {
    
    const [createNewSong, setCreateNewSong] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState("");
    const [tags, setTags] = useState([]);
    const [startAtMinutes, setStartAtMinutes] = useState(0);
    const [startAtSeconds, setStartAtSeconds] = useState(0);
    const [endAtMinutes, setEndAtMinutes] = useState(0);
    const [endAtSeconds, setEndAtSeconds] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);
    const {songs, isError, isLoading, isSuccess, message} = useSelector(state => state.songs);
    const [selectedTags, setSelectedTags] = useState([]);
    useEffect (() => {
        // // axios post request to filterCurrentSongs/:tags to get songs with tags and send body of songs
        // let packageString = '';
        // for(let i = 0; i < selectedTags.length; i++){
        //     packageString += selectedTags[i] + ',';
        // }
        // console.log(selectedTags);
        // console.log(packageString);
        // if(packageString){
        //     // if you remove a filter, I still need to parse all the songs with that given tag. 
        //     // So I need to send the whole array of songs
            
        //     axios.post('/api/songs/filterCurrentSongs/' + packageString, {songs}
        //     ).then(res => {
        //         console.log(res.data);
        //         dispatch(setSongs(res.data));
        //     })
        //     return() => {
        //         dispatch(reset());
        //     }
        // } else {
        //     dispatch(getSongs());
        // }
        dispatch(getSongs({query: 'tags', package: selectedTags}));
        return() => {
            dispatch(reset());
        }
    }, [selectedTags]);
    const checkYoutube = (url) => {
        if(url.includes("youtube") || url.includes("youtu.be")){
            return true;
        }
        return false;
    }
    const retrieveID = (url) => {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    }
    const setYoutubeUrl = (url) => {
        if(checkYoutube(url)){
            let id  = retrieveID(url);
            if(!id){
                toast.error("Invalid Youtube Link");
                return "";
            }
            let startAt = parseInt(startAtMinutes)*60 + parseInt(startAtSeconds);
            let endAt = parseInt(endAtMinutes)*60 + parseInt(endAtSeconds);
            return (`https://www.youtube.com/embed/${id}?start=${startAt}&end=${endAt}`);
     }
    }
    useEffect(() => {
        if(!user){
            navigate("/");
        }
        if(isError){
            toast.error(message);
        }
        dispatch(getSongs(null));
        
        return () => {
            dispatch(reset());
        }
    }, [user, navigate, isError, message, dispatch]);
    if(isLoading) {
        return <CircularProgress />;
    }
    const checkIfSongExists = (title, currentVideo) => {
        // Redo this guy
        if(songs.find(s => s.text === title || s.link === currentVideo)){
            return true;
        }
        return false;
    }
    const addSong = (title, description, currentVideo) => {
        if(!title || !description || !currentVideo){
            toast.error("Please fill out all fields");
            return;
        }
        currentVideo = setYoutubeUrl(currentVideo);
        if(checkIfSongExists(title, currentVideo)){
            toast.error("Song name or timestamps already exists");
            return;
        }
        dispatch(createSong({text:title, description, link:currentVideo, user, tags}));
        setCreateNewSong(false); setTitle(""); setDescription(""); setVideo(""); setStartAtMinutes(0); setStartAtSeconds(0); setEndAtMinutes(0); setEndAtSeconds(0); 
    }
    const searchForSong = (e) => {
        let searchTerm = e.target.value.trim();
        console.log(searchTerm);
        if(searchTerm){
            axios.post('/api/songs/searchCurrentSongs/'+ searchTerm, {songs}
            ).then(res => {
                dispatch(setSongs(res.data));
            })
        } else {
            if(selectedTags.length > 0){
                dispatch(getSongs({query: 'tags', package: selectedTags}));
            }
            else{
                dispatch(getSongs());
            }
        }
    }
 
    let tagsList = []
    if(songs){
        //remove duplicates from tagsList
        if(songs.length > 0){
            songs.forEach(song => {
                song.tags.forEach(tag => {
                    if(!tagsList.includes(tag)){
                        tagsList.push(tag);
                    }
                })
            })
        }
    }
    const sortByQuery = (query) => {
        // Send a axios request to the server endpoint of sortCurrentSongs/:query with the
        // body being the current songs and the query being the query
        // Then dispatch the action to update the state
        axios.post('/api/songs/sortCurrentSongs/'+ query, {songs}
        ).then(res => {
            dispatch(setSongs(res.data));
        })
    }
    return(
        <div style={style.main}>
            <div style={style.header}>
                <h1>Welcome {user && user.user.name}!</h1>
                <h2>Your songs!</h2>
                <Button variant="contained" color="primary" onClick={() => sortByQuery("popularity")}>
                Sort by popularity
            </Button>
            <Button variant="contained" color="primary" onClick={() => sortByQuery("recent")}>
                Sort by most recent
            </Button>
            <Button variant="contained" color="primary" onClick={() => sortByQuery("alphabetical")}>
                Sort by alphabetical
            </Button>
            <div>
               <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-name-label">Name</InputLabel>
                <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={selectedTags}
                onChange={(e) => {
                    setSelectedTags(
                    // On autofill we get a stringified value.
                    typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value,
                  )}}
                input={<OutlinedInput label="Name" />}
                >
                {tagsList.map((tag) => (
                    <MenuItem
                    key={tag}
                    value={tag}
                    >
                    {tag}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            </div>
            <FormControl>
            <InputLabel htmlFor="search">Search for song</InputLabel>
                <OutlinedInput
                id="search"
                label="search"
                type="text"
                onChange={(e) => searchForSong(e)}
                />
        </FormControl>
            </div>
            <div style={style.box}>
                <Grid container spacing={3}>
                    {  songs && songs.length > 0 &&
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
                                                value={video}
                                                label="Youtube Link"
                                                onChange={(e) => setVideo(e.target.value)}
                                                />
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel htmlFor="component-outlined">Start at minutes</InputLabel>
                                                <OutlinedInput
                                                id="component-outlined"
                                                value={startAtMinutes}
                                                label="Youtube Link"
                                                onChange={(e) => setStartAtMinutes(e.target.value)}
                                                />
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel htmlFor="component-outlined">Start at seconds</InputLabel>
                                                <OutlinedInput
                                                id="component-outlined"
                                                value={startAtSeconds}
                                                label="Youtube Link"
                                                onChange={(e) => setStartAtSeconds(e.target.value)}
                                                />
                                        </FormControl>
                                        <FormControl>
                                        <InputLabel htmlFor="component-outlined">End at minutes</InputLabel>
                                            <OutlinedInput
                                            id="component-outlined"
                                            value={endAtMinutes}
                                            label="Youtube Link"
                                            onChange={(e) => setEndAtMinutes(e.target.value)}
                                            />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="component-outlined">End at seconds</InputLabel>
                                            <OutlinedInput
                                            id="component-outlined"
                                            value={endAtSeconds}
                                            label="Youtube Link"
                                            onChange={(e) => setEndAtSeconds(e.target.value)}
                                            />
                                    </FormControl>
                                        <ChipsArray setTags={setTags} />
                                        <Button 
                                        style={{marginLeft: 10}} 
                                        variant="contained" 
                                        color="primary"
                                        onClick={ () => {
                                            checkYoutube(video) ?
                                            addSong(title, description, video) :
                                            
                                            toast.error("Please enter a valid youtube link");
                                        }}>
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