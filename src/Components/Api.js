import axios from "axios"
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export const loginAdminAPI = async (payload) => {
    try {
        const res = await axios.post(`${baseUrl}/api/auth/login`, payload);
        return res?.data;
    } catch (err) {
        console.log(err);
        
        return err?.response.data;
    }
}


export const logoutAdminAPI = async () => {
    try {
        const res = await axios.post(`${baseUrl}/api/auth/logout`);
        return res?.data;
    } catch (err) {
        console.log(err);
        
        return err?.response.data;
    }
}

export const fetchAdminAPI = async () => {
    try {
        const res = await axios.get(`${baseUrl}/api/admin/user`);
        return res?.data;
    } catch (err) {
        console.log(err);
        
        return err?.response.data;
    }
}

//1
export const getDashboard = async () => {
    try {
        const res = await axios.get(`${baseUrl}/api/dashboard`);
        return res?.data;
    } catch (err) {
        console.log(err);
        
        return err?.response.data;
    }
}

//2 
export const getUserSubDetail = async () => {
    try {
        const res = await axios.get(`${baseUrl}/api/user`);
        return res?.data;
    } catch (err) {
        console.log(err);
        
        return err?.response.data;
    }
}

export const addVegetableAPI = async (payload) => {
    try {
        const res = await axios.post(`${baseUrl}/api/admin/allvegetables`,payload);
        return res?.data;
    } catch (err) {
        console.log(err);
        
        return err?.response.data;
    }
}

export const getVegetableAPI = async () => {
    try {
        const res = await axios.get(`${baseUrl}/api/admin/allvegetables`);
        return res?.data;
    } catch (err) {
        console.log(err);
        
        return err?.response.data;
    }
}

export const editVegetableAPI = async (payload) => {
    try {
        const res = await axios.put(`${baseUrl}/api/admin/allvegetables`,payload);
        return res?.data;
    } catch (err) {
        console.log(err);
        
        return err?.response.data;
    }
}


export const deleteVegetableAPI = async (id) => {
    try {
        const res = await axios.delete(`${baseUrl}/api/admin/allvegetables/${id}`);
        return res?.data;
    } catch (err) {
        console.log(err);
        
        return err?.response.data;
    }
}

export const addPlanAPI = async (payload) => {
    try {
        const res = await axios.post(`${baseUrl}/api/admin/subscriptions`,payload);
        return res?.data;
    } catch (err) {
        console.log(err);
        
        return err?.response.data;
    }
}

export const getPlanAPI = async () => {
    try {
        const res = await axios.get(`${baseUrl}/api/admin/subscriptions`);
        return res?.data;
    } catch (err) {
        console.log(err);
        
        return err?.response.data;
    }
}

