import axios from "axios";
import { getAuthToken } from "../../utils/auth"
import { BASE_URL } from "../../utils/apiConfig";

const getAllPropertyGradesByPropertyTypeId = async (typeId) => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}private-user/property-grade/all-property-grades-by-property-type-id/${typeId}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });
    return response.data;
}

const getAllPropertyGrades = async ({page, limit}) => {
    if(!page && !limit) {
        page = 1;
        limit = 5;
    }
    const token = getAuthToken();

    const response = await axios.get(`${BASE_URL}private-user/property-grade/all?page=${page}&&limit=${limit}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });
    return response.data;
}

const deletePropertyGrade = async (gradeId) => {
    const token = getAuthToken();

    const response = await axios.delete(`${BASE_URL}private-user/property-grade/${gradeId}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });
    return response.data;
}

const getPropertGradeById = async (gradeId) => {
    const token = getAuthToken();

    const response = await axios.get(`${BASE_URL}private-user/property-grade/${gradeId}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });
    return response.data;
}

const addPropertyGradeToServer = async (gradeData) => {
    const token = getAuthToken();

    const response = await axios.post(`${BASE_URL}private-user/property-grade/store`, gradeData, {
        headers: {
            Authorization: "Bearer " + token
        }
    });
    return response.data;
}

const updatePropertyGrade = async (gradeData) => {
    const token = getAuthToken();

    const response = await axios.put(`${BASE_URL}private-user/property-grade/update`, gradeData, {
        headers: {
            Authorization: "Bearer " + token
        }
    });
    return response.data;
}

export const propertyGradeService = {
    getAllPropertyGradesByPropertyTypeId,
    getAllPropertyGrades,
    deletePropertyGrade,
    getPropertGradeById,
    addPropertyGradeToServer,
    updatePropertyGrade
};