import axios from "axios";
import { getAuthToken } from "../../utils/auth";
import { BASE_URL } from "../../utils/apiConfig";


const getAllCasualJobs = async ({page, limit}) => {
    if(!page && !limit) {
        page = 1;
        limit = 5;
    }
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}admin/casual-job/all-casual-jobs?page=${page}&&limit=${limit}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    return response.data;
}

const getCasualJobById = async (casualJobId) => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}admin/casual-job/${casualJobId}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    return response.data;
}

const storeCasualJobToServer = async (casualJobData) => {
    const token = getAuthToken();
    const response = await axios.post(`${BASE_URL}admin/casual-job/store`, casualJobData, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    return response.data;
}

const updateCasualJobById = async (casualJobData) => {
    const token = getAuthToken();
    const response = await axios.put(`${BASE_URL}admin/casual-job/update`, casualJobData, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    return response.data;
}

const softDeleteCasualJobById = async (casualJobId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${BASE_URL}admin/casual-job/${casualJobId}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    return response.data;
}

const permanentlyDeleteCasualJobById = async (casualJobId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${BASE_URL}admin/casual-job/permanently-delete/${casualJobId}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    return response.data;
}

export const casualJobService = {
    getAllCasualJobs,
    getCasualJobById,
    storeCasualJobToServer,
    updateCasualJobById,
    softDeleteCasualJobById,
    permanentlyDeleteCasualJobById
}