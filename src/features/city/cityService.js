import axios from "axios";
import { BASE_URL } from "../../utils/apiConfig";
import { getAuthToken } from "../../utils/auth";

// const options = {
//     method: 'GET',
//     headers: {
//        'Content-Type': 'application/json'
//     }
// };

const getCities = async ({page, limit}) => {
    if(!page && !limit) {
        page = 1;
        limit = 5;
    }
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}city/allCities?page=${page}&&limit=${limit}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    return response.data;
}

const getAllCities = async () => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}city/allCities`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    return response.data;
}

const getCityById = async (cityId) => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}city/${cityId}`, {
        headers: {
            Authorization : 'Bearer ' + token
        }
    });

    return response.data;
}

const updateCityById = async (cityData) => {
    const token = getAuthToken();
    const response = await axios.patch(`${BASE_URL}city/update/${cityData.id}`, cityData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
     return response.data;
}

const addCityToServer = async (cityData) => {
    const token = getAuthToken();

    const response = await axios.post(`${BASE_URL}city/store`, cityData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
}

const deleteCity = async (cityId) => {
    const token = getAuthToken();

    const response = await axios.delete(`${BASE_URL}city/${cityId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
}

export const cityService = {
    getCities,
    getAllCities,
    getCityById,
    updateCityById,
    addCityToServer,
    deleteCity
}