import axios from "axios";
import { getAuthToken } from "../../utils/auth"
import { BASE_URL } from "../../utils/apiConfig";

const getAllProperties = async ({page, limit}) => {
    if(!page && !limit) {
        page = 1;
        limit = 5;
    }
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/property/all-properties?page=${page}&&limit=${limit}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    return response.data;
}

const getAllPropertiesByClientId = async (clientId) => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/property/get-properties-by-client-id/${clientId}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    return response.data;
}

const getPropertyById = async (propertyId) => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/property/${propertyId}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    return response.data;
}

const deletePropertyById = async (propertyId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${BASE_URL}private-user/property/${propertyId}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    return response.data;
}

const addPropertyToServer = async (propertyData) => {
    const token = getAuthToken();
    const response = await axios.post(`${BASE_URL}private-user/property/store`, propertyData, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    return response.data;
}

const updateProperty = async (propertyData) => {
    const token = getAuthToken();
    const response = await axios.put(`${BASE_URL}private-user/property/update`, propertyData, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    return response.data;
}


export const propertyService = {
    getAllProperties,
    getAllPropertiesByClientId,
    getPropertyById,
    deletePropertyById,
    addPropertyToServer,
    updateProperty
}