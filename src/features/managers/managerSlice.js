import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { managerService } from "./managerService";
import { apiErrorHandler } from "../../utils/apiErrorHandler";
import { toast } from "react-toastify";

const initialState = {
    count: null,
    managers: null,
    managerData: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    message: ""
}

export const getAllManagers = createAsyncThunk(
    "manager/getAllManagers",
    async (_data, {rejectWithValue}) => {
        try{
            return await managerService.getAllManagersFromServer(_data);
        } catch(e){
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

export const updateManagerById = createAsyncThunk(
    "manager/updateManagerById",
    async (managerData, {rejectWithValue}) => {
        try{
            return await managerService.updateManagerById(managerData);
        } catch(e){
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

const managerSlice = createSlice({
    name: "manager",
    initialState,
    reducers: {
        addManagerError: (state, action) => {
            state.error = action.payload;
        },
        removeManagerError: (state, action) => {
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllManagers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllManagers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.error = null;
                state.isSuccess = true;
                state.managers = action.payload.managers;
                state.message = action.payload.message;
                state.count = action.payload.count;
            })
            .addCase(getAllManagers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload;
                state.isSuccess = false;
                state.managers = "";
                state.message = action.payload.message;
                state.count = null;
            })
            .addCase(updateManagerById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateManagerById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.error = null;
                state.isSuccess = true;
                state.managerData = action.payload.manager;
                state.message = action.payload.message;
                if(state.isSuccess){
                    toast.success(state.message);
                }
            })
            .addCase(updateManagerById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload;
                state.isSuccess = false;
                state.managerData = "";
                state.message = action.payload.message;
                if(state.isError){
                    toast.success(state.message);
                }
            });
    }
});

export const { addManagerError, removeManagerError } = managerSlice.actions;

export default managerSlice.reducer;