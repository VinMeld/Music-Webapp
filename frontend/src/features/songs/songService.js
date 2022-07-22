import axios from 'axios';

const API_URL = '/api/songs/';

// Crate new song
const createSong = async (song, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL, song, config);
    return response.data;
}
// Delete user song
const deleteSong = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }
    console.log(`id: ${id}`)
    const response = await axios.delete(API_URL + id, config);
    return response.data;
}
// Change new song
const changeSong = async (song, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    console.log('song: ', song)
    const response = await axios.put(API_URL+ song._id, song, config);
    return response.data;
}

// get all songs
const getSongs = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL, config);
    return response.data;
    
}
const getPublicSongs = async (query) => {
    let response;
    if(typeof query === 'object'){
        response = await axios.get(API_URL + 'getPublicSongs/' + query.search, query.package);
    }
    else if(query){
        response = await axios.get(API_URL + 'getPublicSongs/' + query);
    } else {
        response = await axios.get(API_URL + 'getPublicSongs');
    }
    return response.data;
}
const changeLikeSong = async (id, userId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    console.log("in change likesong in song service")
    const response = await axios.put(API_URL + id + '/' + userId, config);
    return response.data;
}
const songService = {
    createSong,
    getSongs,
    deleteSong,
    changeSong,
    getPublicSongs,
    changeLikeSong
}
export default songService;