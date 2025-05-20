import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProfileState{
    name?: string;
    username?: string;
    email?: string;
    followers?: string[];
    followings?: string[];
    posts?: string[];
    _id?: string;
}

const initialState: ProfileState={};

export const profileSlice=createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<ProfileState>)=>{
            return {
                ...state,
                ...action.payload
            }
        },
        clearProfile: ()=>{
            return {}
        }
    }
})

export const { setProfile, clearProfile }=profileSlice.actions;
export default profileSlice.reducer;