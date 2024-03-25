import React, { useState, useEffect } from 'react';
import { Table } from 'antd'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import { AiOutlineClose } from "react-icons/ai";
import { PulseLoader } from 'react-spinners';

import {
    getStores,
    getStoreByID
} from '../../../Helpers/Context/StoreRepo'
import {
    formatDate,
    showLoader,
} from '../../../Helpers/Utils/Common'
import '../storemanagement.css';

import { useAuth } from '../../../Helpers/Context/AuthContext';

//assets
import { MdAdd } from "react-icons/md";
import { BiSearchAlt } from "react-icons/bi";

function StoresList() {
    const navigate = useNavigate();
    const [toggleState, setToggleState] = useState('pending')
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("")
    const [pagination, setPagination] = useState({ pageSize: 8 });
    const { userDetails } = useAuth();
    const [modalOpen, setModalOpen] = useState(false)

    const handleViewClick = (record) => {
        if (toggleState === 'active') {
            navigate(`/store-profile/${record.id}`);
        }
        else if (toggleState === 'pending' || toggleState === 'rejected') {
            navigate(`/account-request/${record.id}`);
        } else {

        }
    }

    const handleTableChange = pagination => {
        setPagination(pagination);
    };

    const handleSearchInputChange = (event) => {
        setSearch(event.target.value)
    }

    const fetchStoreByID = async () => {
        try {
            setLoading(true)
            const response = await getStoreByID(toggleState, search);
            if (Array.isArray(response)) {
                if (response.length > 0) {
                    const formattedData = response.map(item => ({
                        ...item,
                        dateJoined: formatDate(item.dateJoined),
                        dateSubmitted: formatDate(item.dateSubmitted),
                        dateRejected: formatDate(item.dateRejected)
                    }));
                    setDataSource(formattedData);
                    setLoading(false)
                } else {
                    setDataSource([]);
                    setLoading(false)
                }
            } else {
                if (response) {
                    const formattedData = {
                        ...response,
                        dateJoined: formatDate(response.dateJoined),
                        dateSubmitted: formatDate(response.dateSubmitted),
                        dateRejected: formatDate(response.dateRejected)
                    };
                    setLoading(false)
                    setDataSource([formattedData]);
                } else {
                    setLoading(false)
                    setDataSource([]);
                }
            }
        } catch (error) {
            toast.error("An error occurred: " + error.message);
        }
    }

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
            dataIndex: 'storeId'
        },
        {
            key: 2,
            title: 'Shop Name',
            dataIndex: 'name'
        },
        {
            key: 3,
            title: 'Email',
            dataIndex: 'email'
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
            dataIndex: 'email'
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
                    <button className="px-3 w-20 py-1 rounded-md me-3 bg-green text-white" onClick={() => handleViewClick(record)}>View</button>
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
            dataIndex: 'email'
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
                    <button className="px-3 w-20 py-1 rounded-md me-3 bg-green text-white" onClick={() => handleViewClick(record)}>View</button>
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
            <div className='w-full justify-center md:justify-between flex flex-row items-center gap-10 mb-4 h-9'>
                <div className='flex justify-end flex-row items-center bg-white rounded-md border border-gray px-2'>
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchInputChange}
                        placeholder='Search Store by ID'
                        className='p-1 focus-within:bg-white outline-none'
                    />
                    <BiSearchAlt className="text-oliveGreen text-lg cursor-pointer" onClick={() => fetchStoreByID()} />
                </div>
                <button className='warning-btn flex justify-center items-center h-full pe-1' onClick={() => setModalOpen(true)}>
                    <span className='p-0 text-lg m-0 me-2'><MdAdd /></span>
                    Add Store
                </button>
            </div>
            <div className='w-full flex-row gap-1 flex'>
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
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <div className='w-screen h-screen justify-center items-center flex text-sm'>
                        <div className='bg-white w-96 rounded-md'>
                            <form className='p-5'>
                                <input
                                    type="text"
                                    placeholder='Store Name'
                                />
                            </form>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default StoresList;