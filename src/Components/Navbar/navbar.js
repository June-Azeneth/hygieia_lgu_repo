import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as FaIcons from "react-icons/fa";
import { sidebarData } from "./sidebarData"
import { IconContext } from 'react-icons';
import { useAuth } from '../../Helpers/Context/AuthContext'
import { IoLogOut } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Logo from '../../Assets/logo_final.png'

import './Navbar.css';

function Navbar() {
    const { logout, userDetails } = useAuth()
    const [user, setUser] = useState(userDetails ? userDetails.name : "Unauthenticated Access");
    const [sideBar, setSideBar] = useState(false);
    const showSideBar = () => setSideBar(!sideBar);
    const navigate = useNavigate()
    const location = useLocation();
    const currentPage = sidebarData.find(item => item.path === location.pathname);

    async function handleLogout() {
        try {
            await logout()
            navigate("/")
        }
        catch (e) {
            toast.error("An error occured: " + e)
        }
    }

    return (
        <div className='relative z-50'>
            <ToastContainer />
            <div className='hidden md:flex'>
                <IconContext.Provider value={{ color: '#fff' }}>
                    <nav className='absolute top-0 left-0 w-16 h-screen bg-oliveGreen '>
                        {/* <Link to="#">
                            <FaIcons.FaBars onClick={showSideBar} className=" w-full mt-3" />
                        </Link> */}
                        <img src={Logo} alt="logo" className='w-10 bg-white rounded-md mx-auto mt-1 cursor-pointer' onClick={showSideBar}/>
                        <ul className='flex flex-col items-center gap-1 mt-8'>
                            {sidebarData.map((item, index) => {
                                return (
                                    <li key={index} className='hover:bg-mutedGreen p-3 rounded-md'>
                                        <Link to={item.path}>
                                            {item.icon}
                                        </Link>
                                    </li>
                                )
                            })}
                            <Link to="#" className='hover:bg-mutedGreen p-3 rounded-md' onClick={handleLogout}>
                                <IoLogOut />
                            </Link>
                        </ul>
                    </nav>
                </IconContext.Provider>
            </div>

            <div className='md:pl-16'>
                <IconContext.Provider value={{ color: '#30381e' }}>
                    <div className="navbar w-screen">
                        <div className="menu-bars">
                            <Link to="#" className='flex md:hidden'>
                                <FaIcons.FaBars onClick={showSideBar} className="" />
                            </Link>
                            <span className='page-title '>{currentPage ? currentPage.title : 'Unknown Page'}</span>
                        </div>
                        <div className='current-user pr-2'>
                            <span className='user-name'>UserName</span>
                            <span className='lgu-name'>LGU name</span>
                        </div>
                    </div>
                </IconContext.Provider>
            </div>

            <IconContext.Provider value={{ color: '#fff' }}>
                <nav className={sideBar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={showSideBar}>
                        <li className='navbar-toggle'>
                            <Link to="#" className="w-full text-center flex-col flex items-center text-white font-bold tracking-widest gap-2">
                                <img src={Logo} alt="logo" className='w-20 bg-white rounded-md' />
                                <p>{user}</p>
                            </Link>
                        </li>
                        {sidebarData.map((item, index) => (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        ))}
                        <li onClick={handleLogout} className="nav-text">
                            <Link to="#">
                                <IoLogOut />
                                <span className='text-white'>Logout</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </IconContext.Provider>
        </div>
    )
}

export default Navbar
