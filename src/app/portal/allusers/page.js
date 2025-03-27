"use client"
import { getUserSubDetail } from '@/src/Components/Api';
import React, { useEffect, useState } from 'react'

const Users = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error,setError]=useState(null)
    const [user,setUser]=useState(null)
    const [shopData,setShopData] = useState(null);

    const fetchSubDetail = async() => {
        const data = await getUserSubDetail()
        if(data?.status === 200){
            setShopData(data?.data)
        }  
    }

    const filteredData = shopData?.filter((item) =>
        item.shop_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.market?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = () => {

    }
    
    const activateMarketer=(marketer)=>{
        setUser(marketer)
        setIsModalOpen(true)
    }


    useEffect(()=>{
        fetchSubDetail()
    },[])

    return (
        <div className='app-container'>
            <div className="head pt-2 text-center mb-4">
                <h2 className="primary-color">User Management</h2>
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

            <div className="table-container mt-3">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Shop Name</th>
                            <th>Market</th>
                            <th>Joined date</th>
                            <th>Subscription plan</th>
                            <th>Status</th>
                            <th>Date of expiry</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData?.map(shop =>
                            <tr>
                                <td>{shop.shop_name}</td>
                                <td>{shop.market}</td>
                                <td>{shop.joined_date ? shop.joined_date.split('T')[0] : 'N/A'}</td>
                                <td>{shop.subscription_plan}</td>
                                <td className={`${shop.status === "Inactive" || shop.status === "Not Subscribed"? "text-danger fw-bold" : "text-success fw-bold"}`}>{shop.status}</td>
                                <td>{shop.expiry_date}</td>
                                <td><button className='submit-btn requirement-btn py-2' onClick={()=>activateMarketer(shop)} disabled={shop.status === "Active"}>Activate</button></td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
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

                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className='d-flex gap-2'>
                                        <p className="mb-3 fw-bold"><span className='text-success'>Shop Name:</span>{user?.shopName}</p>
                                        <p className="mb-3 fw-bold"><span className='text-success'>Market:</span>{user?.market}</p>
                                    </div>


                                    <div className="mb-3">
                                        <label className="form-label">
                                            Subscription key
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control payment-input"
                                            placeholder="Enter subscription key"
                                            required
                                        />
                                        {error && <p className="text-danger mb-2">{error}</p>}
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

                                    <button type="submit" className="submit-btn requirement-btn py-2">
                                        Submit 
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Users