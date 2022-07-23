import React, {useState} from 'react';
import {SongInfo} from './SongInfo';
import {style} from './style';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {IconButton, CircularProgress, CardContent, Box, Grid} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import {createSong} from '../features/songs/songSlice';
import {getSongs, reset, setSongs} from '../features/songs/songSlice';
import axios from 'axios';
import displayFilters from './helperComponents/displayFilters';
import DisplayNewSongs from './helperComponents/DisplayNewSongs';
import {generateTagsList} from './helperFunction/generateTagsList';
export const FavouriteSongs = () => {
    const [createNewSong, setCreateNewSong] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);
    const {songs, isError, isLoading, message} = useSelector(state => state.songs);
    const [selectedTags, setSelectedTags] = useState([]);
    // This needs to be at the top for some reason, but it queries for the tags that were selected
    useEffect (() => {
        dispatch(getSongs({query: 'tags', package: selectedTags}));
        return() => {
            dispatch(reset());
        }
    }, [selectedTags]);

    // Loading user stuff
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
    // Making sure that it's a youtube url
    const retrieveID = (url) => {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    }
    // Generating the URL
    const setYoutubeUrl = (url, startAtMinutes, startAtSeconds, endAtMinutes, endAtSeconds) => {
        let id  = retrieveID(url);
        if(!id){
            toast.error("Invalid Youtube Link");
            return "";
        }
        let startAt = parseInt(startAtMinutes)*60 + parseInt(startAtSeconds);
        let endAt = parseInt(endAtMinutes)*60 + parseInt(endAtSeconds);
        return (`https://www.youtube.com/embed/${id}?start=${startAt}&end=${endAt}`);
    }
    // This needs to be redone to send a axios.post request to get all the different songs.
    const checkIfSongExists = (title, currentVideo) => {
        // TODO Redo this guy
        if(songs.find(s => s.title === title || s.link === currentVideo)){
            return true;
        }
        return false;
    }
    // This adds the song based on the inputs from the displayNewSongs component
    const addSong = (title, description, currentVideo, tags, startAtMinutes, startAtSeconds, endAtMinutes, endAtSeconds) => {
        if(!title || !description || !currentVideo){
            toast.error("Please fill out all fields");
            return;
        }
        currentVideo = setYoutubeUrl(currentVideo, startAtMinutes, startAtSeconds, endAtMinutes, endAtSeconds);
        if(checkIfSongExists(title, "test")){
            toast.error("Song name");
            return;
        }
        axios.get('/api/songs/checkSong/' + title).then(res => {
            if(res.data.message === 'true') {
                toast.error("Song already exists");
                return;
            }
            dispatch(createSong({title:title, description, link:currentVideo, user, tags}));
            setCreateNewSong(false);
            toast.success("Song added successfully");
        }).catch(err => {
            toast.error("Server Problem");
        });       
    }
    // This searches the songs for the song based on title. 
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
    // This generates the tag list which is loaded in the drop down menu in displayFilters.
    let tagsList = generateTagsList(songs);

    // This is for the sort By xyz stuff in the displayFilters component
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
                {displayFilters({sortByQuery, searchForSong, selectedTags, setSelectedTags, tagsList})}
            </div>
            <div style={style.box}>
                <Grid container spacing={3}>
                    {  songs && songs.length > 0 &&
                        songs.map(song => {
                            return(
                                    <SongInfo song={song} title={song.title} description={song.description} image={song.link}  />
                            );
                        })
                    }
                    {!createNewSong ? 
                        <IconButton aria-label="add new Song" style={{marginLeft: 10}} onClick={() => setCreateNewSong(true)}>
                            <AddCircleOutlineIcon />
                        </IconButton> :
                        <DisplayNewSongs addSong={addSong} setCreateNewSong={setCreateNewSong} />
                    }
                </Grid>
            </div>
        </div>
    );
}