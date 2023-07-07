import axios from "axios"
import { BASE_URL } from "../../utils/apiConfig"
import { getAuthToken } from "../../utils/auth"


const getCasuals = async ({page, limit}) =>{
    if(!page && !limit) {
        page = 1;
        limit = 5;
    }
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/casual/all-casuals?page=${page}&&limit=${limit}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    if(response.data){
        return response.data;
    }
}

const storeCasual = async (userData) => {
    const token = getAuthToken();
    const response = await axios.post(`${BASE_URL}private-user/casual/store`, userData, {
        headers: {
            Authorization: 'Bearer ' + token,
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
}

const getCasualById = async (casualId) => {
    const token = getAuthToken();

    const response = await axios.get(`${BASE_URL}private-user/casual/get/${casualId}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    return response.data;
}

const updateCasualById = async (userData) => {
    const token = getAuthToken();

    const response = await axios.put(`${BASE_URL}private-user/casual/update`, userData, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    return response.data;
}

const permanentlyDeleteCasualById = async (userId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${BASE_URL}private-user/casual/permanently/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    return response.data;
}

const softDeleteCasualById = async (userId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${BASE_URL}private-user/casual/delete/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    return response.data;
}

export const casualService = {
    getCasuals,
    storeCasual,
    getCasualById,
    updateCasualById,
    permanentlyDeleteCasualById,
    softDeleteCasualById
}