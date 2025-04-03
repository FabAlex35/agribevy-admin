"use client";
import { addUserSubDetail, getPlanAPI, getUserSubDetail, updateUserSubDetail } from "@/src/Components/Api";
import Loader from "@/src/Components/Loader";
import Spinner from "@/src/Components/Spinner";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCircleCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";

const Users = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shopData, setShopData] = useState(null);
    const [plan, setPlan] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null);
    const [subMode,setSubMode] = useState(null)
    const [spin, setSpin] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const fetchSubscriptionData = async () => {
        try {
            setLoading(true);
    
            // Run both API calls in parallel
            const [shopResponse, planResponse] = await Promise.all([
                getUserSubDetail(),
                getPlanAPI()
            ]);
    
            let errorMessage = ""; // Store error messages
    
            // Set Shop Data
            if (shopResponse?.status === 200) {
                setShopData(shopResponse?.data);
            } else {
                errorMessage += shopResponse?.message || "Failed to fetch shop details. ";
            }
    
            // Set Plan Data
            if (planResponse?.status === 200) {
                setPlan(planResponse?.data);
            } else {
                errorMessage += planResponse?.message || "Failed to fetch plans.";
            }
    
            if (errorMessage) {
                setErrMsg(errorMessage.trim());
                setTimeout(() => setErrMsg(null), 2000);
            }
    
        } catch (error) {
            setErrMsg("Server error. Please try again.");
            setTimeout(() => setErrMsg(null), 2000);
        } finally {
            setLoading(false); 
        }
    };
    

    const filteredData = shopData?.filter((item) =>
        item.shop_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.market?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Open Modal for Activation
    const activateMarketer = (id,status) => {
        setSelectedUser(id);
        setSubMode(status == "Inactive" ? true : false)
        setIsModalOpen(true);
        reset(); 
    };

    // Handle Form Submission
    const onSubmit = async(data) => {
        setSpin(true)
        const allData = {
            ...data,
            id: selectedUser
        }
        
        if(subMode){
            const response = await updateUserSubDetail(allData)
            if (response?.status === 200) {
                setSuccessMsg(response?.message);
                setSpin(false);
                setTimeout(() => {
                    setSuccessMsg(null);
                    fetchSubscriptionData()
                    setIsModalOpen(false)
                }, 2000);
            } else {
                setErrMsg(response?.message);
                setSpin(false);
                setTimeout(() => {
                    setErrMsg(null);
                    setIsModalOpen(false)
                }, 2000);
            }
        }else{
            const response = await addUserSubDetail(allData)
            if (response?.status === 200) {
                setSuccessMsg(response?.message);
                setSpin(false);
                setTimeout(() => {
                    setSuccessMsg(null);
                    fetchSubscriptionData()
                    setIsModalOpen(false)
                }, 2000);
            } else {
                setErrMsg(response?.message);
                setSpin(false);
                setTimeout(() => {
                    setErrMsg(null);
                    setIsModalOpen(false)
                }, 2000);
            }
        }
    };

    useEffect(() => {
        fetchSubscriptionData()
    }, []);

    return (
        <div className="app-container">
            {loading ? <Loader /> : <>
                <div className="head pt-2 text-center mb-4">
                <h2 className="primary-color">User Management</h2>
            </div>

            <div className="d-flex justify-content-end mt-3">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="table-container mt-3">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Shop Name</th>
                            <th>Market</th>
                            <th>Joined Date</th>
                            <th>Subscription Plan</th>
                            <th>Status</th>
                            <th>Date of Expiry</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData?.map((shop) => (
                            <tr key={shop.id}>
                                <td>{shop.shop_name}</td>
                                <td>{shop.market}</td>
                                <td>{shop.joined_date ? shop.joined_date.split("T")[0] : "N/A"}</td>
                                <td>{shop.subscription_plan}</td>
                                <td className={`${shop.status === "Inactive" || shop.status === "Not Subscribed" ? "text-danger fw-bold" : "text-success fw-bold"}`}>
                                    {shop.status}
                                </td>
                                <td>{shop.expiry_date}</td>
                                <td>
                                    <button
                                        className="submit-btn requirement-btn py-2"
                                        onClick={() => activateMarketer(shop.id,shop.status)}
                                        disabled={shop.status === "Active"}
                                    >
                                        Activate
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedUser && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Activate a Marketer</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setIsModalOpen(false)}
                                ></button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="modal-body">
                                    <div className="d-flex gap-2">
                                        <p className="mb-3 fw-bold">
                                            <span className="text-success">Shop Name:</span> {selectedUser?.shop_name}
                                        </p>
                                        <p className="mb-3 fw-bold">
                                            <span className="text-success">Market:</span> {selectedUser?.market}
                                        </p>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Subscription Plan</label>
                                        <select
                                            className="form-control payment-input"
                                            {...register("subscription_id", {
                                                required: "Please select a subscription plan",
                                            })}
                                        >
                                            <option value="">Select a Plan</option>
                                            {plan && plan.map((list, index) => (
                                                <option key={index} value={list.subscription_id}>
                                                    {list.subscription_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.subscription_id && (
                                            <p className="text-danger mb-2">{errors.subscription_id.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>

                                    {/* <button type="submit" className="submit-btn requirement-btn py-2">
                                        Submit
                                    </button> */}
                                    <button type="submit" className="submit-btn requirement-btn py-2">{spin ? <Spinner /> : "Submit"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </> }

        <div className={successMsg === null ? "alert_net hide_net" : "alert_net show alert_suc_bg"}>
            <FaCircleCheck className='exclamation-circle' />
            <span className="msg">{successMsg}</span>
            <div className="close-btn close_suc">
                <IoClose className='close_mark' size={26} />
            </div>
        </div>

        <div className={errMsg === null ? "alert_net hide_net" : "alert_net show alert_war_bg"} >
            <RxCrossCircled className='exclamation-circle' />
            <span className="msg">{errMsg}</span>
            <div className="close-btn close_war">
                <IoClose className='close_mark' size={26} />
            </div>
        </div>
            
        </div>
    );
};

export default Users;
