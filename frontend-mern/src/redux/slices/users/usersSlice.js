import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit"
import axios from "axios"
import baseURL from "../../../utils/baseURL"

// initial state
const initialState ={
    loading: false,
    error: null,
    users:[],
    user: {},
    profile: {},
    userAuth:{
        loading: false,
        error: null,
        userInfo:{}
    }
}

//login action
export const loginUserAction = createAsyncThunk('user/login',
 async(payload, {rejectWithValue, getState, dispatch})=>{
    try {
        //make the http request
        const {data} = await axios.post(`${baseURL}/users/login`, {
            email: payload?.email,
            password: payload?.password
        })
        //save the user into local storage
        localStorage.setItem('userInfo', JSON.stringify(data))
        return data
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
 })


 //users slice
const userSlice = createSlice({
    name: 'users',
    initialState,
    extraReducers: (builder)=>{
        //handle actions
        // login
        builder.addCase(loginUserAction.pending, (state, action)=>{
            state.userAuth.loading = true
            state.userAuth.error = false
        })
        builder.addCase(loginUserAction.fulfilled, (state, action)=>{
            state.userAuth.userInfo = action.payload
            state.userAuth.loading = false
            state.userAuth.error = false
        })
        builder.addCase(loginUserAction.rejected, (state, action)=>{
            state.userAuth.error = action.payload
            state.userAuth.loading = false
        })
    }
})



// generate reducer
const usersReducer = userSlice.reducer

export default usersReducer