import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiErrorHandler } from "../../utils/apiErrorHandler";
import { propertyService } from "./propertyService";
import { toast } from "react-toastify";

const initialState = {
    properties: null,
    propertyData: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    message: "",
    count: null,
}

export const getAllProperties = createAsyncThunk(
    "property/getAllProperties",
    async (_data, {rejectWithValue}) => {
        try{
            return await propertyService.getAllProperties(_data);
        } catch(e){
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

export const getAllPropertiesByClientId = createAsyncThunk(
    "property/getAllPropertiesByClientId",
    async (clientId, {rejectWithValue}) => {
        try{
            return await propertyService.getAllPropertiesByClientId(clientId);
        } catch(e){
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

export const updatePropertyById = createAsyncThunk(
    "property/updatePropertyById",
    async (propertyData, {rejectWithValue}) => {
        try{
            return await propertyService.updateProperty(propertyData);
        } catch(e){
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

const propertySlice = createSlice({
    name: 'property',
    initialState,
    reducers: {
        addPropertyError: (state, action) => {
            state.error = action.payload;
        },
        removePropertyError: (state, action) => {
            state.error = "";
        },
        removeProperties: (state, action) => {
            state.properties = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllProperties.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllProperties.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.error = null;
                state.isSuccess = true;
                state.properties = action.payload.properties;
                state.message = action.payload.message;
                state.count = action.payload.count;
            })
            .addCase(getAllProperties.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload;
                state.isSuccess = false;
                state.properties = "";
                state.message = action.payload.message;
            })
            .addCase(getAllPropertiesByClientId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllPropertiesByClientId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.error = null;
                state.isSuccess = true;
                state.properties = action.payload.properties;
                state.message = action.payload.message;
            })
            .addCase(getAllPropertiesByClientId.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload;
                state.isSuccess = false;
                state.properties = "";
                state.message = action.payload;
            })
            .addCase(updatePropertyById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updatePropertyById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.error = null;
                state.isSuccess = true;
                state.propertyData = action.payload.property;
                state.message = action.payload.message;
                if(state.isSuccess){
                    toast.success(state.message);
                }
            })
            .addCase(updatePropertyById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload;
                state.isSuccess = false;
                state.propertyData = "";
                state.message = action.payload.message;
                if(state.isError){
                    toast.success(state.message);
                }
            });
    }
});

export const { addPropertyError, removePropertyError, removeProperties } = propertySlice.actions;

export default propertySlice.reducer;