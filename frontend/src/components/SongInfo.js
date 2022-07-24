import React, {useEffect, useState, useMemo} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardMedia, Chip, InputLabel, OutlinedInput, TextField } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import FavorteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from '@mui/material/Button';
import {useDispatch, useSelector} from 'react-redux';
import {deleteSong, changeSong, modifyLikeSong} from '../features/songs/songSlice';
import {getUser} from "../features/auth/authSlice";
import {toast} from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import ChipsArray from './helperComponents/Tags.js';
export const SongInfo = (props) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const {user} = useSelector(state => state.auth);
    const [title, setTitle] = useState(props.title);
    const [description, setDescription] = useState(props.description);
    const [tags, setTags] = useState(props.tags);
    const [image, setImage] = useState();
    const [startAtMinutes, setStartAtMinutes] = useState(0);
    const [startAtSeconds, setStartAtSeconds] = useState(0);
    const [endAtMinutes, setEndAtMinutes] = useState(0);
    const [endAtSeconds, setEndAtSeconds] = useState(0);
    const parseTimesFromLink = (link) => {
        let startAt = 0;
        let endAt = 0;
        if(link.includes("start") && link.includes("end")){
            startAt = link.split("start=")[1].split("&")[0];
            endAt = link.split("end=")[1].split("&")[0];
        } else if(link.includes("start")){
            startAt = link.split("start=")[1].split("&")[0];
        } else if(link.includes("end")){
            endAt = link.split("end=")[1].split("&")[0];
        }
        startAt = parseInt(startAt);
        endAt = parseInt(endAt);
        let startAtMinutes = Math.floor(startAt/60);
        let startAtSeconds = startAt-startAtMinutes*60;
        let endAtMinutes = Math.floor(endAt/60);
        let endAtSeconds = endAt-endAtMinutes*60;
        setStartAtMinutes(startAtMinutes);
        setStartAtSeconds(startAtSeconds);
        setEndAtMinutes(endAtMinutes);
        setEndAtSeconds(endAtSeconds);
    }
    const renderCreator = useMemo(() => {
        return (
        <div>
                <Typography variant="body2" color="textSecondary" component="p">
                    Creator: {username ? username : "Loading..."}
                </Typography>
                </div>
        );
    }, [username]);
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
    const generateLink = (url) => {
        if(checkYoutube(url)){
            let id = retrieveID(url);
            if(!id){
                toast.error("Invalid Youtube Link");
                return "";
            }
            let startAt = parseInt(startAtMinutes)*60 + parseInt(startAtSeconds);
            let endAt = parseInt(endAtMinutes)*60 + parseInt(endAtSeconds);
            console.log(startAt, endAt);
            return (`https://www.youtube.com/embed/${id}?start=${startAt}&end=${endAt}`);
        } else {
            toast.error("This is not a youtube link");
        }
    }
    const generateLinkFromTime = (url) => {
        // Use the url to get the video id, then generate the link using watch
        let id = url;
        if (id.includes("?")){
            id = id.split("?")[0];
        }
        if(id.includes("/")){
            id = id.split("/")[id.split("/").length-1];
        }
        return (`https://www.youtube.com/watch?v=${id}`);
    }
    // Sets the link properly when it's changed
    useEffect(() => {
        parseTimesFromLink(props.image);
        setImage(generateLinkFromTime(props.image));
    }, [props.image]);
    
    useEffect(() => {
        axios.get('/api/users/' + props.song.user).then(res => {
            setUsername(res.data);
        });
    }, [props.song.user]);
    const handlePublish = (song) => {
        let newSong = {...song, isPrivate: !song.isPrivate};
        dispatch(changeSong(newSong));
    }
    const handleAddFavourite = (song) => {
        console.log(song)
        let idObject = {
            id: song._id,
            userId: user.user.id
        };
        dispatch(modifyLikeSong(idObject));
    }
    const handleRemoveFavourite = (song) => {
        let idObject = {
            id: song._id,
            userId: user.user.id
        };
        dispatch(modifyLikeSong(idObject));
    }
    const changeOldSong = () => {
        console.log("change old song");
        let currentVideo = image;
        if(!title || !description || !currentVideo){
            toast.error("Please fill out all fields");
            return;
        }
        currentVideo = generateLink(currentVideo);
        // Send the request to the server and then update the song
        axios.get('/api/songs/checkSong/' + title).then(res => {
            console.log(res.data);
            if(res.data.message === 'true' && title !== props.title){
                toast.error("Song already exists");
                return;
            }
            let newSong = {
                ...props.song,
                title: title,
                description: description,
                link: currentVideo,
                tags: tags,
            }
            dispatch(changeSong(newSong));
            setIsEdit(false); setTitle(""); setDescription(""); setImage(""); setStartAtMinutes(0); setStartAtSeconds(0); setEndAtMinutes(0); setEndAtSeconds(0); 
        })
    }
    return(
        <div style={{margin: 10}}>
        <Card >
            <CardContent>
            { !isEdit ?
                <div>
                {/* If the song is not being edited, show the song info */}
                <Typography gutterBottom variant="h5" component="h2">
                    {props.title}
                    { user && props.song.user === user.user.id &&
                        <IconButton aria-label="edit song" onClick={() => setIsEdit(true)} >
                            <EditIcon />
                        </IconButton>
                    }
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {props.description}
                </Typography>
                <div>
                <CardMedia component="iframe" image={props.image} height="140" allow="fullscreen" />
                {
                    user &&
                    <div>
                    {
                    !props.song.likedBy.includes(user.user.id) ? 
                    <div>
                    <IconButton aria-label="add to favorites" onClick={() => {
                        handleAddFavourite(props.song)}} >
                        <FavorteBorderIcon />
                    </IconButton>
                    </div>
                    :
                    <div>
                    <IconButton aria-label="remove from favourites" onClick={() => handleRemoveFavourite(props.song)} >
                        <FavoriteIcon />
                    </IconButton>
                    </div>
                    }
                    
                    </div>
                }
                <Typography variant="body2" color="textSecondary" component="p">
                    {props.song.likes} likes
                     </Typography>
                <div>
                    {
                        props.song.tags && props.song.tags.map(tag => {
                        return <div> <Chip key={tag} label={tag} /> </div>
                    })
                    }
                </div>
               
                { user &&  props.song.user === user.user.id &&
                    <IconButton aria-label="remove" onClick={() => {
                        dispatch(deleteSong(props.song._id))}} >
                        <RemoveIcon />
                    </IconButton>
                }
                { user &&  props.song.user === user.user.id &&
                <Button
                style={{marginLeft: 10}} 
                variant="contained" 
                color="primary" 
                onClick={() => handlePublish(props.song)}>
                    {props.song.isPrivate ? "Publish" : "Unpublish"}
                </Button>
                }
                </div>
               {renderCreator}
                </div>
                :
                <div>
                    {/* Edit song form */}
                     <div>
                    <TextField
                    id="title"
                    label="Title"
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    defaultValue={props.title}
                    value={title}
                    />
                    <IconButton aria-label="edit song" onClick={() => {
                        setIsEdit(false);
                    }}>
                        <RemoveIcon />
                    </IconButton>
                    </div>
                    <div style={{marginTop: 5}}>
                    <TextField
                    id="description"
                    label="Description"
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    defaultValue={props.description}
                    value={description}
                    />
                    </div>
                    <div style={{marginTop: 5}}>
                    <TextField
                    id="link"
                    label="link"
                    type="text"
                    onChange={(e) => setImage(e.target.value)}
                    defaultValue={props.image}
                    value={image}
                    />
                    </div>
                    <div style={{marginTop: 5}}>
                    <TextField
                    id="startAtMinutes"
                    label="Start at Minutes"
                    type="text"
                    defaultValue={startAtMinutes}
                    onChange={(e) => setStartAtMinutes(e.target.value)}
                    value={startAtMinutes}
                    />
                    <TextField
                    id="startAtSeconds"
                    label="Start at Seconds"
                    type="text"
                    onChange={(e) => setStartAtSeconds(e.target.value)}
                    value={startAtSeconds}
                    defaultValue={startAtSeconds}
                    />
                    </div>
                    <div style={{marginTop: 5}}>
                    <TextField
                    id="endAtMinutes"
                    label="End at Minutes"
                    type="text"
                    onChange={(e) => setEndAtMinutes(e.target.value)}
                    value={endAtMinutes}
                    defaultValue={endAtMinutes}
                    />
                    <TextField
                    id="endAtSeconds"
                    label="End at Seconds"
                    type="text"
                    onChange={(e) => setEndAtSeconds(e.target.value)}
                    value={endAtSeconds}
                    defaultValue={endAtSeconds}
                    />
                    </div>
                    <div style={{marginTop: 5}}>
                    <ChipsArray tags={props.song.tags} setTags={setTags} />
                    </div>
                    <div style={{marginTop: 5}}>
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={() => changeOldSong()}>
                        Save
                    </Button>
                    </div>
                </div>
            }
            </CardContent>
        </Card>
        </div>
    );
}
