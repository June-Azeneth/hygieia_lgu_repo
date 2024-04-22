import React from 'react'
import { LiaTruckSolid } from "react-icons/lia";
import { GrUserAdmin } from "react-icons/gr";
import { GoPeople } from "react-icons/go";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { TfiAnnouncement } from "react-icons/tfi";
import { PiBuildings } from "react-icons/pi";
import { GrHistory } from "react-icons/gr";
import { SlHome } from "react-icons/sl";

export const client = [
    {
        title: 'Dashboard',
        path: '/home',
        icon: <SlHome />,
        cName: 'nav-text'
    },
    {
        title: 'Transaction History',
        path: '/transactions',
        icon: <GrHistory />,
        cName: 'nav-text'
    },
    // {
    //     title: 'Scheduler',
    //     path: '/scheduler',
    //     icon: <FaIcons.FaCalendarAlt />,
    //     cName: 'nav-text'
    // },
    {
        title: 'Garbage Collection',
        path: '/requests',
        icon: <LiaTruckSolid />,
        cName: 'nav-text'
    },
    {
        title: 'Manage Stores',
        path: '/store',
        icon: <HiOutlineBuildingStorefront />,
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
        icon: <SlHome />,
        cName: 'nav-text'
    },
    {
        title: 'Transaction History',
        path: '/transactions',
        icon: <GrHistory />,
        cName: 'nav-text'
    },
    // {
    //     title: 'Scheduler',
    //     path: '/scheduler',
    //     icon: <FaIcons.FaCalendarAlt />,
    //     cName: 'nav-text'
    // },
    {
        title: 'Garbage Collection',
        path: '/requests',
        icon: <LiaTruckSolid />,
        cName: 'nav-text'
    },
    {
        title: 'Announcements',
        path: '/announcements',
        icon: <TfiAnnouncement />,
        cName: 'nav-text'
    },
    {
        title: 'Manage Stores',
        path: '/store',
        icon: <HiOutlineBuildingStorefront />,
        cName: 'nav-text'
    },
    {
        title: 'Manage Clients',
        path: '/clients',
        icon: <PiBuildings />,
        cName: 'nav-text'
    },
    {
        title: 'Manage Consumer',
        path: '/consumers',
        icon: <GoPeople />,
        cName: 'nav-text'
    },
    {
        title: 'Manage Admins',
        path: '/admin',
        icon: <GrUserAdmin />,
        cName: 'nav-text'
    },
]
