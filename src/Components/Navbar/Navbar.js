import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as FaIcons from "react-icons/fa";
import { sidebarData } from "./SidebarData"
import { IconContext } from 'react-icons';
import { useAuth } from '../../Helpers/Context/AuthContext'
import { IoLogOut } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Logo from '../../Assets/logo_final.png'

import './Navbar.css';

function Navbar() {
    const { logout, userDetails } = useAuth()
    const [user, setUser] = useState("Unauthenticated Access");
    const [address, setAddress] = useState("")
    const [id, setId] = useState("")
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

    useEffect(() => {
        if (userDetails) {
            setUser(userDetails.name || "Unauthenticated Access");
            setAddress(userDetails.address || "Location");
            setId(userDetails.id || "");
        }
    }, [userDetails]);

    return (
        <div className='relative z-50'>
            <ToastContainer />
            <div className='hidden md:flex'>
                <IconContext.Provider value={{ color: '#fff' }}>
                    <nav className='absolute top-0 left-0 w-16 h-screen bg-oliveGreen flex flex-col justify-between'>
                        <div>
                            <img src={Logo} alt="logo" className='w-10 bg-white rounded-md mx-auto mt-1 cursor-pointer' onClick={showSideBar} />
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
                            </ul>
                        </div>
                        <div className='flex justify-center items-center p-3 hover:bg-mutedGreen mb-3 cursor-pointer rounded-md'>
                            <IoLogOut onClick={handleLogout}/>
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
                            <span className='page-title '>{currentPage ? currentPage.title : 'Unknown Page'}</span>
                        </div>
                        <div className='current-user pr-2'>
                            <span className='user-name'>{user}</span>
                            <span className='lgu-name'>{address && typeof address === 'object' ? address.city : 'Location'}</span>
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
                                <p className='text-xs tracking-tight font-thin'>ID: {id}</p>
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
                        <li onClick={handleLogout} className="nav-text mt-24">
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
