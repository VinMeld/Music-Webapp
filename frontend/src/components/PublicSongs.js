import React, {useEffect, useState} from 'react';
import {SongInfo} from './SongInfo';
import {style} from './style';
import { CircularProgress, Grid } from "@mui/material";
import { getPublicSongs, reset, setSongs} from '../features/songs/songSlice';
import {toast} from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {DisplayFilters} from './helperComponents/DisplayFilters';
import {generateTagsList} from './helperFunction/generateTagsList';
export const PublicSongs = () => {
    const dispatch = useDispatch();
    let {songs, isError, isLoading, message} = useSelector(state => state.songs);
    const [selectedTags, setSelectedTags] = useState([]);
    // Loading the songs
    useEffect(() => {
        if(isError){
            toast.error(message);
        }
        dispatch(getPublicSongs());
        return () => {
            dispatch(reset());
        }
    }, [dispatch, isError, message]);

    // Filter based on tags
    useEffect (() => {
        dispatch(getPublicSongs({query: 'tags', package: selectedTags}));
        return() => {
            dispatch(reset());
        }
    }, [selectedTags, dispatch]);
    // if(isLoading) {
    //     return <CircularProgress />;
    // } 
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
                dispatch(getPublicSongs({query: 'tags', package: selectedTags}));
            }
            else{
                dispatch(getPublicSongs());
            }
        }
    } 
     // This generates the tag list which is loaded in the drop down menu in displayFilters.
    let tagsList = generateTagsList(songs);
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
                <h1 style={{display: 'flex', alignItems: 'center', justifyContent:'center'}}>Public Songs!</h1>
                <DisplayFilters selectedTags={selectedTags} sortByQuery={sortByQuery} setSelectedTags={setSelectedTags} tagsList={tagsList} searchForSong={searchForSong} />
            </div>
            <div style={style.box}>
                <Grid container spacing={3}>
                    { songs && songs.length > 0 && 
                        songs.map(song => {
                            return(
                                    <SongInfo song={song} title={song.title} description={song.description} image={song.link}/>
                            );
                        })
                    }
                </Grid>
            </div>
        </div>
    );
}