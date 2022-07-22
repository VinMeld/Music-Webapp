const asyncHandler = require('express-async-handler');

const Song = require('../models/songModel');
const User = require('../models/userModel');
//@desc Get Songs
//@route GET /api/songs
//@access Private

const getSongs = asyncHandler(async (req, res) => {
    const songs = await Song.find({user: req.user.id});
    res.status(200).json(songs);
});
//@desc Set Songs
//@route POST /api/songs
//@access Private
const setSong = asyncHandler (async (req, res) => {
    if(!req.body.text){
        res.status(400);
        throw new Error('No song text provided');
    }
    const song = await Song.create({
        text:req.body.text,
        description: req.body.description,
        likes: 0,
        comments: [],
        link: req.body.link,
        user: req.user.id
    });
    res.status(200).json(song);
});
//@desc Change Songs
//@route PUT /api/songs/:id
//@access Private
const changeSong = asyncHandler (async (req, res) => {
    console.log("in changeSong");
    const song = await Song.findById(req.params.id);
    if(!song){
        res.status(404);
        throw new Error('Song not found');
    }
    if(!req.user){
        res.status(404);
        throw new Error('User not found');
    }
    if(song.user.toString() !== req.user.id.toString()){
        res.status(401);
        throw new Error('Not authorized');
    }
    const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json(updatedSong);
})
//@desc Delete Songs
//@route DELETE /api/songs/:id
//@access Private
const deleteSong = asyncHandler (async (req, res) => {
    const song = await Song.findById(req.params.id);
    if(!song){
        res.status(404);
        throw new Error('Song not found');
    }
    if(!req.user){
        res.status(404);
        throw new Error('User not found');
    }
    if(song.user.toString() !== req.user.id.toString()){
        res.status(401);
        throw new Error('Not authorized');
    }
    const deletedSong = await Song.deleteOne({ _id: req.params.id });
    if(!deletedSong){
        res.status(404);
        throw new Error('Song not found');
    }
    res.status(200).json({id: req.params.id});
})
//@desc Get Public Songs Songs
//@route GET /api/songs/getPublicSongs
//@access Public
const getPublicSongs = asyncHandler (async (req, res) => {
    const songs = await Song.find({isPrivate: false});
    if(req.params.query){
        const query = req.params.query.toLowerCase();
        if(query === "popularity"){
            songs.sort((a, b) => b.likes - a.likes);
        } else if(query === "recent"){
            songs.sort((a, b) => b.createdAt - a.createdAt);
        } else if(query === "alphabetical"){
            songs.sort((a, b) => a.text.localeCompare(b.text));
        } else if(query === "random") {
            songs.sort((a, b) => 0.5 - Math.random());
        }else if(query === "comments"){
            songs.sort((a, b) => b.comments.length - a.comments.length);
        } else if(query === 'search') {
            console.log(req.body)
            let searchItem = req.body.package;
            songs.filter(song => song.text.toLowerCase().includes(searchItem.toLowerCase()));
        }
    }
    res.status(200).json(songs);
})
//@desc Get Public Songs Songs
//@route POST /api/songs/like/:id/:userId
//@access Public
const likeSong = asyncHandler (async (req, res) => {
    const song = await Song.findById(req.params.id);
    console.log("song", song);
    if(!song){
        res.status(404);
        throw new Error('Song not found');
    }
    const user = await User.findById(req.params.userId);
    if(!user){
        res.status(404);
        throw new Error('User not found');
    }
    if(song.likedBy.includes(user.id)){
        song.likes--;
        song.likedBy.splice(song.likedBy.indexOf(user.id), 1);
    } else {
        song.likes++;
        song.likedBy.push(req.params.userId);
    }
    const updatedSong = await Song.findByIdAndUpdate(req.params.id, song, {
        new: true,
        runValidators: true
    });
    res.status(200).json(updatedSong);
})

module.exports = {
    getSongs,
    setSong,
    changeSong,
    deleteSong,
    getPublicSongs,
    likeSong
}