import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cityService } from "./cityService";
import { apiErrorHandler } from "../../utils/apiErrorHandler";
import { toast } from "react-toastify";

const initialState = {
    cities: null,
    cityData: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
    error: null,
    deleted: false,
    count: null,
}

export const getCitiesFromServer = createAsyncThunk(
    "city/getCitiesFromServer",
    async (_data, thunkAPI) => {
        try{
            const result = await cityService.getCities(_data);
            return result;
        }catch(err){
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const getAllCities = createAsyncThunk(
    "city/getAllCities",
    async (_, thunkAPI) => {
        try{
            const result = await cityService.getAllCities();
            return result;
        }catch(err){
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const getCityById = createAsyncThunk(
    "city/getCityById",
    async (cityData, {rejectWithValue}) => {
        try{
            return cityService.getCityById(cityData);
        }catch(err){
            return rejectWithValue(apiErrorHandler(err));
        }
    }
);

export const updateCityById = createAsyncThunk(
    "city/updateCityById",
    async (cityData, { rejectWithValue }) => {
        try{
            return await cityService.updateCityById(cityData);
        }catch(err){
            return rejectWithValue(apiErrorHandler(err));
        }
    }
);

export const addCity = createAsyncThunk(
    "city/addCity",
    async (cityData, { rejectWithValue }) => {
        try{
            return await cityService.addCityToServer(cityData);
        }catch(err){
            return rejectWithValue(apiErrorHandler(err));
        }
    }
);

export const deleteCity = createAsyncThunk(
    "city/deleteCity",
    async (cityData, {rejectWithValue}) => {
        try{
            return await cityService.deleteCity(cityData);
        }catch(err){
            return rejectWithValue(apiErrorHandler(err));
        }
    }
)

const citySlice = createSlice({
    name: "city",
    initialState,
    reducers: {
        addError: (state, action) => {
            state.error = action.payload;
        },
        removeError: (state, action) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCitiesFromServer.pending, (state)=> {
                state.isLoading = true;
                state.deleted = false;
            })
            .addCase(getCitiesFromServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cities = action.payload.cities;
                state.isError = false;
                state.isSuccess = true;
                state.message = action.payload.message;
                state.count = action.payload.count;
                // if(state.message) {
                //     toast.info(state.message);
                // }
            })
            .addCase(getCitiesFromServer.rejected, (state, action) => {
                state.isLoading = false;
                state.cities = "";
                state.isSuccess = false;
                state.message = action.payload;
                state.error = action.payload;
                state.isError = true;
            })
            .addCase(getAllCities.pending, (state)=> {
                state.isLoading = true;
                state.deleted = false;
            })
            .addCase(getAllCities.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cities = action.payload.cities;
                state.isError = false;
                state.isSuccess = true;
                state.message = action.payload.message;
                state.count = action.payload.count;
                // if(state.message) {
                //     toast.info(state.message);
                // }
            })
            .addCase(getAllCities.rejected, (state, action) => {
                state.isLoading = false;
                state.cities = "";
                state.isSuccess = false;
                state.message = action.payload;
                state.error = action.payload;
                state.isError = true;
            })
            .addCase(getCityById.pending, (state)=> {
                state.isLoading = true;
            })
            .addCase(getCityById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cityData = action.payload.city;
                state.isError = false;
                state.isSuccess = true;
                if(state.isSuccess === true) {
                    // toast.info("City Data Loaded!!");
                }
            })
            .addCase(getCityById.rejected, (state, action) => {
                state.isLoading = false;
                state.cityData = "";
                state.isSuccess = false;
                state.message = action.payload;
                state.error = action.payload;
                state.isError = true;
            })
            .addCase(updateCityById.pending, (state)=> {
                state.isLoading = true;
            })
            .addCase(updateCityById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cityData = action.payload.city;
                state.isError = false;
                state.isSuccess = true;
                state.message = action.payload.message;
                state.error = null;
                if(state.isSuccess) {
                    toast.info(state.message);
                }
            })
            .addCase(updateCityById.rejected, (state, action) => {
                state.isLoading = false;
                state.cityData = "";
                state.isSuccess = false;
                state.message = action.payload.message;
                state.error = action.payload;
                state.isError = true;
                if(state.isError){
                    toast.warning(state.message);
                }
            })
            .addCase(addCity.pending, (state)=> {
                state.isLoading = true;
                state.cityData = null;
            })
            .addCase(addCity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cityData = action.payload.city;
                state.isError = false;
                state.isSuccess = true;
                state.message = action.payload.message;
                state.error = null;
                if(state.isSuccess) {
                    toast.info(state.message);
                }
            })
            .addCase(addCity.rejected, (state, action) => {
                state.isLoading = false;
                state.cityData = "";
                state.isSuccess = false;
                state.message = action.payload.message;
                state.error = action.payload;
                state.isError = true;
                if(state.isError){
                    toast.warning(state.message);
                }
            })
            .addCase(deleteCity.pending, (state)=> {
                state.isLoading = true;
            })
            .addCase(deleteCity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cityData = "";
                state.isError = false;
                state.isSuccess = true;
                state.message = action.payload.message;
                state.error = null;
                if(state.isSuccess) {
                    toast.info(state.message);
                }
                state.deleted = true;
            })
            .addCase(deleteCity.rejected, (state, action) => {
                state.isLoading = false;
                state.cityData = "";
                state.isSuccess = false;
                state.message = action.payload.message;
                state.error = action.payload;
                state.isError = true;
                if(state.isError){
                    toast.warning(state.message);
                }
            });
    }
});

export const { addError, removeError } = citySlice.actions;

export default citySlice.reducer;