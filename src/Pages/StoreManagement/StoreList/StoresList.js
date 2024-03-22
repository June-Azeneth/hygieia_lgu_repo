import React, { useState, useEffect } from 'react';
import { Table } from 'antd'
import Modal from '@mui/material/Modal';
import { IoCloseCircleOutline } from "react-icons/io5";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import {
    getStores,
    registerStore,
    rejectStoreApplication
} from '../../../Helpers/Context/StoreRepo'
import {
    formatDate,
    showLoader,
} from '../../../Helpers/Utils/Common'
import '../storemanagement.css';

import { useAuth } from '../../../Helpers/Context/AuthContext';

function StoresList() {
    const navigate = useNavigate();
    const [toggleState, setToggleState] = useState('pending')
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ pageSize: 8 });
    const { userDetails } = useAuth();

    const handleViewClick = (record) => {
        if (toggleState === 'active') {
            navigate(`/store-profile/${record.id}`);
        }
    }

    const handleTableChange = pagination => {
        setPagination(pagination);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getStores(userDetails, toggleState);
            const formattedData = response.map(item => ({
                ...item,
                dateJoined: formatDate(item.dateJoined),
                dateSubmitted: formatDate(item.dateSubmitted),
                dateRejected: formatDate(item.dateRejected)
            }));
            setDataSource(formattedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // headers
    const activeHeader = [
        {
            key: 1,
            title: 'ID',
            dataIndex: 'id'
        },
        {
            key: 2,
            title: 'Shop Name',
            dataIndex: 'name'
        },
        {
            key: 3,
            title: 'Email',
            dataIndex: 'id'
        },
        {
            key: 4,
            title: 'Owner',
            dataIndex: 'owner'
        },
        {
            key: 5,
            title: 'Approved On',
            dataIndex: 'dateJoined'
        },
        {
            key: 6,
            title: 'Status',
            dataIndex: 'status'
        },
        {
            key: 7,
            title: 'Actions',
            render: (text, record) => (
                <div>
                    <button className="px-3 w-20 py-1 rounded-md hover:shadow-md me-3 bg-green text-white" onClick={() => handleViewClick(record)}>View</button>
                </div>
            )
        },
    ]

    const pendingHeader = [
        {
            key: 1,
            title: 'ID',
            dataIndex: 'id'
        },
        {
            key: 2,
            title: 'Shop Name',
            dataIndex: 'name'
        },
        {
            key: 3,
            title: 'Email',
            dataIndex: 'id'
        },
        {
            key: 4,
            title: 'Owner',
            dataIndex: 'owner'
        },
        {
            key: 5,
            title: 'Submitted On',
            dataIndex: 'dateSubmitted'
        },
        {
            key: 6,
            title: 'Status',
            dataIndex: 'status'
        },
        {
            key: 7,
            title: 'Actions',
            render: (text, record) => (
                <div>
                    <button className="px-3 w-20 py-1 rounded-md me-3 bg-green text-white">View</button>
                    <button className="px-3 w-20 py-1 rounded-md bg-red text-white">Reject</button>
                </div>
            )
        },
    ]

    const rejectedHeader = [
        {
            key: 1,
            title: 'ID',
            dataIndex: 'id'
        },
        {
            key: 2,
            title: 'Shop Name',
            dataIndex: 'name'
        },
        {
            key: 3,
            title: 'Email',
            dataIndex: 'id'
        },
        {
            key: 4,
            title: 'Owner',
            dataIndex: 'owner'
        },
        {
            key: 5,
            title: 'Rejected On',
            dataIndex: 'dateRejected'
        },
        {
            key: 6,
            title: 'Reason',
            dataIndex: 'reason'
        },
        {
            key: 7,
            title: 'Status',
            dataIndex: 'status'
        },
        {
            key: 8,
            title: 'Actions',
            render: (text, record) => (
                <div>
                    <button className="px-3 w-20 py-1 rounded-md me-3 bg-green text-white">View</button>
                </div>
            )
        },
    ]

    const toggleTab = (tab) => {
        setToggleState(tab)
    }

    useEffect(() => {
        fetchData();
    }, [userDetails, toggleState]);

    return (
        <div className='page-container text-darkGray'>
            <ToastContainer />
            <div className='flex flex-row gap-1'>
                <div className={toggleState === 'active' ? "tabs active-tab" : "tabs"} onClick={() => toggleTab('active')}>Active</div>
                <div className={toggleState === 'pending' ? "tabs active-tab" : "tabs"} onClick={() => toggleTab('pending')}>Pending</div>
                <div className={toggleState === 'rejected' ? "tabs active-tab" : "tabs"} onClick={() => toggleTab('rejected')}>Rejected</div>
            </div>

            <div className='content-tabs'>
                <div className={toggleState === "active" ? "content active-content" : "content"}>
                    {loading ? (
                        <div className='w-full h-full flex justify-center p-10'>
                            {showLoader()}
                        </div>) : (
                        <div className='overflow-x-scroll w-full scrollbar-none'>
                            <Table
                                columns={activeHeader}
                                dataSource={dataSource}
                                pagination={pagination}
                                onChange={handleTableChange}>
                            </Table>
                        </div>
                    )}
                </div>
                <div className={toggleState === "pending" ? "content active-content" : "content"}>
                    {loading ? (
                        <div className='w-full h-full flex justify-center p-10'>
                            {showLoader()}
                        </div>) : (
                        <div className='overflow-x-scroll w-full scrollbar-none'>
                            <Table
                                columns={pendingHeader}
                                dataSource={dataSource}
                                pagination={pagination}
                                onChange={handleTableChange}>
                            </Table>
                        </div>
                    )}
                </div>
                <div className={toggleState === "rejected" ? "content active-content" : "content"}>
                    {loading ? (
                        <div className='w-full h-full flex justify-center p-10'>
                            {showLoader()}
                        </div>) : (
                        <div className='overflow-x-scroll w-full scrollbar-none'>
                            <Table
                                columns={rejectedHeader}
                                dataSource={dataSource}
                                pagination={pagination}
                                onChange={handleTableChange}>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StoresList;