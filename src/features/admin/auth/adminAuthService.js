import { BASE_URL } from "../../../utils/apiConfig"
import { getAuthToken } from "../../../utils/auth";
import axios from 'axios'


const adminLogin = async (adminData) => {
    // const token = getAuthToken();
    // console.log(token);
    const response = await axios.post(`${BASE_URL}private-user/login`, adminData);
    if(response.data){
        return response.data;
    }
}

const adminProfile = async () => {
    const token = getAuthToken();
    const role = localStorage.getItem('role');
    // console.log("token");
    // console.log(token);
    let url = "";
    if(role === 'client-admin' || role === 'manager') {
        url = `${BASE_URL}manager/profile`;
    } else {
        url = `${BASE_URL}private-user/profile`;
    }
    const response = await axios.get(url, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    if(response.data){
        return response.data;
    }
}

const adminForgotPassword = async (adminData) => {
    const response = await axios.post(`${BASE_URL}private-user/forgot-password`, adminData);
    return response.data;
}

// ===========Manager Role ==============

const managerLogin = async (managerData) => {
    // const token = getAuthToken();
    // console.log(token);
    const response = await axios.post(`${BASE_URL}manager/login`, managerData);
    if(response.data){
        return response.data;
    }
}

const managerProfile = async () => {
    const token = getAuthToken();
    // console.log("token");
    // console.log(token);
    const response = await axios.get(`${BASE_URL}manager/profile`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    if(response.data){
        return response.data;
    }
}

const managerForgotPassword = async (managerData) => {
    const response = await axios.post(`${BASE_URL}manager/forgot-password`, managerData);
    return response.data;
}

export const adminAuthService = {
    adminLogin,
    adminProfile,
    adminForgotPassword,
    managerLogin,
    managerProfile,
    managerForgotPassword
}