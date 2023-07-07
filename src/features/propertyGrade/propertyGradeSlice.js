import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiErrorHandler } from "../../utils/apiErrorHandler";
import { propertyGradeService } from "./propertyGradeService";
import { toast } from "react-toastify";


const initialState = {
    propertyGrades: null,
    propertyGradeData: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
    message: "",
    count: null,
}

export const getAllPropertGrades = createAsyncThunk(
    "propertyGrade/getAllPropertGrades",
    async (_data, {rejectWithValue}) => {
        try {
            return await propertyGradeService.getAllPropertyGrades(_data);
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

export const getAllPropertGradesByPropertyTypeId = createAsyncThunk(
    "propertyGrade/getAllPropertGradesByPropertyTypeId",
    async (propertyTypeId, {rejectWithValue}) => {
        try {
            return await propertyGradeService.getAllPropertyGradesByPropertyTypeId(propertyTypeId);
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

export const updatePropertGradeById = createAsyncThunk(
    "propertyGrade/updatePropertGradeById",
    async (propertGradeData, {rejectWithValue}) => {
        try {
            return await propertyGradeService.updatePropertyGrade(propertGradeData);
        } catch (e) {
            return rejectWithValue(apiErrorHandler(e));
        }
    }
);

const propertyGradeSlice = createSlice({
    name: "propertyGrade",
    initialState,
    reducers:{
        addPropertyGradeError: (state, action) => {
            state.error = action.payload;
        },
        removePropertyGradeError: (state, action) => {
            state.error = "";
        },
        removePropertyGrades: (state, action) => {
            state.propertyGrades = null;
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(getAllPropertGrades.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getAllPropertGrades.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.propertyGrades = action.payload.property_grades;
          state.error = null;
          state.message = action.payload.message;
          state.count = action.payload.count;
        })
        .addCase(getAllPropertGrades.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.propertyGrades = "";
          state.error = action.payload;
          state.message = action.payload.message;
        })
        .addCase(getAllPropertGradesByPropertyTypeId.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getAllPropertGradesByPropertyTypeId.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.propertyGrades = action.payload.property_grades;
          state.error = null;
          state.message = action.payload.message;
        })
        .addCase(getAllPropertGradesByPropertyTypeId.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.propertyGrades = "";
          state.error = action.payload;
          state.message = action.payload;
        })
        .addCase(updatePropertGradeById.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updatePropertGradeById.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.propertyGradeData = action.payload.property_grade;
          state.error = null;
          state.message = action.payload.message;
          if(state.isSuccess) {
              toast.info(state.message);
          }
        })
        .addCase(updatePropertGradeById.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.propertyGradeData = "";
          state.error = action.payload;
          state.message = action.payload;
          if(state.isError){
              toast.warning(state.message);
          }
        });
    }
});


export const { addPropertyGradeError, removePropertyGradeError, removePropertyGrades } = propertyGradeSlice.actions;

export default propertyGradeSlice.reducer;