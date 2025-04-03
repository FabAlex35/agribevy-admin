"use client"
import { addPlanAPI, getPlanAPI } from '@/src/Components/Api';
import Loader from '@/src/Components/Loader';
import Spinner from '@/src/Components/Spinner';
import React, { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FaCircleCheck } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { RxCrossCircled } from 'react-icons/rx';

const SubscriptionPlans = () => {
    const [plans, setPlans] = useState(null);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState(null);
    const [errMsg, setErrMsg] = useState(null);
    const [spin, setSpin] = useState(false);
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
    const offCanvasRef = useRef(null);  // ✅ Create ref for the offcanvas

    const { register, handleSubmit, watch, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            features: []
        }
    });

    const toggleOffCanvas = () => {
        setIsOffCanvasOpen(!isOffCanvasOpen);
        if (!isOffCanvasOpen) reset();
    };

    const handleClickOutside = (event) => {
        if (offCanvasRef.current && !offCanvasRef.current.contains(event.target)) {
            setIsOffCanvasOpen(false);
        }
    };

    useEffect(() => {
        if (isOffCanvasOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOffCanvasOpen]);

    const watchDuration = watch("duration", 0);

    const onSubmit = async (data) => {       
        const features = [
            `${data.duration * 30} days`,
            ...data.sub_feature.split("-").map(f => f)
        ];
        const newPlan = { ...data, features };
        setSpin(true);
        const response = await addPlanAPI(newPlan);
        if (response?.status === 200) {
            setSuccessMsg(response?.message);
            setSpin(false);
            setTimeout(() => {
                setSuccessMsg(null);
                setIsOffCanvasOpen(false);
                reset();
                subscriptionList();
            }, 2000);
        } else {
            setErrMsg(response?.message);
            setSpin(false);
            setTimeout(() => {
                setErrMsg(null);
            }, 2000);
        }
    };

    const subscriptionList = async () => {
        const response = await getPlanAPI();
        if (response?.status === 200) {
            setPlans(response?.data);
            setTimeout(() => {
                setErrMsg(null);
                setLoading(false);
            }, 2000);
        } else {
            setErrMsg(response?.message);
            setTimeout(() => {
                setLoading(false);
                setErrMsg(null);
            }, 2000);
        }
    };

    useEffect(() => {
        subscriptionList();
    }, []);

    return (
        <div className="app-container">
            {loading ? <Loader /> :
                <>
                    <div className="row mb-5">
                        <div className="col-12 text-center">
                            <div className="head pt-2 text-center mb-4">
                                <h2 className="primary-color">Subscription Plans</h2>
                            </div>
                            <div className='d-flex justify-content-end mt-4'>
                                <button className='submit-btn py-2' onClick={toggleOffCanvas}>Add New Plan</button>
                            </div>
                        </div>
                    </div>
                    {plans && plans.length > 0 ?
                        <div className="row g-4">
                            {plans.map((plan, index) => (
                                <div key={index} className="col-lg-3 col-md-6">
                                    <div
                                        className="card h-100 border-0 shadow-sm"
                                        style={{
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                        }}
                                    >
                                        <div className="card-body text-white">
                                            <div className="text-center mb-4">
                                                <h3 className="card-title h3 mb-3 justify-content-center">{plan.subscription_name}</h3>
                                                <div className="display-6 fw-bold mb-0">
                                                    ₹{plan.subscription_price}
                                                    <span className="fs-6 fw-normal text-opacity-75">
                                                        /{plan.subscription_months} months
                                                    </span>
                                                </div>
                                            </div>
                                            <hr />
                                            <ul className="list-unstyled mb-4">
                                                {plan.subscription_features.map((feature, idx) => (
                                                    <li key={idx} className="mb-2">
                                                        <i className="bi bi-check2-circle me-2"></i>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        :
                        <p className='text-danger fw-bold fs-3 text-center'>No Subscription plans found</p>
                    }

                    {/* Offcanvas Menu */}
                    <div
                        ref={offCanvasRef}
                        className={`offcanvas offcanvas-end ${isOffCanvasOpen ? 'show' : ''}`}
                        style={{ visibility: isOffCanvasOpen ? 'visible' : 'hidden' }}
                    >
                        <div className="offcanvas-header">
                            <h5>Add New Plan</h5>
                            <button type="button" className="btn-close text-reset" onClick={toggleOffCanvas}></button>
                        </div>
                        <div className="offcanvas-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group">
                                    <label>Plan Name<sup>*</sup></label>
                                    <input type="text" className="form-control" {...register("name", { required: "Plan name is required" })} />
                                    <p className="text-danger">{errors.name?.message}</p>
                                </div>

                                <div className="form-group">
                                    <label>Months<sup>*</sup></label>
                                    <input type="number" className="form-control"
                                        {...register("duration", {
                                            required: "Duration is required",
                                            min: { value: 1, message: "Duration must be at least 1 month" },
                                            max: { value: 12, message: "Duration cannot exceed 12 months" }
                                        })}
                                    />
                                    <p className="text-danger">{errors.duration?.message}</p>
                                </div>

                                <div className="form-group">
                                    <label>Price<sup>*</sup></label>
                                    <input type="number" className="form-control" {...register("price", { required: "Price is required", min: { value: 1, message: "Price must be above 1" } })} />
                                    <p className="text-danger">{errors.price?.message}</p>
                                </div>

                                <div className="form-group">
                                    <label>Feature<sup>*</sup></label>
                                    <input type="text" className="form-control" placeholder='Features with "-" separator' {...register("sub_feature", { required: "Features is required" })} />
                                    <p className="text-danger">{errors.sub_feature?.message}</p>
                                </div>

                                <div className="d-flex justify-content-center mt-4">
                                    <button type="submit" className="submit-btn py-2">{spin ? <Spinner /> : "Submit"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            }
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

export default SubscriptionPlans;
