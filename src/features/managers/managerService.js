import axios from "axios";
import { getAuthToken } from "../../utils/auth"
import { BASE_URL } from "../../utils/apiConfig";

const getAllManagersFromServer = async ({page, limit}) => {
    if(!page && !limit) {
        page = 1;
        limit = 5;
    }
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}admin/manager/all-managers?page=${page}&&limit=${limit}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    return response.data;
}

const getManagerById = async (managerId) => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}admin/manager/get/${managerId}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    return response.data;
}

const storeManageToServer = async (managerData) => {
    const token = getAuthToken();
    const response = await axios.post(`${BASE_URL}admin/manager/store`, managerData, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    return response.data;
}

const updateManagerById = async (managerData) => {
    const token = getAuthToken();
    const response = await axios.put(`${BASE_URL}admin/manager/update/${managerData.id}`, managerData, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    return response.data;
}

const softDeleteManagerById = async (managerId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${BASE_URL}admin/manager/delete/${managerId}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    return response.data;
}

const permanentlyDeleteManagerById = async (managerId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${BASE_URL}admin/manager/permanently-delete/${managerId}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    return response.data;
}

const updateManagerProfile = async (userData) => {
    const token = getAuthToken();

    const response = await axios.put(`${BASE_URL}manager/profile-update`, userData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'multipart/form-data'
        }
    });
    return response.data;
}



export const managerService = {
    getAllManagersFromServer,
    getManagerById,
    storeManageToServer,
    softDeleteManagerById,
    updateManagerById,
    permanentlyDeleteManagerById,
    updateManagerProfile
}