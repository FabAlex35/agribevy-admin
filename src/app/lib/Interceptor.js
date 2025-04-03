import axios from "axios";
import { logoutAdminAPI, refreshBoth } from "@/src/Components/Api";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const apiClient = axios.create({
    baseURL: baseUrl,
    withCredentials: true, // Ensure cookies are sent
});

// Track ongoing refresh requests
let isRefreshing = false;
let refreshSubscribers = [];

// Add subscribers (pending requests waiting for token)
const addSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// Notify all subscribers with new token
const onRefreshed = (token) => {
    refreshSubscribers.forEach((callback) => {
        if (token) {
            callback(token);
        } else {
            callback(null); // Reject queued requests if refresh fails
        }
    });
    refreshSubscribers = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            const errorMessage = error.response.data.message;

            if (errorMessage === "Refresh") {                
                if (!isRefreshing) {
                    isRefreshing = true;

                    try {
                        const refreshResponse = await refreshBoth(); 
                        console.log(refreshResponse);
                        
                        if (refreshResponse?.data?.access) {
                            const newToken = refreshResponse.data.access;

                            onRefreshed(newToken); // Notify all pending requests
                            isRefreshing = false;

                            // Retry the original request with new token
                            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                            return apiClient(originalRequest);
                        }
                    } catch (refreshError) {
                        console.error("❌ Token refresh failed:", refreshError);
                        onRefreshed(null); // Notify subscribers that refresh failed
                    }

                    isRefreshing = false;
                }

                return new Promise((resolve, reject) => {
                    addSubscriber((token) => {
                        if (token) {
                            originalRequest.headers["Authorization"] = `Bearer ${token}`;
                            resolve(apiClient(originalRequest)); // Retry request
                        } else {
                            reject(error); // Reject if refresh fails
                        }
                    });
                });
            }

            if (errorMessage === "Session Expired") {
                await logoutAdminAPI();

                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
