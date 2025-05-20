import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserType } from "../types/types";

const initialState: UserType={};

export const profileSlice=createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<UserType>)=>{
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