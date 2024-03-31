import React from 'react'
import * as FaIcons from "react-icons/fa"
// import * as AiIcons from "react-icons/ai"
import * as IoIcons from "react-icons/io"
// import { ImStatsDots } from "react-icons/im";
import { RiAdminFill } from "react-icons/ri";
import { IoPeople } from "react-icons/io5";
import { PiTruckFill } from "react-icons/pi";
import { FaBuildingColumns } from "react-icons/fa6";

export const client = [
    {
        title: 'Dashboard',
        path: '/home',
        icon: <FaIcons.FaHome />,
        cName: 'nav-text'
    },
    {
        title: 'Transaction History',
        path: '/transactions',
        icon: <FaIcons.FaHistory />,
        cName: 'nav-text'
    },
    // {
    //     title: 'Scheduler',
    //     path: '/scheduler',
    //     icon: <FaIcons.FaCalendarAlt />,
    //     cName: 'nav-text'
    // },
    {
        title: 'Manage Stores',
        path: '/store',
        icon: <FaIcons.FaStoreAlt />,
        cName: 'nav-text'
    },
    {
        title: 'Garbage Pickup Requests',
        path: '/requests',
        icon: <PiTruckFill />,
        cName: 'nav-text'
    },
    // {
    //     title: 'Generate Reports',
    //     path: '/reports',
    //     icon: <ImStatsDots />,
    //     cName: 'nav-text'
    // },
]

export const admin = [
    {
        title: 'Dashboard',
        path: '/home',
        icon: <FaIcons.FaHome />,
        cName: 'nav-text'
    },
    {
        title: 'Transaction History',
        path: '/transactions',
        icon: <FaIcons.FaHistory />,
        cName: 'nav-text'
    },
    // {
    //     title: 'Scheduler',
    //     path: '/scheduler',
    //     icon: <FaIcons.FaCalendarAlt />,
    //     cName: 'nav-text'
    // },
    {
        title: 'Manage Stores',
        path: '/store',
        icon: <FaIcons.FaStoreAlt />,
        cName: 'nav-text'
    },
    {
        title: 'Garbage Pickup Requests',
        path: '/requests',
        icon: <PiTruckFill />,
        cName: 'nav-text'
    },
    {
        title: 'Manage Clients',
        path: '/clients',
        icon: <FaBuildingColumns />,
        cName: 'nav-text'
    },
    {
        title: 'Manage Consumer',
        path: '/consumers',
        icon: <IoPeople />,
        cName: 'nav-text'
    },
    {
        title: 'Manage Admins',
        path: '/admin',
        icon: <RiAdminFill />,
        cName: 'nav-text'
    },
]
