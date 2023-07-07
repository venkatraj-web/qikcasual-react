import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { casualService } from "./casualService";
import { apiErrorHandler } from "../../utils/apiErrorHandler";
import { toast } from "react-toastify";

const initialState = {
    count: null,
    user: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: "",
    message: ""
}

export const getCasuals = createAsyncThunk(
    "casuals/getCasuals",
    async (_data, {rejectWithValue}) => {
        try{
            return await casualService.getCasuals(_data);
        }catch(e){
            return rejectWithValue(apiErrorHandler(e));
        }
    }
)

const casualsSlice = createSlice({
    name: "casuals",
    initialState,
    reducers: {
        addCasualErrors: (state, action) => {
            state.error = action.payload;
        },
        removeCasualErrors: (state, action) => {
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCasuals.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCasuals.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.error = "";
                state.isError = false;
                state.user = action.payload;
                state.message = action.payload.message;
                state.count = action.payload.count;
                if(state.isSuccess){
                    toast.info(state.message);
                }
            })
            .addCase(getCasuals.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.error = action.payload;
                state.isError = true;
                state.user = "";
                state.message = action.payload.message;
            });
    }
});

export const { addCasualErrors, removeCasualErrors } = casualsSlice.actions;

export default casualsSlice.reducer;