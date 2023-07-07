import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { propertyTypeService } from "./propertyTypeService";
import { apiErrorHandler } from "../../utils/apiErrorHandler";
import { toast } from "react-toastify";


const initialState = {
    propertyTypes: null,
    propertyTypeData: null,
    isloading: false,
    isError: false,
    isSuccess: false,
    error: null,
    message: "",
    deleted: false,
    count: null,
}


export const getAllPropertyTypes = createAsyncThunk(
    "propertyType/getAllPropertyTypes",
    async (_data, {rejectWithValue}) => {
        try {
            return await propertyTypeService.getAllPropertyTypes(_data);
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);
export const getPropertyTypes = createAsyncThunk(
    "propertyType/getPropertyTypes",
    async (_, {rejectWithValue}) => {
        try {
            return await propertyTypeService.getPropertyTypes();
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

export const updatePropertyTypeById = createAsyncThunk(
    "propertyType/updatePropertyTypeById",
    async (propertyTypeData, {rejectWithValue}) => {
        try {
            return await propertyTypeService.updatePropertyType(propertyTypeData);
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

const propertyTypeSlice = createSlice({
    name: 'propertyType',
    initialState,
    reducers: {
        addPropertyTypeError: (state, action) => {
            state.error = action.payload;
        },
        removePropertyTypeError: (state, action) => {
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPropertyTypes.pending, (state) => {
                state.isLoading = true;
                state.deleted = false;
            })
            .addCase(getAllPropertyTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.propertyTypes = action.payload.property_types;
                state.error = null;
                state.message = action.payload.message;
                state.count = action.payload.count;
            })
            .addCase(getAllPropertyTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.propertyTypes = "";
                state.error = action.payload;
                state.message = action.payload.message;
            })
            .addCase(getPropertyTypes.pending, (state) => {
                state.isLoading = true;
                state.deleted = false;
            })
            .addCase(getPropertyTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.propertyTypes = action.payload.property_types;
                state.error = null;
                state.message = action.payload.message;
                state.count = action.payload.count;
            })
            .addCase(getPropertyTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.propertyTypes = "";
                state.error = action.payload;
                state.message = action.payload.message;
            })
            .addCase(updatePropertyTypeById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updatePropertyTypeById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.propertyTypeData = action.payload.property_type;
                state.error = null;
                state.message = action.payload.message;
                if(state.isSuccess) {
                    toast.info(state.message);
                }
            })
            .addCase(updatePropertyTypeById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.propertyTypeData = "";
                state.error = action.payload;
                state.message = action.payload.message;
                if(state.isError){
                    toast.warning(state.message);
                }
            });
    }
});

export const { addPropertyTypeError, removePropertyTypeError } = propertyTypeSlice.actions;

export default propertyTypeSlice.reducer;