import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiErrorHandler } from "../../utils/apiErrorHandler";
import { clientTypeService } from "./clientTypeService";
import { toast } from "react-toastify";

const initialState = {
    clientTypes: null,
    clientTypeData: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
    error: null,
    deleted: false,
    count: null,
}

export const getClientTypesFromServer = createAsyncThunk(
    "clientType/getClientTypesFromServer",
    async (_data, {rejectWithValue}) => {
        try {
            return await clientTypeService.getClientTypesFromServer(_data);
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
)

export const getClientTypes = createAsyncThunk(
    "clientType/getClientTypes",
    async (_, {rejectWithValue}) => {
        try {
            return await clientTypeService.getClientTypes();
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
)

export const getClientTypeById = createAsyncThunk(
    "clientType/getClientTypeById",
    async (typeData, {rejectWithValue}) => {
        try{
            return clientTypeService.getClientTypeById(typeData);
        }catch(err){
            return rejectWithValue(apiErrorHandler(err));
        }
    }
)

export const updateClientTypeById = createAsyncThunk(
    "clientType/updateClientTypeById",
    async (typeData, {rejectWithValue}) => {
        try{
            return await clientTypeService.updateClientType(typeData);
        }catch(err){
            return rejectWithValue(apiErrorHandler(err));
        }
    }
)

export const addClientType = createAsyncThunk(
    "clientType/addClientType",
    async (typeData, {rejectWithValue}) => {
        try {
            return await clientTypeService.addClientTypeToServer(typeData);
        }catch(err){
            return rejectWithValue(apiErrorHandler(err));
        }
    }
)

const clientTypeSlice = createSlice({
    name: 'clientTypeSlice',
    initialState,
    reducers: {
        addClientTypeError: (state, action) => {
            state.error = action.payload;
        },
        removeClientTypeError: (state, action) => {
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getClientTypesFromServer.pending, (state) => {
                state.isLoading = true;
                state.deleted = false;
            })
            .addCase(getClientTypesFromServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.clientTypes = action.payload.client_types;
                state.isError = false;
                state.message = action.payload.message;
                state.error = "";
                state.count = action.payload.count;
            })
            .addCase(getClientTypesFromServer.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.clientTypes = "";
                state.isError = true;
                state.message = action.payload.message;
                state.error = action.payload;
            })
            .addCase(getClientTypes.pending, (state) => {
                state.isLoading = true;
                state.deleted = false;
            })
            .addCase(getClientTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.clientTypes = action.payload.client_types;
                state.isError = false;
                state.message = action.payload.message;
                state.error = "";
                state.count = action.payload.count;
            })
            .addCase(getClientTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.clientTypes = "";
                state.isError = true;
                state.message = action.payload.message;
                state.error = action.payload;
            })
            .addCase(getClientTypeById.pending, (state)=> {
                state.isLoading = true;
            })
            .addCase(getClientTypeById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clientTypeData = action.payload.client_type;
                state.isError = false;
                state.isSuccess = true;
                if(state.isSuccess === true) {
                    // toast.info("City Data Loaded!!");
                }
            })
            .addCase(getClientTypeById.rejected, (state, action) => {
                state.isLoading = false;
                state.clientTypeData = "";
                state.isSuccess = false;
                state.message = action.payload;
                state.error = action.payload;
                state.isError = true;
            })
            .addCase(addClientType.pending, (state)=> {
                state.isLoading = true;
                state.clientTypeData = null;
            })
            .addCase(addClientType.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clientTypeData = action.payload.client_type;
                state.isError = false;
                state.isSuccess = true;
                state.message = action.payload.message;
                state.error = null;
                if(state.isSuccess) {
                    toast.info(state.message);
                }
            })
            .addCase(addClientType.rejected, (state, action) => {
                state.isLoading = false;
                state.clientTypeData = "";
                state.isSuccess = false;
                state.message = action.payload.message;
                state.error = action.payload;
                state.isError = true;
                if(state.isError){
                    toast.warning(state.message);
                }
            })
            .addCase(updateClientTypeById.pending, (state)=> {
                state.isLoading = true;
            })
            .addCase(updateClientTypeById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clientTypeData = action.payload.client_type;
                state.isError = false;
                state.isSuccess = true;
                state.message = action.payload.message;
                state.error = null;
                if(state.isSuccess) {
                    toast.info(state.message);
                }
            })
            .addCase(updateClientTypeById.rejected, (state, action) => {
                state.isLoading = false;
                state.clientTypeData = "";
                state.isSuccess = false;
                state.message = action.payload.message;
                state.error = action.payload;
                state.isError = true;
                if(state.isError){
                    toast.warning(state.message);
                }
            })
    }
});

export const { addClientTypeError, removeClientTypeError } = clientTypeSlice.actions;

export default clientTypeSlice.reducer;



