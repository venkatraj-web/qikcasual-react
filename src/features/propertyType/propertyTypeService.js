import axios from "axios";
import { getAuthToken } from "../../utils/auth"
import { BASE_URL } from "../../utils/apiConfig";


const getAllPropertyTypes = async ({page, limit}) => {
    if(!page && !limit) {
        page = 1;
        limit = 5;
    }
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/property-type/all-property-types?page=${page}&&limit=${limit}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    return response.data;
}
const getPropertyTypes = async () => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/property-type/all`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    return response.data;
}

const getPropertyTypeById = async (typeId) => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/property-type/${typeId}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    return response.data;
}

const addPropertyTypeToServer = async (typeData) => {
    const token = getAuthToken();
    const response = await axios.post(`${BASE_URL}private-user/property-type/store`, typeData, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    return response.data;
}

const updatePropertyType = async (typeData) => {
    const token = getAuthToken();
    const response = await axios.put(`${BASE_URL}private-user/property-type/update`, typeData, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    return response.data;
}

const deletePropertyTypeById = async (typeId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${BASE_URL}private-user/property-type/${typeId}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    return response.data;
}


export const propertyTypeService = {
    getAllPropertyTypes,
    getPropertyTypes,
    getPropertyTypeById,
    addPropertyTypeToServer,
    updatePropertyType,
    deletePropertyTypeById
}