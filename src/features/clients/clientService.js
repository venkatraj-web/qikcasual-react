import axios from "axios";
import { getAuthToken } from "../../utils/auth"
import { BASE_URL } from "../../utils/apiConfig";


const getAllClients = async ({page, limit}) => {
    if(!page && !limit) {
        page = 1;
        limit = 5;
    }
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/client/all-clients?page=${page}&&limit=${limit}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const getAllClientsFromServer = async () => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/client/all`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const getClientBasedOnManager = async () => {
    const token = getAuthToken();
    console.log("running")
    const response = await axios.get(`${BASE_URL}manager/get-client-by-manager`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const addClientToServer = async (clientData) => {
    const token = getAuthToken();
    const response = await axios.post(`${BASE_URL}private-user/client/store`, clientData, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const getClientById = async (clientId) => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/client/${clientId}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const updateClientById = async (clientData) => {
    const token = getAuthToken();
    const response = await axios.put(`${BASE_URL}private-user/client/update`, clientData, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const deleteClientById = async (clientId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${BASE_URL}private-user/client/${clientId}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

export const clientService = {
    getAllClients,
    getClientById,
    updateClientById,
    deleteClientById,
    addClientToServer,
    getAllClientsFromServer,
    getClientBasedOnManager
}