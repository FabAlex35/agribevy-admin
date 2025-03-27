"use client"

import React, { useEffect, useState } from 'react'
import NavBar from '@/src/Components/Navbar'
import SideNav from '@/src/Components/SideNav'
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetailsSlice } from '../features/Slice';
import { fetchAdminAPI } from '@/src/Components/Api';
const Wrapper = ({ children }) => {

    const [isOpen, setIsOpen] = useState(true);
    const nameChanged = useSelector((state) => state?.user?.nameChanged)
    const dispatch = useDispatch()
    const [user, setUser] = useState(null)
    useEffect(() => {
        const windowSizeHandler = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false)
            }
        };
        windowSizeHandler()
        window.addEventListener("resize", windowSizeHandler);
        return () => {
            window.removeEventListener("resize", windowSizeHandler);
        };

    }, []);

    const getUserDetails = async () => {
        const response = await fetchAdminAPI()
        if (response?.status === 200) {
            setUser(response?.data);
            dispatch(getUserDetailsSlice(response?.data))
        }
    }

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(()=>{
        getUserDetails()
    },[])


    return (
        <>

            <section className="main">
                <NavBar userName={user?.user_name} role={user?.user_role} />
                <SideNav isOpen={isOpen}/>
                <div className={!isOpen ? "menu active" : "menu"} onClick={toggleSidebar}>
                    {isOpen && <IoIosArrowDropleftCircle />}
                    {!isOpen && <IoIosArrowDroprightCircle />}
                </div>
                <div className={!isOpen ? "main-wrap active" : "main-wrap"}>
                    {children}
                </div>
            </section>
        </>
    )
}

export default Wrapper

