import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Helpers/Context/AuthContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table } from 'antd'
import { MdAdd } from "react-icons/md";
import Modal from '@mui/material/Modal';
import axios from 'axios';

//ASSETS
import { LuRefreshCw } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";

import { showLoader, formatDate } from '../../Helpers/Utils/Common'
import { getClients, addClient, getClientById } from '../../Helpers/Context/ClientRepo';

export default function ClientManager() {
    const { userDetails } = useAuth();
    const [loading, setLoading] = useState(true);
    const [loader, setLoader] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState({ pageSize: 8 });
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [barangay, setBarangay] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('')
    const [search, setSearch] = useState('')

    const handleTableChange = pagination => {
        setPagination(pagination);
    };

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await getClients();
            if (response) {
                const formattedData = response.map(item => ({
                    ...item,
                    dateAdded: formatDate(item.dateAdded)
                }));
                setDataSource(formattedData)
            } else {
                toast.error("An error occured: No data returned");
            }
            setLoading(false)
        }
        catch (error) {
            toast.error("An error occured: " + error.message)
        }
    }

    const fetchClientById = async () => {
        try {
            if (!search) {
                toast.error("Please supply an ID");
                return;
            }
            setLoading(true)
            const response = await getClientById(search);
            if (response) {
                const { dateAdded, ...otherFields } = response;
                const formattedDate = formatDate(dateAdded);
                const formattedData = {
                    ...otherFields,
                    dateAdded: formattedDate
                };
                setDataSource([formattedData]);
                setLoading(false)
            } else {
                toast.error("Error: No record found");
                setLoading(false)
                setDataSource([])
            }
        }
        catch (error) {
            toast.error("Error:" + error)
        }
    }

    const handleCancelClick = () => {
        setModalOpen(false)
        clearFields()
    }

    const clearFields = () => {
        setName('')
        setEmail('')
        setBarangay('')
        setCity('')
        setProvince('')
        setEmail('')
        setPassword('')
    }

    const handleAddClient = async () => {
        try {
            setLoader(true)
            const success = await addClient(email, password, {
                name,
                address: {
                    barangay,
                    city,
                    province
                }
            });

            if (success) {
                const emailContent = {
                    to: email,
                    subject: 'Welcome to Hygieia',
                    text: message
                };
                await axios.post('https://hygieia-back-end-node.onrender.com/send-email', emailContent);
                toast.success("Store Added Successfully")
                setLoader(false)
                setModalOpen(false)
                clearFields()
                fetchData()
            } else {
                setLoader(false)
                toast.error("Failed to Add Store")
            }

        }
        catch (error) {
            setLoader(false)
            toast.error("An error occured: " + error)
        }
    }

    const headers = [
        {
            key: 1,
            title: 'ID',
            dataIndex: 'id'
        },
        {
            key: 2,
            title: 'Name',
            dataIndex: 'name'
        },
        {
            key: 3,
            title: 'Address',
            dataIndex: ['address', 'city']
        },
        {
            key: 4,
            title: 'Email',
            dataIndex: 'email'
        },
        {
            key: 5,
            title: 'Date Added',
            dataIndex: 'dateAdded'
        }
        // {
        //     key: 5,
        //     title: 'Actions',
        //     render: (text, record) => (
        //         <div>
        //             <button className="danger-btn w-fit">Deactivate</button>
        //         </div>
        //     )
        // }
    ]

    useEffect(() => {
        fetchData()
    }, [userDetails])

    useEffect(() => {
        setMessage(`Welcome Aboard! \n\nYou are now apart of the Hygieia program. You may use these credentials to login your account. \n\nEmail: ${email} \nPassword: ${password} \n\nYou may leave the password as is, but we recommend that you change it to a more secure password once you have logged in to your account. \n\nThank you and welcome!`);
    }, [email, password]);

    return (
        <div className='page-container'>
            <ToastContainer />
            <div className='w-full justify-between flex-row flex mb-5 h-[2.5rem]'>
                <div className='rounded-md border border-gray overflow-hidden h-fit w-fit'>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by ID"
                        className='p-1 focus-within:bg-white outline-none w-56'
                    />
                    <button type="button" className='bg-green py-1 text-white px-3' onClick={() => fetchClientById()}>Search</button>
                </div>
                <div className='flex flex-row justify-end gap-3 items-center'>
                    <LuRefreshCw className='cursor-pointer text-2xl me-4' onClick={() => fetchData()} />
                    <button className='bg-orange hover:shadow-md items-center flex flex-row text-sm text-white py-2 px-4 rounded-md w-fit me-auto' onClick={() => setModalOpen(true)}><span className='p-0 text-lg m-0 me-2'><MdAdd /></span>Add Client</button>
                </div>
            </div>
            <div className='overflow-x-scroll w-full scrollbar-none bg-white rounded-md'>
                {loading ? (
                    <div className='w-full h-full flex justify-center p-10'>
                        {showLoader()}
                    </div>
                ) : (
                    <div>
                        <Table
                            columns={headers}
                            dataSource={dataSource}
                            pagination={pagination}
                            onChange={handleTableChange}>
                        </Table>
                    </div>
                )}

            </div>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className='h-screen w-screen flex justify-center items-center text-darkGray'>
                    <div className='bg-white rounded-md p-3'>
                        <div className="flex flex-row justify-between">
                            <p className='text-lg font-bold'>Create Client</p>
                            <AiOutlineClose className="hover:text-red text-2xl" onClick={() => setModalOpen(false)} />
                        </div>
                        <p className='font-bold mt-3'>General Information</p>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='input-field w-full'
                        />
                        <p className='font-bold mt-3'>Address</p>
                        <div className='flex flex-row gap-2'>
                            <input
                                type="text"
                                placeholder="Barangay"
                                value={barangay}
                                onChange={(e) => setBarangay(e.target.value)}
                                className='input-field'
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className='input-field'
                            />
                            <input
                                type="text"
                                placeholder="Province"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                className='input-field'
                            />
                        </div>
                        <p className='font-bold mt-3'>Set Credentials</p>
                        <div className='flex flex-row gap-3'>
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='input-field'
                            />
                            <input
                                type="text"
                                placeholder="Set Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='input-field'
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-5">
                            <div>
                                {loader ? (
                                    <div>{showLoader()}</div>
                                ) : (
                                    <div>   </div>
                                )}
                            </div>
                            <button type='button' className="cancel-btn" onClick={() => handleCancelClick()}>Cancel</button>
                            <button type='button' className="view-btn w-20" onClick={() => handleAddClient()}>Add</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div >
    )
}
