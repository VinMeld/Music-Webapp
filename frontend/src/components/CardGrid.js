import React, {useState} from 'react';
import {SongInfo} from './SongInfo';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import {style} from './style';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
export const CardGrid = (props) => {
    const [createSong, setCreateSong] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [displayFavourites, setDisplayFavourites] = useState(false);
    const changeDisplayFavourites = () => {
        setDisplayFavourites(!displayFavourites);
    }
    return(
        <div style={style.main}>
            <div style={style.header}>
                <Button variant="contained" color="primary" onClick={() => changeDisplayFavourites()}>
                    Favourites
                </Button>
            </div>
            <div style={style.box}>
                <Grid container spacing={3}>
                    {   
                        !displayFavourites ?
                        props.songs.map(song => {
                            return(
                                    <SongInfo song={song} userSongs={props.userSongs} addUserSong={props.addUserSong} removeUserSong={props.removeUserSong} removeSong={props.removeSong}/>
                            );
                        })
                        :
                        props.songs.filter(song => {
                            return props.userSongs.includes(song);
                        }).map(song => {
                            return(
                                    <SongInfo song={song} title={song.title} description={song.description} image={song.image} userSongs={props.userSongs} addUserSong={props.addUserSong} removeUserSong={props.removeUserSong} removeSong={props.removeSong}/>
                            );
                            })
                    }
                    
                    {!createSong ? 
                        <IconButton aria-label="add new Song" style={{marginLeft: 10}} onClick={() => setCreateSong(true)}>
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
                                        onClick={() => {props.addSong(title, description, image); setCreateSong(false); setTitle(""); setDescription(""); setImage("")}}>
                                        Add Song</Button>
                                        <IconButton aria-label="cancel" style={{marginLeft: 10}} onClick={() => setCreateSong(false)}>
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