import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jobTypeService } from "./jobTypeService";
import { apiErrorHandler } from "../../utils/apiErrorHandler";
import { toast } from "react-toastify";

const initialState = {
    jobTypes: null,
    jobTypeData: null,
    isloading: false,
    isError: false,
    isSuccess: false,
    error: null,
    message: "",
    deleted: false,
    count: null,
}

export const getAllJobTypes = createAsyncThunk(
    "jobType/getAllJobTypes",
    async (_data, {rejectWithValue}) => {
        try {
            return await jobTypeService.getAllJobTypes(_data);
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);
export const getJobTypes = createAsyncThunk(
    "jobType/getJobTypes",
    async (_, {rejectWithValue}) => {
        try {
            return await jobTypeService.getJobTypes();
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

export const updateJobTypeById = createAsyncThunk(
    "jobType/updatejobTypeById",
    async (jobTypeData, {rejectWithValue}) => {
        try {
            return await jobTypeService.updateJobTypeById(jobTypeData);
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

const jobTypeSlice = createSlice({
    name: 'jobType',
    initialState,
    reducers: {
        addJobTypeError: (state, action) => {
            state.error = action.payload;
        },
        removeJobTypeError: (state, action) => {
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllJobTypes.pending, (state) => {
                state.isLoading = true;
                state.deleted = false;
            })
            .addCase(getAllJobTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.jobTypes = action.payload.jobTypes;
                state.error = null;
                state.message = action.payload.message;
                state.count = action.payload.count;
            })
            .addCase(getAllJobTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.jobTypes = "";
                state.error = action.payload;
                state.message = action.payload.count;
            })
            .addCase(getJobTypes.pending, (state) => {
                state.isLoading = true;
                state.deleted = false;
            })
            .addCase(getJobTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.jobTypes = action.payload.jobTypes;
                state.error = null;
                state.message = action.payload.message;
                state.count = action.payload.count;
            })
            .addCase(getJobTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.jobTypes = "";
                state.error = action.payload;
                state.message = action.payload.count;
            })
            .addCase(updateJobTypeById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateJobTypeById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.jobTypeData = action.payload.jobType;
                state.error = null;
                state.message = action.payload.message;
                if(state.isSuccess) {
                    toast.info(state.message);
                }
            })
            .addCase(updateJobTypeById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.jobTypeData = "";
                state.error = action.payload;
                state.message = action.payload.message;
                if(state.isError){
                    toast.warning(state.message);
                }
            });
    }
});

export const { addJobTypeError, removeJobTypeError } = jobTypeSlice.actions;

export default jobTypeSlice.reducer;