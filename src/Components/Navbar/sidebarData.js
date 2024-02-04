import React from 'react'
import * as FaIcons from "react-icons/fa"
// import * as AiIcons from "react-icons/ai"
import * as IoIcons from "react-icons/io"
import { IoLogOut } from "react-icons/io5";


export const sidebarData = [
    {
        title: 'Dashboard',
        path: '/home',
        icon: <FaIcons.FaHome />,
        cName: 'nav-text'
    },
    {
        title: 'Scheduler',
        path: '/scheduler',
        icon: <FaIcons.FaCalendarAlt />,
        cName: 'nav-text'
    },
    {
        title: 'Manage Stores',
        path: '/store',
        icon: <FaIcons.FaStoreAlt />,
        cName: 'nav-text'
    },
    {
        title: 'Pickup Requests',
        path: '/requests',
        icon: <IoIcons.IoIosPaper />,
        cName: 'nav-text'
    },
    {
        title: 'Logout',
        path: '/requests',
        icon: <IoLogOut/>,
        cName: 'nav-text'
    },
]
