"use client"
import Spinner from '@/src/Components/Spinner';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
const Markets = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false)
    const [spin, setSpin] = useState(false)
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const tnDistricts = [
        "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi",
        "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal",
        "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
        "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur",
        "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar",
        "Mayiladuthurai", "Chengalpattu"
    ];

    // Static market data
    const staticMarkets = [
        { id: 1, name: "New Kamarajar Market", state: "Tamil Nadu", district: "Tenkasi" },
        { id: 2, name: "Surandai Market", state: "Tamil Nadu", district: "Tenkasi" },
        { id: 3, name: "Anna Market", state: "Tamil Nadu", district: "Chennai" },
        { id: 4, name: "Gandhi Market", state: "Tamil Nadu", district: "Tiruchirappalli" },
        { id: 5, name: "Central Market", state: "Tamil Nadu", district: "Coimbatore" },
        { id: 6, name: "Uzhavar Santhai", state: "Tamil Nadu", district: "Salem" },
        { id: 7, name: "wholesale Market", state: "Tamil Nadu", district: "Madurai" }
    ];

    const [markets, setMarkets] = useState(staticMarkets);


    const closeFun = () => {
        setIsOffCanvasOpen(false)
        reset()
    }

    const filteredMarkets = markets.filter((market) =>
        market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        market.district.toLowerCase().includes(searchQuery.toLowerCase())
    );



    const handleEdit = (id) => {
        console.log(`Edit vegetable with id: ${id}`);
    };

    const handleDelete = (id) => {
        console.log(`Delete vegetable with id: ${id}`);
    };

    const onSubmitInventory = async (data) => {
        setSpin(true);
        // Simulate API call
        setTimeout(() => {
            const newMarket = {
                id: markets.length + 1,
                ...data,
                state: "Tamil Nadu"
            };
            setMarkets([...markets, newMarket]);
            setSpin(false);
            closeFun();
        }, 1000);
    }


    return (
        <div className='app-container'>
            <div className="head pt-2 text-center mb-4">
                <h2 className="primary-color">Markets Management</h2>
            </div>

            <div className='d-flex justify-content-end mt-4'>
                <button className='submit-btn py-2 ' onClick={() => setIsOffCanvasOpen(true)}>Add Market</button>
            </div>

            <div className='d-flex justify-content-end mt-3' >

                <input
                    type="text"
                    className=' search-input'
                    placeholder='Search'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="row g-4 mt-2">
                {filteredMarkets.map((market) => (
                    <div key={market.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                        <div className="card h-100 shadow-sm hover-shadow market-card">
                            <div className="card-body">
                                <h5 className="card-title primary-color mb-3">{market.name}</h5>
                                <p className="card-text mb-2">
                                    <strong>State:</strong> {market.state}
                                </p>
                                <p className="card-text mb-3">
                                    <strong>District:</strong> {market.district}
                                </p>
                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        className="btn  primary-color btn-sm"
                                        onClick={() => handleEdit(market.id)}
                                    >
                                        <FaRegEdit size={18} />
                                    </button>
                                    <button
                                        className="btn text-danger btn-sm"
                                        onClick={() => handleDelete(market.id)}
                                    >
                                        <MdDelete size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className={`offcanvas offcanvas-end ${isOffCanvasOpen ? "show" : ""}`}
                tabindex="-1"
                id="offcanvasRight"
                aria-labelledby="offcanvasRightLabel"
            >
                <div className="offcanvas-header">
                    <h5 id="offcanvasRightLabel">Add Market</h5>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        onClick={closeFun}
                    ></button>
                </div>
                {/* ============ offcanvas create ====================== */}
                <div className="offcanvas-body">
                    <div className="row canva">
                        <div className="col-12 card-section">
                            <div className="login-sign-form-section">
                                <form
                                    className="login-sign-form mt-4"
                                    onSubmit={handleSubmit(onSubmitInventory)}
                                >

                                    <div className="form-group">
                                        <div className="label-time">
                                            <label>
                                                Market name<sup className="super">*</sup>
                                            </label>
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            {...register("name", {
                                                required: "Please enter the market name",
                                            })}
                                        />
                                        <p className="err-dev">{errors?.name?.message}</p>
                                    </div>

                                    <div className="form-group">
                                        <div className="label-time">
                                            <label>
                                                State name<sup className="super">*</sup>
                                            </label>
                                        </div>
                                        <input
                                            type="text"
                                            name="state"
                                            className="form-control"
                                            {...register("state", {
                                                required: "Please enter the State name",
                                            })}
                                            value="Tamil Nadu"
                                            disabled
                                        />
                                        <p className="err-dev">{errors?.state?.message}</p>
                                    </div>


                                    <div className="form-group">
                                        <div className="label-time">
                                            <label>
                                                District name<sup className="super">*</sup>
                                            </label>
                                        </div>
                                        <select className='form-control'
                                            {...register("district", {
                                                required: "Please select a district",
                                            })}
                                        >
                                            <option value="" disabled>
                                                Select District
                                            </option>
                                            {tnDistricts.map((district) => (
                                                <option key={district} value={district}>
                                                    {district}
                                                </option>
                                            ))}
                                        </select>


                                        <p className="err-dev">{errors?.district?.message}</p>
                                    </div>


                                    <div className="d-flex justify-content-center mt-4">
                                        <button
                                            type="submit"
                                            className="start_btn"
                                        > {spin ? <Spinner /> : "Submit"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Markets