import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as FaIcons from "react-icons/fa";
import { IconContext } from 'react-icons';
import { useAuth } from '../../Helpers/Repository/AuthContext'
import { FiLogOut } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { client, admin } from "./SidebarData"

import Logo from '../../Assets/logo_final.png'

import './Navbar.css';

function Navbar() {
    const { logout, userDetails } = useAuth()
    const [user, setUser] = useState("Unauthenticated Access");
    const [id, setId] = useState("")
    const [sideBar, setSideBar] = useState(false);
    const showSideBar = () => setSideBar(!sideBar);
    const navigate = useNavigate()
    const location = useLocation();
    const currentPage = client.find(item => item.path === location.pathname);
    const currentAdminPage = admin.find(item => item.path === location.pathname);
    const currentPagePath = location.pathname;
    const isCurrentPage = (path) => currentPagePath === path;

    async function handleLogout() {
        try {
            await logout()
            navigate("/")
        }
        catch (e) {
            toast.error("An error occured: " + e)
        }
    }

    useEffect(() => {
        if (userDetails) {
            setUser(userDetails.name || "");
            setId(userDetails.id || "");
        }
    }, [userDetails]);

    return (
        <div className='relative z-50'>
            <ToastContainer />
            {userDetails && userDetails.type === "client" ? (
                <div className='relative'>
                    <div
                        className={sideBar ? 'bg-black opacity-30 w-screen h-screen absolute inline' : 'bg-black opacity-30 w-screen h-screen absolute hidden'}
                        onClick={showSideBar}>
                    </div>
                    <div className='hidden md:flex absolute'>
                        <IconContext.Provider value={{ color: '#fff' }}>
                            <nav className='fixed top-0 left-0 w-16 h-screen bg-oliveGreen flex flex-col justify-between'>
                                <div>
                                    <img src={Logo} alt="logo" className='w-10 bg-white mx-auto mt-1 cursor-pointer rounded-full' onClick={showSideBar} />
                                    <ul className='flex flex-col items-center gap-1 mt-8'>
                                        {client.map((item, index) => {
                                            return (
                                                <li key={index} className={isCurrentPage(item.path) ? 'bg-mutedGreen p-3 rounded-md' : 'hover:bg-mutedGreen p-3 rounded-md'}>
                                                    <Link to={item.path}>
                                                        {item.icon}
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                                <div className='flex justify-center items-center p-3 hover:bg-mutedGreen mb-3 cursor-pointer rounded-md'>
                                    <FiLogOut onClick={handleLogout} />
                                </div>
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
                                    {location.pathname.includes("/store-profile") ? (
                                        <span className='page-title'>Store Profile</span>
                                    ) : location.pathname.includes("/account-request") ? (
                                        <span className='page-title'>Account Request Form</span>
                                    ) : (
                                        <span className='page-title'>{currentPage ? currentPage.title : 'Unknown Page'}</span>
                                    )}
                                </div>
                                <div>

                                </div>
                            </div>
                        </IconContext.Provider>
                    </div>
                    <IconContext.Provider value={{ color: '#fff' }}>
                        <nav className={sideBar ? 'nav-menu active' : 'nav-menu'} onClick={showSideBar}>
                            <div className='flex flex-col justify-between' onClick={showSideBar}>
                                <div className='text-white flex justify-center flex-col items-center pt-6'>
                                    <img src={Logo} alt="logo" className='w-20 bg-white rounded-full' />
                                    <div className='text-center w-full mt-3'>
                                        <p>{user}</p>
                                        <p className='text-xs tracking-tight font-thin'>ID: {id}</p>
                                    </div>
                                    <div>
                                        <ul className='mt-5 overflow-y-scroll scrollbar-none' onClick={showSideBar}>
                                            {client.slice(0, 3).map((item, index) => (
                                                <li key={index} className={isCurrentPage(item.path) ? 'bg-mutedGreen nav-text my-1 h-8 rounded-md' : 'h-8 my-1 hover:bg-mutedGreen rounded-md nav-text'}>
                                                    <Link to={item.path}>
                                                        {item.icon}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                            <li className="text-xs mt-5">Manage</li>
                                            {client.slice(3).map((item, index) => (
                                                <li key={index} className={isCurrentPage(item.path) ? 'bg-mutedGreen nav-text my-1 h-8 rounded-md' : 'h-8 my-1 hover:bg-mutedGreen rounded-md nav-text'}>
                                                    <Link to={item.path}>
                                                        {item.icon}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs mt-3 text-white">Session</p>
                                    <div onClick={handleLogout} className="h-8 my-1 hover:bg-mutedGreen rounded-md nav-text">
                                        <Link to="#">
                                            <FiLogOut />
                                            <span className='text-white'>Logout</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </IconContext.Provider>
                </div >
            ) : (
                <div className='relative'>
                    <div
                        className={sideBar ? 'bg-black opacity-30 w-full h-screen absolute inline' : 'bg-black opacity-30 w-screen h-screen absolute hidden'}
                        onClick={showSideBar}>
                    </div>
                    <div className='hidden md:flex absolute'>
                        <IconContext.Provider value={{ color: '#fff' }}>
                            <nav className='fixed top-0 left-0 w-16 h-screen bg-oliveGreen flex flex-col justify-between'>
                                <div>
                                    <img src={Logo} alt="logo" className='w-10 bg-white rounded-full mx-auto mt-1 cursor-pointer' onClick={showSideBar} />
                                    <ul className='flex flex-col items-center gap-1 mt-8'>
                                        {admin.map((item, index) => {
                                            return (
                                                <li key={index} className={isCurrentPage(item.path) ? 'bg-mutedGreen p-3 rounded-md' : 'hover:bg-mutedGreen p-3 rounded-md'}>
                                                    <Link to={item.path}>
                                                        {item.icon}
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                                <div className='flex justify-center items-center p-3 hover:bg-mutedGreen mb-3 cursor-pointer rounded-md'>
                                    <FiLogOut onClick={handleLogout} />
                                </div>
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
                                    {location.pathname.includes("/store-profile") ? (
                                        <span className='page-title'>Store Profile</span>
                                    ) : location.pathname.includes("/account-request") ? (
                                        <span className='page-title'>Account Request Form</span>
                                    ) : (
                                        <span className='page-title'>{currentAdminPage ? currentAdminPage.title : 'Unknown Page'}</span>
                                    )}
                                </div>
                                <div>

                                </div>
                            </div>
                        </IconContext.Provider>
                    </div>
                    <IconContext.Provider value={{ color: '#fff' }}>
                        <nav className={sideBar ? 'nav-menu active' : 'nav-menu'} onClick={showSideBar}>
                            <div className='flex flex-col justify-between' onClick={showSideBar}>
                                <div className='text-white flex justify-start flex-col items-center pt-6'>
                                    <img src={Logo} alt="logo" className='w-20 bg-white rounded-full' />
                                    <div className='text-center w-full mt-3'>
                                        <p>{user}</p>
                                        <p className='text-xs tracking-tight font-thin'>ID: {id}</p>
                                    </div>
                                    <div className='overflow-scroll scrollbar-none'>
                                        <ul className='mt-5 overflow-y-scroll scrollbar-none' onClick={showSideBar}>
                                            {admin.slice(0, 4).map((item, index) => (
                                                <li key={index} className={isCurrentPage(item.path) ? 'bg-mutedGreen nav-text my-1 h-8 rounded-md' : 'h-8 my-1 hover:bg-mutedGreen rounded-md nav-text'}>
                                                    <Link to={item.path} className='p-0'>
                                                        {item.icon}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                            <li className="text-xs mt-3">Manage</li>
                                            {admin.slice(4).map((item, index) => (
                                                <li key={index} className={isCurrentPage(item.path) ? 'bg-mutedGreen nav-text my-1 h-8 rounded-md' : 'h-8 my-1 hover:bg-mutedGreen rounded-md nav-text'}>
                                                    <Link to={item.path} className='p-0'>
                                                        {item.icon}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs mt-3 text-white">Session</p>
                                    <div onClick={handleLogout} className="h-8 mb-1 hover:bg-mutedGreen rounded-md nav-text">
                                        <Link to="#">
                                            <FiLogOut />
                                            <span className='text-white'>Logout</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </IconContext.Provider>
                </div>
            )
            }
        </div >
    )
}

export default Navbar
