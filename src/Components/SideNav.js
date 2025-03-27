"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { MdManageSearch } from "react-icons/md";
import { BiSolidDashboard } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { GiTomato } from "react-icons/gi";
import { BsShop } from "react-icons/bs";
import { BiSolidReport } from "react-icons/bi";
const SideNav = ({ isOpen}) => {
    const pathname = usePathname()

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-side">{isOpen ? "Quick access" : <MdManageSearch />}</div>
            </div>
            <div className="sidebar-nav">
                {isOpen &&
                    <ul className='sidebar-list'>

                        <Link href="/portal/admindashboard"><li className={`${pathname === "/portal/admindashboard" ? 'active nav-link' : "nav-link"}`}><BiSolidDashboard size={16} />&nbsp; Dashboard</li></Link>

                        <Link href="/portal/allusers"><li className={`${pathname === "/portal/allusers" ? 'active nav-link' : "nav-link"}`}><FaUsers size={16} />&nbsp; Users</li></Link>

                        <Link href="/portal/subscriptions"><li className={`${pathname === "/portal/subscriptions" ? 'active nav-link' : "nav-link"}`}><MdPayments size={16} />&nbsp; Subscriptions</li></Link>

                        <Link href="/portal/managevegetables"><li className={`${pathname === "/portal/managevegetables" ? 'active nav-link' : "nav-link"}`}><GiTomato size={16} />&nbsp; Vegetables</li></Link>

                        <Link href="/portal/managemarkets"><li className={`${pathname === "/portal/managemarkets" ? 'active nav-link' : "nav-link"}`}><BsShop size={16} />&nbsp; Markets</li></Link>

                        <Link href="/portal/adminreports"><li className={`${pathname === "/portal/adminreports" ? 'active nav-link' : "nav-link"}`}><BiSolidReport size={16} />&nbsp; Reports</li></Link>
                       
                    </ul>
                }
                {!isOpen &&
                    <ul className='sidebar-list'>
                        <Link href="/portal/admindashboard" title="Dashboard"><li className={`${pathname === "/portal/admindashboard" ? 'active nav-link p-0 ps-3 py-3' : "nav-link p-0 ps-3 py-3"}`}><BiSolidDashboard size={28} /></li></Link>

                        <Link href="/portal/allusers" title="Users"><li className={`${pathname === "/portal/allusers" ? 'active nav-link p-0 ps-3 py-3' : "nav-link p-0 ps-3 py-3"}`}><FaUsers size={28} /></li></Link>

                        <Link href="/portal/subscriptions" title="Subscriptions"><li className={`${pathname === "/portal/subscriptions" ? 'active nav-link p-0 ps-3 py-3' : "nav-link p-0 ps-3 py-3"}`}><MdPayments size={28} /></li></Link>

                        <Link href="/portal/managevegetables" title="Vegetables"><li className={`${pathname === "/portal/managevegetables" ? 'active nav-link p-0 ps-3 py-3' : "nav-link p-0 ps-3 py-3"}`}><GiTomato size={28} /></li></Link>

                        <Link href="/portal/managemarkets" title="Markets"><li className={`${pathname === "/portal/managemarkets" ? 'active nav-link p-0 ps-3 py-3' : "nav-link p-0 ps-3 py-3"}`}><BsShop size={28} /></li></Link>
                        
                        <Link href="/portal/adminreports" title="Reports"><li className={`${pathname === "/portal/adminreports" ? 'active nav-link p-0 ps-3 py-3' : "nav-link p-0 ps-3 py-3"}`}><BiSolidReport size={28} /></li></Link>
                       
                    </ul>
                }
            </div>
        </div>
    )
}

export default SideNav