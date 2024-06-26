import React, { useState, useEffect } from 'react';
import { Table } from 'antd'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import { AiOutlineClose } from "react-icons/ai";
import axios from 'axios';
import { Helmet } from 'react-helmet';

import {
    getStores,
    getStoreByID,
    addStore,
} from '../../../Helpers/Repository/StoreRepo'
import {
    validateCoordinates,
    validateGoogleMapLink,
    formatDate,
    showLoader,
} from '../../../Helpers/Utils/Common'
import '../storemanagement.css';

import { useAuth } from '../../../Helpers/Repository/AuthContext';

//assets
import { MdAdd } from "react-icons/md";
import Placeholder from '../../../Assets/placeholder_image.jpg'

function StoresList() {
    const navigate = useNavigate();
    const [toggleState, setToggleState] = useState('pending');
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("")
    const [pagination, setPagination] = useState({ pageSize: 8 });
    const { userDetails } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [loader, setLoader] = useState(false)
    const [name, setName] = useState('');
    const [owner, setOwner] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [mapLink, setMapLink] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState();
    const [placeholderText, setPlaceHolderText] = useState()
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [latitude, setLatitude] = useState()
    const [longitude, setLongitude] = useState()

    const handlePhoneNumberChange = (event) => {
        const number = event.target.value;
        setPhone(number);
        // Regular expression for validating phone numbers (supports numbers with or without country code)
        const phonePattern = /^\+?([0-9]{1,4})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        setIsPhoneValid(phonePattern.test(number));
    };

    const handleViewClick = (record) => {
        if (toggleState === 'active') {
            navigate(`/store-profile/${record.id}`);
        }
        else if (toggleState === 'pending' || toggleState === 'rejected') {
            navigate(`/account-request/${record.id}`);
        } else {

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
        setOwner('')
        setPhone('')
        setMapLink('')
        setLatitude('')
        setLongitude('')
        setLoader(false)
    }

    const handleSubmitClick = async () => {
        try {
            if (!name || !owner || !address || !email || !password || !phone || !mapLink || !latitude || !longitude) {
                toast.info("Fill in all the required fields")
                return;
            }

            if (!isPhoneValid) {
                toast.info("Invalid phone number")
                return;
            }

            if (!validateGoogleMapLink(mapLink)) {
                toast.info("Invalid google map link")
                return;
            }

            if (validateCoordinates(latitude, longitude) === false) {
                toast.info("Latitude and Longitude must contain only numbers");
                return;
            }

            const lat = parseFloat(latitude);
            const long = parseFloat(longitude);

            setLoader(true)
            const success = await addStore(email, password, {
                name,
                owner,
                address: address,
                phone: phone,
                googleMapLocation: mapLink,
                coordinates: {
                    latitude: lat,
                    longitude: long
                }
            });

            if (success) {
                const emailContent = {
                    to: email,
                    subject: 'Welcome to Hygieia',
                    text: message
                };
                await axios.post('https://hygieia-back-end-node.onrender.com/send-email', emailContent);
                setLoader(false);
                setModalOpen(false);
                toast.success("Store Added Successfully. Confirmation email sent successfully.");
                clearFields();
                fetchData();
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

    const handleTableChange = pagination => {
        setPagination(pagination);
    };

    const handleSearchInputChange = (event) => {
        setSearch(event.target.value)
    }

    const fetchStoreByID = async () => {
        try {
            if (!search) {
                toast.error("Please s ply an ID")
                return;
            }

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
            key: 0,
            title: 'Store ID',
            dataIndex: 'storeId'
        },
        {
            key: 1,
            title: 'Profile',
            dataIndex: 'photo',
            render: photo => (
                <div>
                    <img
                        src={photo || Placeholder}
                        className='rounded-full w-8 h-8' />
                </div>
            )
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
            key: 8,
            title: 'Phone',
            dataIndex: 'phone'
        },
        {
            key: 4,
            title: 'Owner',
            dataIndex: 'owner'
        },
        {
            key: 5,
            title: 'Date Joined',
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
                    <button className="view-btn" onClick={() => handleViewClick(record)}>View</button>
                </div>
            )
        },
    ]

    const pendingHeader = [
        {
            key: 1,
            title: 'Request ID',
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
            key: 8,
            title: 'Phone',
            dataIndex: 'phone'
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
                    <button className="view-btn" onClick={() => handleViewClick(record)}>View</button>
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
            key: 8,
            title: 'Phone',
            dataIndex: 'phone'
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
            key: 7,
            title: 'Status',
            dataIndex: 'status'
        },
        {
            key: 8,
            title: 'Actions',
            render: (record) => (
                <div>
                    <button className="view-btn" onClick={() => handleViewClick(record)}>View</button>
                </div>
            )
        },
    ]

    const toggleTab = (tab) => {
        setToggleState(tab)
    }

    useEffect(() => {
        fetchData();
    }, [toggleState]);

    useEffect(() => {
        setMessage(`Welcome Aboard! \n\nYou are now apart of the Hygieia program. You may use these credentials to login your account. \n\nEmail: ${email} \nPassword: ${password} \n\nYou may leave the password as is, but we recommend that you change it to a more secure password once you have logged in to your account. \n\nThank you and welcome!`);
    }, [email, password]);

    useEffect(() => {
        setSearch('')
        if (toggleState === "active") {
            setPlaceHolderText('Enter Store ID')
        }
        else {
            setPlaceHolderText('Enter Request ID')
        }
    }, [toggleState])

    return (
        <div className='page-container text-darkGray'>
            <ToastContainer />
            <Helmet>
                <title>Stores</title>
            </Helmet>
            <div className='md:mb-5 w-full me-auto justify-center md:justify-between flex flex-col gap-5 md:flex-row items-center'>
                <div className='flex me-auto justify-end flex-row items-center bg-white rounded-md border border-gray ps-2 overflow-hidden'>
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchInputChange}
                        placeholder={placeholderText}
                        className='p-1 focus-within:bg-white outline-none w-56'
                    />
                    <button type="button" className='bg-green h-full py-1 text-white px-3' onClick={() => fetchStoreByID()}>Search</button>
                    {/* <BiSearchAlt className="text-oliveGreen text-lg cursor-pointer" onClick={() => fetchStoreByID()} /> */}
                </div>
                <button className='bg-orange hover:shadow-md items-center flex flex-row text-sm text-white py-2 px-4 rounded-md w-fit' onClick={() => setModalOpen(true)}>
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

                {/* ADD STORE MODAL */}
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <div className='w-screen h-screen justify-center items-center flex text-sm text-darkGray'>
                        <div className='bg-white w-fit rounded-b-md'>
                            <div className='bg-oliveGreen text-white flex justify-between items-center p-3'>
                                <p className='font-bold text-base tracking-wide'>Add Store</p>
                                <AiOutlineClose className="hover:text-red text-2xl text-white" onClick={() => setModalOpen(false)} />
                            </div>
                            <form className='px-5 flex flex-col gap-2 py-5'>
                                <p className='font-bold'>General Information</p>
                                <div className='flex flex-row gap-3'>
                                    <div>
                                        <p className="text-sm text-gray">Store Name<span className='text-red m-0'>*</span></p>
                                        <input
                                            id='store_name'
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className='border rounded-md border-gray p-1'
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray">Owner<span className='text-red m-0'>*</span></p>
                                        <input
                                            id='owner'
                                            type="text"
                                            value={owner}
                                            onChange={(e) => setOwner(e.target.value)}
                                            className='border rounded-md border-gray p-1'
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray">Phone<span className='text-red m-0'>*</span></p>
                                        <input
                                            id='phone'
                                            type="number"
                                            value={phone}
                                            onChange={(e) => handlePhoneNumberChange(e)}
                                            className='border rounded-md border-gray p-1'
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray">Address<span className='text-red m-0'>*</span></p>
                                    <textarea
                                        id='address'
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className='border rounded-md border-gray p-1 w-full'
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-gray">Google Map link<span className='text-red m-0'>*</span></p>
                                    <textarea
                                        id='googleMapLink'
                                        type="text"
                                        value={mapLink}
                                        onChange={(e) => setMapLink(e.target.value)}
                                        className='border rounded-md border-gray p-1 w-full'
                                    />
                                </div>
                                <p className='mt-2 font-bold'>Location Coordinates</p>
                                <div className='flex flex-row gap-3'>
                                    <div>
                                        <p className="text-sm text-gray">Latitude<span className='text-red m-0'>*</span></p>
                                        <input
                                            type="number"
                                            id="lat"
                                            name="lat"
                                            value={latitude}
                                            onChange={(e) => setLatitude(e.target.value)}
                                            required
                                            className='input-field' />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray">Longitude<span className='text-red m-0'>*</span></p>
                                        <input
                                            type="number"
                                            id="long"
                                            name="long"
                                            value={longitude}
                                            onChange={(e) => setLongitude(e.target.value)}
                                            required
                                            className='input-field' />
                                    </div>
                                </div>
                                <p className='mt-2 font-bold'>Set Credentials</p>
                                <div className='flex gap-3'>
                                    <div>
                                        <p className="text-sm text-gray">Email<span className='text-red m-0'>*</span></p>
                                        <input
                                            id='email'
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className='border rounded-md border-gray p-1'
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray">Password<span className='text-red m-0'>*</span></p>
                                        <input
                                            id='password'
                                            type="text"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className='border rounded-md border-gray p-1'
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-5">
                                    <div>
                                        {loader ? (
                                            <div>{showLoader()}</div>
                                        ) : (
                                            <div>   </div>
                                        )}
                                    </div>
                                    <button type='button' className="cancel-btn w-20" onClick={() => handleCancelClick()}>Cancel</button>
                                    <button type='button' className="view-btn w-20" onClick={() => handleSubmitClick()}>Add</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default StoresList;