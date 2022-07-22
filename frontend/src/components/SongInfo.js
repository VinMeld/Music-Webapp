import React, {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardMedia, Chip } from '@mui/material';
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
export const SongInfo = (props) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const {isSuccess, isError, message} = useSelector(state => state.songs);
    const {user} = useSelector(state => state.auth);
    useEffect(() => {
        if(isError){
            toast.error(message);
        }
    }, [isError, message]);
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
    return(
        <div style={{margin: 10}}>
        <Card>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {props.title}
                    { user && props.song.user === user.user.id &&
                        <IconButton aria-label="edit song" onClick={() => console.log("Edited click!")} >
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
                <div>
                    {
                        props.song.tags && props.song.tags.map(tag => {
                        return <div> <Chip key={tag} label={tag} /> </div>
                    })
                    }
                </div>
                <Typography variant="body2" color="textSecondary" component="p">
                    {props.song.likes} likes
                </Typography>
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
                <div>
                <Typography variant="body2" color="textSecondary" component="p">
                    Creator: {username ? username : "Loading..."}
                </Typography>
                </div>
            </CardContent>
        </Card>
        </div>
    );
}
// export default class SongInfo extends React.Component{
//     handleClick = () => {
//         console.log("Clicked!")
//     }
//     render(){
//         console.log(this.props.image);

//         return(
//             <div style={{margin: 10}}>
//             <Card>
//                 <CardContent>
//                     <Typography gutterBottom variant="h5" component="h2">
//                         {this.props.title}
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary" component="p">
//                         {this.props.song.description}
//                     </Typography>
//                     <div>
//                     <CardMedia component="iframe" image={this.props.image} height="140" allow="fullscreen" />
//                     {
//                         !this.props.created && 
//                         !this.props.userSongs.includes(this.props.song) ? 
//                         <IconButton aria-label="add to favorites" onClick={() => this.props.addUserSong(this.props.song)} >
//                             <FavorteBorderIcon />
//                         </IconButton>
//                         :
//                         <IconButton aria-label="remove from favourites" onClick={() => this.props.removeUserSong(this.props.song)} >
//                             <FavoriteIcon />
//                         </IconButton>
//                     } 
//                     <IconButton aria-label="remove" onClick={() => dispatch(deleteSong(this.props.song.id))}>
//                         <RemoveIcon />
//                      </IconButton>
//                     <Button variant="contained" color="primary" onClick={() => console.log("Clicked!")}>
//                         Publish
//                     </Button>
//                     </div>
//                 </CardContent>
//             </Card>
//             </div>
//         );
//     }
// }