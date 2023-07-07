import axios from "axios"
import { BASE_URL } from "../../utils/apiConfig"
import { getAuthToken } from "../../utils/auth"

const getPrivatUsers = async () => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/all-private-users`, {
        headers:{
            Authorization: 'Bearer ' + token
        }
    });

    if(response.data){
        return response.data;
    }
}

const getPrivatUsersByRole = async ({role, page, limit}) => {
    if(!page && !limit) {
        page = 1;
        limit = 5;
    }
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/roles/${role}?page=${page}&&limit=${limit}`, {
        headers:{
            Authorization: 'Bearer ' + token
        }
    });

    if(response.data){
        return response.data;
    }
}

const storePrivateUserToServer = async (userData) => {
    const token = getAuthToken();
    const response = await axios.post(`${BASE_URL}private-user/create`, userData, {
        headers: {
            Authorization : 'Bearer ' + token
        }
    });

    return response.data;
}

const deletePrivateUser = async (userId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${BASE_URL}private-user/permanently/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    return response.data;
}

const softDeletePrivateUser = async (userId) => {
    const token = getAuthToken();
    const response = await axios.delete(`${BASE_URL}private-user/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    return response.data;
}

const getPrivateUserById = async (userId) => {
    const token = getAuthToken();
    const response = await axios(`${BASE_URL}private-user/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
}

const updatePrivateUserById = async (userData) => {
    const token = getAuthToken();

    const response = await axios.put(`${BASE_URL}private-user/update`, userData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'multipart/form-data'
        }
    });
    return response.data;
}

const updatePrivateUserProfile = async (userData) => {
    const token = getAuthToken();

    const response = await axios.put(`${BASE_URL}private-user/profile-update`, userData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'multipart/form-data'
        }
    });
    return response.data;
}

export const privatUserService = {
    getPrivatUsers,
    storePrivateUserToServer,
    deletePrivateUser,
    getPrivateUserById,
    updatePrivateUserById,
    softDeletePrivateUser,
    getPrivatUsersByRole,
    updatePrivateUserProfile
}