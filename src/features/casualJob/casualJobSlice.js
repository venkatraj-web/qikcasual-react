import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiErrorHandler } from "../../utils/apiErrorHandler";
import { casualJobService } from "./casualJobService";
import { toast } from "react-toastify";

const initialState = {
    casualJobs: null,
    casualJobData: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    message: "",
    count: null,
}

export const getAllCasualJobs = createAsyncThunk(
    "casualJob/getAllCasualJobs",
    async (_data, {rejectWithValue}) => {
        try{
            return await casualJobService.getAllCasualJobs(_data);
        } catch(e){
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

export const updateCasualJobById = createAsyncThunk(
    "casualJob/updateCasualJobById",
    async (casualJobData, {rejectWithValue}) => {
        try{
            return await casualJobService.updateCasualJobById(casualJobData);
        } catch(e){
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

const casualJobSlice = createSlice({
    name: "casualJob",
    initialState,
    reducers: {
        addCasualJobError: (state, action) => {
            state.error = action.payload;
        },
        removeCasualJobError: (state) => {
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllCasualJobs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllCasualJobs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.error = null;
                state.isSuccess = true;
                state.casualJobs = action.payload.casual_jobs;
                state.message = action.payload.message;
                state.count = action.payload.count;
            })
            .addCase(getAllCasualJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload;
                state.isSuccess = false;
                state.casualJobs = "";
                state.message = action.payload.message;
            })
            .addCase(updateCasualJobById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCasualJobById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.error = null;
                state.isSuccess = true;
                state.casualJobData = action.payload.casual_job;
                state.message = action.payload.message;
                if(state.isSuccess){
                    toast.success(state.message);
                }
            })
            .addCase(updateCasualJobById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload;
                state.isSuccess = false;
                state.casualJobData = "";
                state.message = action.payload.message;
                if(state.isError){
                    toast.success(state.message);
                }
            });
    }
});

export const { addCasualJobError, removeCasualJobError } = casualJobSlice.actions;

export default casualJobSlice.reducer;