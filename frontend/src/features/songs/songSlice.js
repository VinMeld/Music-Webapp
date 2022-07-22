import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import songService from './songService';
const initialState = {
    songs: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}
// Create new song
export const createSong = createAsyncThunk(
    'songs/create',
    async (song, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await songService.createSong(song , token);
        } catch (error) {
            let message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            if(error.response.data.error){
                message = error.response.data.error;
            }
            return thunkAPI.rejectWithValue(message)
        }
    }
)
// Change new song
export const changeSong = createAsyncThunk(
    'songs/change',
    async (song, thunkAPI) => {
        console.log('in changeSong')
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await songService.changeSong(song , token);
        } catch (error) {
            let message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            if(error.response.data.error){
                message = error.response.data.error;
            }
            return thunkAPI.rejectWithValue(message)
        }
    }
)
// Change new song
export const modifyLikeSong = createAsyncThunk(
    'songs/addLike',
    async (idObject, thunkAPI) => {
        console.log('in addLikeSong')
        try {
            const token = thunkAPI.getState().auth.user.token;
            console.log("sending to server: ", idObject)
            return await songService.changeLikeSong(idObject.id, idObject.userId, token);
        } catch (error) {
            console.log("error: ", error)
            let message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            if(error.response.data.error){
                message = error.response.data.error;
            }
            return thunkAPI.rejectWithValue(message)
        }
    }
)
// Delete new song
export const deleteSong = createAsyncThunk(
    'songs/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await songService.deleteSong(id, token);
        } catch (error) {
            let message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            if(error.response.data.error){
                message = error.response.data.error;
            }
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Get Public Songs
export const getPublicSongs = createAsyncThunk(
    'songs/getPublicSongs',
    async (query) => {
        try {
            console.log("query: ", query)
            return await songService.getPublicSongs(query);
        } catch (error) {
            let message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            if(error.response.data.error){
                message = error.response.data.error;
            }
            return message
        }
    }
)
// get all songs
export const getSongs = createAsyncThunk(
    'songs/getAll',
    async (query,thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await songService.getSongs(query, token);
        } catch (error) {
            let message =

                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            if(error.response.data.message){
                message = error.response.data.message;
            }
            return thunkAPI.rejectWithValue(message)
        }
    }
)
export const songSlice = createSlice({
    name: 'song',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
        .addCase(createSong.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(createSong.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload
            console.log(action.payload)
            state.songs.push(action.payload)
        })
        .addCase(createSong.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(getSongs.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(getSongs.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.songs = (action.payload)
        })
        .addCase(getSongs.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(deleteSong.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(deleteSong.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.songs = state.songs.filter(song => song._id !== action.payload.id)
        })
        .addCase(deleteSong.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(changeSong.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(changeSong.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload
            state.songs.map(song => { 
                if(song._id === action.payload._id){ 
                    song = action.payload
                } 
                return song;
            });
        })
        .addCase(changeSong.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(getPublicSongs.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(getPublicSongs.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.songs = action.payload;
        })
        .addCase(getPublicSongs.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(modifyLikeSong.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(modifyLikeSong.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload
            state.songs.map(song => { 
                if(song._id === action.payload._id){ 
                    song = action.payload
                } 
                return song;
            });
        })
        .addCase(modifyLikeSong.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
});
export const {reset} = songSlice.actions;
export default songSlice.reducer;