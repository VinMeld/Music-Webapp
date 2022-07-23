import React, {useState} from 'react'
import { toast } from 'react-toastify';
import {Card, CardContent, Button, IconButton, InputLabel, OutlinedInput, FormControl, Box} from '@mui/material'
import ChipsArray from './Tags'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
const DisplayNewSongs = (props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState("");
    const [tags, setTags] = useState([]);
    const [startAtMinutes, setStartAtMinutes] = useState(0);
    const [startAtSeconds, setStartAtSeconds] = useState(0);
    const [endAtMinutes, setEndAtMinutes] = useState(0);
    const [endAtSeconds, setEndAtSeconds] = useState(0);
    const checkYoutube = (url) => {
        if(url.includes("youtube") || url.includes("youtu.be")){
            return true;
        }
        return false;
    }
  return (
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
                    <ChipsArray setTags={setTags} tags={tags} />
                    <Button 
                    style={{marginLeft: 10}} 
                    variant="contained" 
                    color="primary"
                    onClick={ () => {
                        console.log(tags);
                        if(checkYoutube(video)){
                        props.addSong(title, description, video, tags, startAtMinutes, startAtSeconds, endAtMinutes, endAtSeconds);
                        setTitle("");
                        setDescription("");
                        setVideo("");
                        setTags([]);
                        setStartAtMinutes(0);
                        setStartAtSeconds(0);
                        setEndAtMinutes(0);
                        setEndAtSeconds(0);
                        
                        } else{
                            toast.error("Please enter a valid youtube link");
                        }
                    }}>
                    Add Song</Button>
                    <IconButton aria-label="cancel" style={{marginLeft: 10}} onClick={() => props.setCreateNewSong(false)}>
                        <RemoveCircleOutlineIcon />
                    </IconButton>
                </CardContent>
            </Card>
        </Box>
    </div>
  )
}

export default DisplayNewSongs