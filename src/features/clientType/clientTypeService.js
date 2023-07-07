import axios from "axios";
import { getAuthToken } from "../../utils/auth"
import { BASE_URL } from "../../utils/apiConfig";


const getClientTypesFromServer = async ({page, limit}) => {
    if(!page && !limit) {
        page = 1;
        limit = 5;
    }
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/client-type/all-client-types?page=${page}&&limit=${limit}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const getClientTypes = async () => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/client-type/all`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const getClientTypeById = async (dataId) => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/client-type/${dataId}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const addClientTypeToServer = async (data) => {
    const token = getAuthToken();
    const response = await axios.post(`${BASE_URL}private-user/client-type/store`, data, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const deleteClientType = async (dataId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${BASE_URL}private-user/client-type/${dataId}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const updateClientType = async (data) => {
    const token = getAuthToken();
    const response = await axios.put(`${BASE_URL}private-user/client-type/update`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
     return response.data;
}

export const clientTypeService = {
    getClientTypesFromServer,
    getClientTypes,
    addClientTypeToServer,
    deleteClientType,
    updateClientType,
    getClientTypeById
}