import axios from "axios"
import apiClient from "../app/lib/Interceptor";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export const loginAdminAPI = async (payload) => {
    try {
        const res = await axios.post(`${baseUrl}/api/auth/login`, payload);
        return res?.data;
    } catch (err) {
        return err?.response.data;
    }
}

export const logoutAdminAPI = async () => {
    try {
        const res = await axios.post(`${baseUrl}/api/auth/logout`);
        return res?.data;
    } catch (err) {
        return err?.response.data;
    }
}

// refresh both tokens 
export const refreshBoth = async () => {
    try {
        const res = await axios.post(`${baseUrl}/api/auth/refresh`);      
        return res?.data;
    } catch (err) {        
        return err?.response.data;
    }
}

export const fetchAdminAPI = async () => {
    try {
        const res = await apiClient.get(`${baseUrl}/api/user`);
        return res?.data;
    } catch (err) {
        return err?.response.data;
    }
}

//1
export const getDashboard = async () => {
    try {
        const res = await apiClient.get(`${baseUrl}/api/dashboard`);
        return res?.data;
    } catch (err) {
        return err?.response.data;
    }
}

// user subscriptions all api 
//1 
export const getUserSubDetail = async () => {
    try {
        const res = await apiClient.get(`${baseUrl}/api/subscriptions/user`);
        return res?.data;
    } catch (err) {
        return err?.response.data;
    }
}

// 2
export const addUserSubDetail = async (payload) => {
    try {
        const res = await apiClient.post(`${baseUrl}/api/subscriptions/user`,payload);
        return res?.data;
    } catch (err) {
        return err?.response.data;
    }
}

//3
export const updateUserSubDetail = async (payload) => {
    try {
        const res = await apiClient.put(`${baseUrl}/api/subscriptions/user`,payload);
        return res?.data;
    } catch (err) {
        return err?.response.data;
    }
}

export const addVegetableAPI = async (payload) => {
    try {
        const res = await apiClient.post(`${baseUrl}/api/allvegetables`,payload);
        return res?.data;
    } catch (err) {
        return err?.response.data;
    }
}

export const getVegetableAPI = async () => {
    try {
        const res = await apiClient.get(`${baseUrl}/api/allvegetables`);
        return res?.data;
    } catch (err) {
        return err?.response.data;
    }
}

export const editVegetableAPI = async (payload) => {
    try {
        const res = await apiClient.put(`${baseUrl}/api/allvegetables`,payload);
        return res?.data;
    } catch (err) {
        return err?.response.data;
    }
}


export const addPlanAPI = async (payload) => {
    try {
        const res = await apiClient.post(`${baseUrl}/api/subscriptions`,payload);
        return res?.data;
    } catch (err) {
        return err?.response.data;
    }
}

export const getPlanAPI = async () => {
    try {
        const res = await apiClient.get(`${baseUrl}/api/subscriptions`);
        return res?.data;
    } catch (err) {
        return err?.response.data;
    }
}

