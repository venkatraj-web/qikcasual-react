import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { adminAuthService } from './adminAuthService';
import { toast } from 'react-toastify';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';

const initialState = {
    user: "",
    isError: false,
    isLoading: false,
    isSuccess: false,
    error: "",
    message: "",
    isLoggedIn: false,
}

export const adminLogin = createAsyncThunk(
    "adminAuth/Login",
    async (adminData, {rejectWithValue}) => {
        try{
            return await adminAuthService.adminLogin(adminData);
        } catch (error) {
            return rejectWithValue(apiErrorHandler(error));
        }
    }
);

export const getAdminProfile = createAsyncThunk(
    "adminAuth/adminProfile",
    async (_, { rejectWithValue }) => {
        try{
            return await adminAuthService.adminProfile();
        }catch(error){
            return rejectWithValue(apiErrorHandler(error));
        }
    }
);

export const adminForgotPassword = createAsyncThunk(
    "adminAuth/adminForgotPassword",
    async (adminData, {rejectWithValue}) => {
      try {
        return await adminAuthService.adminForgotPassword(adminData);
      } catch (error) {
        return rejectWithValue(apiErrorHandler(error));
      }
    }
);

// ==================Manager Auth=============

export const managerLogin = createAsyncThunk(
    "managerAuth/managerLogin",
    async (managerData, {rejectWithValue}) => {
        try{
            return await adminAuthService.managerLogin(managerData);
        } catch (error) {
            return rejectWithValue(apiErrorHandler(error));
        }
    }
);

export const getManagerProfile = createAsyncThunk(
    "managerAuth/getManagerProfile",
    async (_, { rejectWithValue }) => {
        try{
            return await adminAuthService.managerProfile();
        }catch(error){
            return rejectWithValue(apiErrorHandler(error));
        }
    }
);

export const managerForgotPassword = createAsyncThunk(
    "managerAuth/managerForgotPassword",
    async (managerData, {rejectWithValue}) => {
      try {
        return await adminAuthService.managerForgotPassword(managerData);
      } catch (error) {
        return rejectWithValue(apiErrorHandler(error));
      }
    }
);

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        addAdminError: (state, action) => {
            state.error = action.payload;
        },
        removeAdminError: (state, action) => {
            state.error = '';
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.isError = false;
                state.isSuccess = true;
                state.isLoggedIn = true;
                state.user = action.payload;
                state.message = action.payload.message;
                if(state.isSuccess){
                    toast.info(state.message);
                }

                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('role', action.payload.role);
                const expiration = new Date();
                expiration.setHours(expiration.getHours() + 1);
                localStorage.setItem('expiration', expiration.toISOString())
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isError = true;
                state.isSuccess = false;
                state.isLoggedIn = false;
                state.user = '';
                state.message = action.payload.message;
                // console.log(action.payload);
                if(state.message){
                    toast.warn(state.message);
                }
            })
            .addCase(adminForgotPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(adminForgotPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.isError = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.message = action.payload.message;
                if(state.isSuccess){
                    toast.info(state.message);
                }
            })
            .addCase(adminForgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isError = true;
                state.isSuccess = false;
                state.isLoggedIn = false;
                state.user = '';
                state.message = action.payload.message;
                // console.log(action.payload);
                if(state.message){
                    toast.warn(state.message);
                }
            })
            .addCase(getAdminProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAdminProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = false;
                state.isSuccess = true;
                state.user = action.payload
            })
            .addCase(getAdminProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.error;
                state.isSuccess = false;
                state.user = '';
            })
            .addCase(managerLogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(managerLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.isError = false;
                state.isSuccess = true;
                state.isLoggedIn = true;
                state.user = action.payload;
                state.message = action.payload.message;
                if(state.isSuccess){
                    toast.info(state.message);
                }

                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('role', action.payload.role);
                const expiration = new Date();
                expiration.setHours(expiration.getHours() + 1);
                localStorage.setItem('expiration', expiration.toISOString())
            })
            .addCase(managerLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isError = true;
                state.isSuccess = false;
                state.isLoggedIn = false;
                state.user = '';
                state.message = action.payload.message;
                // console.log(action.payload);
                if(state.message){
                    toast.warn(state.message);
                }
            })
            .addCase(managerForgotPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(managerForgotPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.isError = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.message = action.payload.message;
                if(state.isSuccess){
                    toast.info(state.message);
                }
            })
            .addCase(managerForgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isError = true;
                state.isSuccess = false;
                state.isLoggedIn = false;
                state.user = '';
                state.message = action.payload.message;
                // console.log(action.payload);
                if(state.message){
                    toast.warn(state.message);
                }
            })
            .addCase(getManagerProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getManagerProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = false;
                state.isSuccess = true;
                state.user = action.payload
            })
            .addCase(getManagerProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.error;
                state.isSuccess = false;
                state.user = '';
            });
    }
});

export const { addAdminError, removeAdminError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;