import axios from "axios";
import { getAuthToken } from "../../utils/auth"
import { BASE_URL } from "../../utils/apiConfig";


const getAllJobTypes = async ({page, limit}) => {
    if(!page && !limit) {
        page = 1;
        limit = 5;
    }
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}job-type/all-job-types?page=${page}&&limit=${limit}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}
const getJobTypes = async () => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}job-type/all`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const getJobTypeById = async (jobTypeId) => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}job-type/${jobTypeId}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const addJobTypeToServer = async (jobTypeData) => {
    const token = getAuthToken();
    const response = await axios.post(`${BASE_URL}job-type/store`, jobTypeData, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const updateJobTypeById = async (jobTypeData) => {
    const token = getAuthToken();
    const response = await axios.put(`${BASE_URL}job-type/update`, jobTypeData, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const deleteJobTypeById = async (jobTypeId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${BASE_URL}job-type/delete/${jobTypeId}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

const softDeleteJobTypeById = async (jobTypeId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${BASE_URL}job-type/soft-delete/${jobTypeId}`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response.data;
}

export const jobTypeService = {
    getAllJobTypes,
    getJobTypes,
    getJobTypeById,
    addJobTypeToServer,
    updateJobTypeById,
    deleteJobTypeById,
    softDeleteJobTypeById
}