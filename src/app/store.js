import { configureStore } from '@reduxjs/toolkit'
import cityReducer from '../features/city/citySlice';
import adminStyleReducer from '../features/adminStyle/adminStyleSlice';
import adminAuthReducer from '../features/admin/auth/adminAuthSlice';
import privateUserReducer from '../features/privateUser/privateUserSlice';
import casualsReducer from '../features/casuals/casualsSlice';
import clientTypeReducer from '../features/clientType/clientTypeSlice';
import propertyTypeReducer from "../features/propertyType/propertyTypeSlice";
import propertyGradeReducer from "../features/propertyGrade/propertyGradeSlice";
import clientReducer from "../features/clients/clientSlice";
import jobTypeReducer from "../features/jobType/jobTypeSlice";
import propertyReducer from "../features/property/propertySlice";
import managerReducer from "../features/managers/managerSlice";
import casualJobReducer from "../features/casualJob/casualJobSlice";

const store = configureStore({
    reducer: {
        city: cityReducer,
        adminStyle: adminStyleReducer,
        adminAuth: adminAuthReducer,
        privateUser: privateUserReducer,
        casuals: casualsReducer,
        clientType: clientTypeReducer,
        property: propertyReducer,
        propertyType: propertyTypeReducer,
        propertyGrade: propertyGradeReducer,
        client: clientReducer,
        jobType: jobTypeReducer,
        manager: managerReducer,
        casualJob: casualJobReducer,
    },
});

export default store;