"use client"

import { getDashboard } from '@/src/Components/Api';
import Loader from '@/src/Components/Loader';
import React, { useEffect, useState } from 'react';
import {
    FaUsers, FaUserCheck, FaStore, FaShoppingBasket,
    FaCalendarAlt, FaBox, FaExclamationCircle, FaCreditCard
} from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { RxCrossCircled } from 'react-icons/rx';

const AdminDashboard = () => {
    const [stats,setStats] = useState(null)
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState(null)

    const fetchDashboard = async() =>{
        const data = await getDashboard()
        if(data?.status === 200){
            setStats(data?.data)
            setTimeout(()=>{
                setLoading(false)
            },2000)
        }else {
            setErrMsg(response.message)
            setTimeout(() => {
                setErrMsg(null)
            }, 2000)
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchDashboard()
    },[])

    return (
        <div className='app-container  min-vh-90'>
            {loading ? <Loader /> : <>
            <div className="head pt-2 text-center mb-5">
                <h2 className="primary-color">Dashboard</h2>
            </div>
            <div className="admin-dashboard bg-light">
                {/* Main Stats */}
                <div className="row g-4 mb-4">
                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="card stat-card h-100">
                            <div className="card-body d-flex align-items-center">
                                <div className="icon-wrapper bg-primary">
                                    <FaUsers className="stat-icon" />
                                </div>
                                <div className="ms-3">
                                    <p className="card-subtitle mb-1">Total Marketers</p>
                                    <h3 className="card-title mb-0">{stats?.users?.totalMarketers}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="card stat-card h-100">
                            <div className="card-body d-flex align-items-center">
                                <div className="icon-wrapper bg-success">
                                    <FaUserCheck className="stat-icon" />
                                </div>
                                <div className="ms-3">
                                    <p className="card-subtitle mb-1">Active Marketers</p>
                                    <h3 className="card-title mb-0">{stats?.activeMarketers}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="card stat-card h-100">
                            <div className="card-body d-flex align-items-center">
                                <div className="icon-wrapper bg-warning">
                                    <FaStore className="stat-icon" />
                                </div>
                                <div className="ms-3">
                                    <p className="card-subtitle mb-1">Total Farmers</p>
                                    <h3 className="card-title mb-0">{stats?.users?.totalFarmers}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="card stat-card h-100">
                            <div className="card-body d-flex align-items-center">
                                <div className="icon-wrapper bg-info">
                                    <FaShoppingBasket className="stat-icon" />
                                </div>
                                <div className="ms-3">
                                    <p className="card-subtitle mb-1">Total Buyers</p>
                                    <h3 className="card-title mb-0">{stats?.users?.totalBuyers}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Markets and Vegetables Section */}
                <div className="row g-4 mb-4">
                    <div className="col-12 col-md-6">
                        <div className="card overview-card h-100">
                            <div className="card-header bg-white">
                                <h5 className="card-title mb-0">
                                    <FaStore className="me-2" />
                                    Markets Overview
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="overview-content bg-light p-4 rounded">
                                    <div className="d-flex align-items-center">
                                        <FaStore className="overview-icon text-primary" />
                                        <div className="ms-3">
                                            <p className="mb-1">Number of Markets</p>
                                            <h4 className="mb-0">{stats?.users?.totalMarketers}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="card overview-card h-100">
                            <div className="card-header bg-white">
                                <h5 className="card-title mb-0">
                                    <FaBox className="me-2" />
                                    Vegetables Overview
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="overview-content bg-light p-4 rounded">
                                    <div className="d-flex align-items-center">
                                        <FaBox className="overview-icon text-success" />
                                        <div className="ms-3">
                                            <p className="mb-1">Number of Vegetables</p>
                                            <h4 className="mb-0">{stats?.totalVegetables}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscription Section */}
                <div className="row g-4">
                    <div className="col-12 col-md-6">
                        <div className="card overview-card h-100">
                            <div className="card-header bg-white">
                                <h5 className="card-title mb-0">
                                    <FaExclamationCircle className="me-2" />
                                    Expiring Subscriptions
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="overview-content bg-light p-4 rounded">
                                    <div className="d-flex align-items-center">
                                        <FaCalendarAlt className="overview-icon text-danger" />
                                        <div className="ms-3">
                                            <p className="mb-1">Marketers with &lt;5 days to expire</p>
                                            <h4 className="mb-0">{stats?.expiringSubscriptions}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="card overview-card h-100">
                            <div className="card-header bg-white">
                                <h5 className="card-title mb-0">
                                    <FaCreditCard className="me-2" />
                                    Subscription Plans
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="overview-content bg-light p-4 rounded">
                                    <div className="d-flex align-items-center">
                                        <FaCreditCard className="overview-icon text-info" />
                                        <div className="ms-3">
                                            <p className="mb-1">Total Subscription Plans</p>
                                            <h4 className="mb-0">{stats?.totalSubscriptionPlans}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={errMsg === null ? "alert_net hide_net" : "alert_net show alert_war_bg"} >
                <RxCrossCircled className='exclamation-circle' />
                <span className="msg">{errMsg}</span>
                <div className="close-btn close_war">
                    <IoClose className='close_mark' size={26} />
                </div>
            </div>

            </>}
        </div>
    );
};

export default AdminDashboard;