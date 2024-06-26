import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Helpers/Repository/AuthContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table } from 'antd'
import { MdAdd } from "react-icons/md";
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { Helmet } from 'react-helmet';

//ASSETS
import { LuRefreshCw } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";

import { showLoader, formatDate } from '../../Helpers/Utils/Common'
import {
    getClients,
    addClient,
    getClientById,
    updateClient,
    deleteClient
} from '../../Helpers/Repository/ClientRepo';
import { useNavigate } from 'react-router-dom';

export default function ClientManager() {
    const { userDetails } = useAuth();
    const [loading, setLoading] = useState(true);
    const [loader, setLoader] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState({ pageSize: 8 });
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('')
    const [search, setSearch] = useState('')
    const [action, setAction] = useState('')
    const [selectedRow, setSelectedRow] = useState([])
    const [confirmationDiag, setConfirmationDiag] = useState(false)
    // const [deleteRec, setDeleteRec] = useState(false)
    const navigate = useNavigate()

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
                toast.error("Please enter an ID");
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
        setAddress('')
        setEmail('')
        setPassword('')
    }

    const handleAddClientClick = () => {
        setAction("add")
        setModalOpen(true)
    }

    const handleAddClient = async () => {
        try {
            setLoader(true)
            if (!name || !address || !email || !password) {
                setLoader(false)
                toast.info("Fill in all required fields")
            }
            else {
                const success = await addClient(email, password, {
                    name,
                    address: address
                });

                if (success) {
                    const emailContent = {
                        to: email,
                        subject: 'Welcome to Hygieia',
                        text: message
                    };
                    await axios.post('https://hygieia-back-end-node.onrender.com/send-email', emailContent);
                    toast.success("Client Added Successfully")
                    setLoader(false)
                    setModalOpen(false)
                    clearFields()
                    fetchData()
                } else {
                    setLoader(false)
                    toast.error("Failed to Add Store")
                }

            }
        }
        catch (error) {
            setLoader(false)
            toast.error("An error occured: " + error)
        }
    }

    const handleUpdateClick = (record) => {
        try {
            setModalOpen(true)
            setAction("update")
            setSelectedRow(record)
            setName(record.name)
            setAddress(record.address)
        }
        catch (error) {
            toast.error("Error: " + error)
        }
    }
    const handleUpdateClientInfo = async () => {
        try {
            if (!name || !address) {
                setLoader(false)
                toast.info("Fill in all required fields")
                return;
            }

            if (name !== selectedRow.name ||
                address !== selectedRow.address) {
                setLoader(true)
                const success = await updateClient(selectedRow.id, {
                    name,
                    address: address
                });

                if (success) {
                    toast.success("Updated Successfully")
                    setLoader(false)
                    setModalOpen(false)
                    clearFields()
                    fetchData()
                }
                else {
                    setLoader(false)
                    setLoader(false)
                }
            }
            else {
                setLoader(false)
                toast.info("No Changes Detected")
                setLoader(false)
            }
        }
        catch (error) {
            setLoader(false)
            toast.error("Error: " + error)
        }
    }

    const handleDeleteClick = (record) => {
        setConfirmationDiag(true)
        setSelectedRow(record)
    }

    const deleteClientRecord = async () => {
        try {
            const success = deleteClient(selectedRow.id)
            if (success) {
                toast.success("Client Deleted Successfully")
                setConfirmationDiag(false)
                fetchData()
            }
            else {
                setLoading(false)
                setConfirmationDiag(false)
                toast.error("Error")
            }
        }
        catch (error) {
            toast.error("Error: " + error)
        }
    }

    const headers = [
        {
            key: 1,
            title: 'Client ID',
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
            dataIndex: 'address'
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
        },
        {
            key: 5,
            title: 'Actions',
            render: (record) => (
                <div className='flex gap-3'>
                    <button className="view-btn w-full" onClick={() => handleUpdateClick(record)}>Edit</button>
                    <button className="danger-btn w-full" onClick={() => handleDeleteClick(record)}>Delete</button>
                </div>
            )
        }
    ]

    useEffect(() => {
        if (userDetails && userDetails.type === "client") {
            navigate('/home')
        } else {
            fetchData()
        }
    }, [userDetails])

    useEffect(() => {
        setMessage(`Welcome Aboard! \n\nYou are now apart of the Hygieia program. You may use these credentials to login your account. \n\nEmail: ${email} \nPassword: ${password} \n\nYou may leave the password as is, but we recommend that you change it to a more secure password once you have logged in to your account. \n\nThank you and welcome!`);
    }, [email, password]);

    return (
        <div className='page-container'>
            <Helmet>
                <title>Clients</title>
            </Helmet>
            <ToastContainer />
            <div>
                <div className='w-full justify-between flex-col md:gap-0 md:flex-row flex mb-5'>
                    <div className='rounded-md border border-gray h-fit overflow-hidden w-fit'>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by ID"
                            className='p-1 focus-within:bg-white outline-none w-56'
                        />
                        <button type="button" className='bg-green py-1 text-white px-3' onClick={() => fetchClientById()}>Search</button>
                    </div>
                    <div className='flex flex-row justify-end gap-3 items-center mt-7 md:mt-0'>
                        <LuRefreshCw className='cursor-pointer text-2xl me-4' onClick={() => fetchData()} />
                        <button className='bg-orange hover:shadow-md items-center flex flex-row text-sm text-white py-2 px-4 rounded-md w-fit' onClick={() => handleAddClientClick(true)}><span className='p-0 text-lg m-0 me-2'><MdAdd /></span>Add Client</button>
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
                        <div className='bg-white rounded-md p-5'>
                            {action === "add" ? (
                                <div>
                                    <div className="flex flex-row justify-between">
                                        <p className='text-lg font-bold'>Create Client</p>
                                        <AiOutlineClose className="hover:text-red text-2xl" onClick={() => handleCancelClick()} />
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
                                        <textarea
                                            type="text"
                                            placeholder="Enter address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className='input-field w-full'
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
                                    <div className="flex justify-end gap-3 mt-9">
                                        <div>
                                            {loader ? (
                                                <div>{showLoader()}</div>
                                            ) : (
                                                <div>   </div>
                                            )}
                                        </div>
                                        <button type='button' className="cancel-btn w-20" onClick={() => handleCancelClick()}>Cancel</button>
                                        <button type='button' className="view-btn w-20" onClick={() => handleAddClient()}>Add</button>
                                    </div>
                                </div>
                            ) : (
                                <div className='w-[23rem]'>
                                    <div className="flex flex-row justify-between">
                                        <p className='text-lg font-bold'>Update Client Information</p>
                                        <AiOutlineClose className="hover:text-red text-2xl" onClick={() => handleCancelClick()} />
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
                                        <textarea
                                            type="text"
                                            placeholder="Enter Address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className='input-field w-full'
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-9">
                                        <div>
                                            {loader ? (
                                                <div className='me-4'>
                                                    {showLoader()}
                                                </div>
                                            ) : (
                                                <div>   </div>
                                            )}
                                        </div>
                                        <button type='button' className="cancel-btn w-20" onClick={() => handleCancelClick()}>Cancel</button>
                                        <button type='button' className="view-btn w-20" onClick={() => handleUpdateClientInfo()}>Update</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>
                <Modal open={confirmationDiag} onClose={() => setConfirmationDiag(false)}>
                    <div className='w-screen h-screen justify-center flex items-center'>
                        <div className='w-96 bg-white rounded-md overflow-hidden'>
                            <div className='bg-red text-white py-2 text-center'>WARNING!</div>
                            <div className="p-5">
                                <p>Are you sure you want to delete this client?</p>
                                <div className='flex flex-row justify-end gap-3 mt-5'>
                                    <button className='border border-gray rounded-md w-14 hover:bg-gray hover:text-white' onClick={() => setConfirmationDiag(false)}>No</button>
                                    <button className='cancel-btn w-14' onClick={() => deleteClientRecord()}>Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div >
    )
}
