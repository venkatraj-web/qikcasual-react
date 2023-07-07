import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clientService } from "./clientService";
import { apiErrorHandler } from "../../utils/apiErrorHandler";
import { toast } from "react-toastify";

const initialState = {
    clients: null,
    clientData: null,
    isloading: false,
    isError: false,
    isSuccess: false,
    error: null,
    message: "",
    deleted: false,
    count: null,
}

export const getAllClients = createAsyncThunk(
    "clients/getAllClients",
    async (_data,{rejectWithValue}) => {
        try {
            return await clientService.getAllClients(_data);
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

export const getAllClientsFromServer = createAsyncThunk(
    "clients/getAllClientsFromServer",
    async (_,{rejectWithValue}) => {
        try {
            return await clientService.getAllClientsFromServer();
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);
export const getClientBasedOnManager = createAsyncThunk(
    "clients/getClientBasedOnManager",
    async (_,{rejectWithValue}) => {
        try {
            return await clientService.getClientBasedOnManager();
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

export const updateClientById = createAsyncThunk(
    "clients/updateClientById",
    async (clientData, {rejectWithValue}) => {
        try {
            return await clientService.updateClientById(clientData);
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
)

const clientSlice = createSlice({
    name: "client",
    initialState,
    reducers: {
        addClientError: (state, action) => {
            state.error = action.payload;
        },
        removeClientError: (state, action) => {
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllClients.pending, (state) => {
                state.isLoading = true;
                state.deleted = false;
            })
            .addCase(getAllClients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.clients = action.payload.clients;
                state.error = null;
                state.message = action.payload.message;
                state.count = action.payload.count;
            })
            .addCase(getAllClients.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.clients = "";
                state.error = action.payload;
                state.message = action.payload.message;
            })
            .addCase(getAllClientsFromServer.pending, (state) => {
                state.isLoading = true;
                state.deleted = false;
            })
            .addCase(getAllClientsFromServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.clients = action.payload.clients;
                state.error = null;
                state.message = action.payload.message;
                state.count = action.payload.count;
            })
            .addCase(getAllClientsFromServer.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.clients = "";
                state.error = action.payload;
                state.message = action.payload.message;
            })
            .addCase(updateClientById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateClientById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.clientData = action.payload.client;
                state.error = null;
                state.message = action.payload.message;
                if(state.isSuccess) {
                    toast.info(state.message);
                }
            })
            .addCase(updateClientById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.clientData = "";
                state.error = action.payload;
                state.message = action.payload.message;
                if(state.isError){
                    toast.warning(state.message);
                }
            })
            .addCase(getClientBasedOnManager.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getClientBasedOnManager.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.clientData = action.payload.client;
                state.error = null;
                state.message = action.payload.message;
                if(state.isSuccess) {
                    toast.info(state.message);
                }
            })
            .addCase(getClientBasedOnManager.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.clientData = "";
                state.error = action.payload;
                state.message = action.payload.message;
                if(state.isError){
                    toast.warning(state.message);
                }
            });
    }
});


export const { addClientError, removeClientError } = clientSlice.actions;

export default clientSlice.reducer;