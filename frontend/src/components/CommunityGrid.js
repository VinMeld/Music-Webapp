import React, {useEffect, useState} from 'react';
import {SongInfo} from './SongInfo';
import Grid from '@mui/material/Grid';
import {style} from './style';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, OutlinedInput, CircularProgress, MenuItem, Select } from "@mui/material";
import { getPublicSongs, reset, setSongs} from '../features/songs/songSlice';
import {toast} from     'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
export const CommunityGrid = (props) => {
    const dispatch = useDispatch();
    let {songs, isError, isLoading, isSuccess, message} = useSelector(state => state.songs);
    const [selectedTags, setSelectedTags] = useState([]);
    useEffect(() => {
        if(isError){
            toast.error(message);
        }
        dispatch(getPublicSongs());
        return () => {
            dispatch(reset());
        }
    }, [dispatch, isError, message]);
    useEffect (() => {
            
        dispatch(getPublicSongs({query: 'tags', package: selectedTags}));
        return() => {
            dispatch(reset());
        }
    }, [selectedTags, dispatch]);
    if(isLoading) {
        return <CircularProgress />;
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
                dispatch(getPublicSongs({query: 'tags', package: selectedTags}));
            }
            else{
                dispatch(getPublicSongs());
            }
        }
    } 
    // const searchForSong = (e) => {
    //     console.log("search");
    //     let searchObject = {
    //         query: 'search',
    //         package: e.target.value
    //     }
    //     dispatch(getPublicSongs(searchObject));
    // }
    let tagsList = []
    if(songs){
        //remove duplicates from tagsList
        if(songs.length > 0){
            console.log(songs);
            try{
            songs.forEach(song => {
                song.tags.forEach(tag => {
                    if(!tagsList.includes(tag)){
                        tagsList.push(tag);
                    }
                })
            })
        }catch(error){
            console.log(error);
            songs = [];
            }
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
                <h1>Community Grid</h1>
                <Button variant="contained" color="primary" onClick={() => sortByQuery("popularity")}>
                    Sort by popularity
                </Button>
                <Button variant="contained" color="primary" onClick={() => sortByQuery("recent")}>
                    Sort by most recent
                </Button>
                <Button variant="contained" color="primary" onClick={() => sortByQuery("alphabetical")}>
                    Sort by alphabetical
                </Button>
                <FormControl>
                <InputLabel htmlFor="search">Search for song</InputLabel>
                    <OutlinedInput
                    id="search"
                    label="search"
                    type="text"
                    onChange={(e) => searchForSong(e)}
                    />
                </FormControl>
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
            </div>
            <div style={style.box}>
                <Grid container spacing={3}>
                    { songs && songs.length > 0 && 
                        songs.map(song => {
                            return(
                                    <SongInfo song={song} title={song.text} description={song.description} image={song.link}/>
                            );
                        })
                    }
                </Grid>
            </div>
        </div>
    );
}