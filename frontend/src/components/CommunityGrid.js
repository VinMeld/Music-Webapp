import React, {useEffect} from 'react';
import {SongInfo} from './SongInfo';
import Grid from '@mui/material/Grid';
import {style} from './style';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, OutlinedInput, CircularProgress } from "@mui/material";
import { getPublicSongs, reset} from '../features/songs/songSlice';
import {toast} from     'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
export const CommunityGrid = (props) => {
    const dispatch = useDispatch();
    const {songs, isError, isLoading, isSuccess, message} = useSelector(state => state.songs);
    useEffect(() => {
        if(isError){
            toast.error(message);
        }
        dispatch(getPublicSongs());
        return () => {
            dispatch(reset());
        }
    }, [dispatch, isError, message]);
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
            </div>
            <div style={style.box}>
                <Grid container spacing={3}>
                    {
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