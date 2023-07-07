import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiErrorHandler } from "../../utils/apiErrorHandler";
import { toast } from "react-toastify";
import { privatUserService } from "./privateUserService";

const initialState = {
    user : null,
    isSuccess : false,
    isError : false,
    error: "",
    isLoading : false,
    message: "",
    count: null,
}

export const getPrivateUsers = createAsyncThunk(
    "privateUsers/getPrivateUsers",
    async (_, {rejectWithValue}) => {
        try{
            return await privatUserService.getPrivatUsers();
        }catch(err){
            return rejectWithValue(apiErrorHandler(err));
        }
    }
);
export const getPrivateUsersByRole = createAsyncThunk(
    "privateUsers/getPrivateUsersByRole",
    async (_data, {rejectWithValue}) => {
        try{
            return await privatUserService.getPrivatUsersByRole(_data);
        }catch(err){
            return rejectWithValue(apiErrorHandler(err));
        }
    }
);

const privateUserSlice = createSlice({
    name: "privateUser",
    initialState,
    reducers:{
        addPrivateUserErrors : (state, action) => {
            state.error = action.payload;
        },
        removePrivateUserErrors : (state, action) => {
            state.error = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPrivateUsers.pending, (state)=>{
                state.isLoading = true;
            })
            .addCase(getPrivateUsers.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.error = '';
                state.message = action.payload.message;
                if(state.isSuccess){
                    toast.info(state.message);
                }
            })
            .addCase(getPrivateUsers.rejected, (state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.user = '';
                state.message = action.payload.message;
                state.error = action.payload
            })
            .addCase(getPrivateUsersByRole.pending, (state)=>{
                state.isLoading = true;
            })
            .addCase(getPrivateUsersByRole.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.error = '';
                state.message = action.payload.message;
                if(state.isSuccess){
                    toast.info(state.message);
                }
            })
            .addCase(getPrivateUsersByRole.rejected, (state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.user = '';
                state.message = action.payload.message;
                state.error = action.payload
            });
    }
});

export const { addPrivateUserErrors, removePrivateUserErrors } = privateUserSlice.actions;
export default privateUserSlice.reducer;