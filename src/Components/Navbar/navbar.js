import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io"
import * as GiIcons from "react-icons/gi"

import { sidebarData } from "./sidebarData"

import { IconContext } from 'react-icons';

import './Navbar.css';

function Navbar() {
    const [sideBar, setSideBar] = useState(false);
    const showSideBar = () => setSideBar(!sideBar);

    const location = useLocation();
    const currentPage = sidebarData.find(item => item.path === location.pathname);

    return (
        <div className=''>
            <div>
                <IconContext.Provider value={{ color: '#30381e' }}>
                    <div className="navbar ">
                        <div className="menu-bars">
                            <Link to="#">
                                <FaIcons.FaBars onClick={showSideBar} className="" />
                            </Link>
                            <span className='page-title'>{currentPage ? currentPage.title : 'Unknown Page'}</span>
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
                            <Link to="#" className="logo">
                                <GiIcons.GiWaterRecycling />
                            </Link>
                        </li>
                        {sidebarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </div>
    )
}

export default Navbar
