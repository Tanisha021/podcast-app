import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    user:null,
};

const userSlice= createSlice({
    name:"user",//will use the user word to call the slice
    initialState,
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload; //action.payload stores the data of a user
        },
        clearUser:(state)=>{
            state.user = null;
        }
    }
})

export const {setUser,clearUser} = userSlice.actions;
export default userSlice.reducer;