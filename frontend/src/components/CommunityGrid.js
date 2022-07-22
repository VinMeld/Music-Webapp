import React, {useEffect, useState} from 'react';
import {SongInfo} from './SongInfo';
import Grid from '@mui/material/Grid';
import {style} from './style';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, OutlinedInput, CircularProgress, MenuItem, Select } from "@mui/material";
import { getPublicSongs, reset} from '../features/songs/songSlice';
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
        console.log("search");
        let searchObject = {
            query: 'search',
            package: e.target.value
        }
        dispatch(getPublicSongs(searchObject));
    }
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
    return(
        <div style={style.main}>
            <div style={style.header}>
                <h1>Community Grid</h1>
                <Button variant="contained" color="primary" onClick={() => dispatch(getPublicSongs("popularity"))}>
                    Sort by popularity
                </Button>
                <Button variant="contained" color="primary" onClick={() => dispatch(getPublicSongs("recent"))}>
                    Sort by most recent
                </Button>
                <Button variant="contained" color="primary" onClick={() => dispatch(getPublicSongs("alphabetical"))}>
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