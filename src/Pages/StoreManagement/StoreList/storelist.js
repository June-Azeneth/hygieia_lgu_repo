import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Table from '../../../Components/Table/Table';
import TablePagination from '@mui/material/TablePagination';
import Modal from '@mui/material/Modal';
import { IoCloseCircleOutline } from "react-icons/io5";
import axios from 'axios';

import {
    getStores,
    registerStore,
    rejectStoreApplication
} from '../../../Helpers/Context/StoreRepo'
import {
    formatDate,
    TabPanel,
    showLoader,
    showNoDataView,
} from '../../../Helpers/Utils/Common'

import '../storemanagement.css';

function StoreList() {
    const [loading, setLoading] = useState(true);
    const [isloading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;
    const [value, setValue] = useState("Pending");
    const [selectedRowData, setSelectedRowData] = useState([]); // State to store data of the selected row
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage the visibility of the modal
    const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
    const [decision, setDecision] = useState("")
    const [subject, setSubject] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState(``);
    const [reason, setReason] = useState('')
    const [filter, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [isImageEnlarged, setIsImageEnlarged] = useState(false);

    const handleImageClick = () => {
        setIsImageEnlarged(!isImageEnlarged); // Toggle the state when the image is clicked
    };


    //for decision modal

    const handleMessageChange = (event) => {
        setMessage(event.target.value); // Update the email state with the new value
    };

    const handleSubjectChange = (event) => {
        setSubject(event.target.value); // Update the email state with the new value
    };

    const handleReasonChange = (event) => {
        setReason(event.target.value); // Update the email state with the new value
    };

    const clearFields = () => {
        setMessage("")
        setReason("")
    }

    //for decision modal


    const fetchData = async () => {
        const response = await getStores();
        setData(response);
        setLoading(false);
    };

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChange = (event, newValue) => {
        if (newValue !== value) {
            setLoading(true);
            fetchData();
            setValue(newValue);
            setLoading(false);
        }
    };

    const setColumns = () => {
        switch (value) {
            case "Active":
                return ['ID', 'Shop Name', 'Email', 'Owner', 'Approved On', 'Status', 'Actions'];
            case "Pending":
                return ['ID', 'Shop Name', 'Email', 'Owner', 'Submitted On', 'Status', 'Actions'];
            case "Rejected":
                return ['ID', 'Shop Name', 'Email', 'Owner', 'Rejected On', 'Status', 'Reasons', 'Actions'];
            default:
                return [];
        }
    };
    const columns = setColumns();

    const renderRow = (item) => {
        switch (value) {
            case "Active":
                return (
                    <>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.owner}</td>
                        <td>{formatDate(item.dateJoined)}</td>
                        <td className='text-green'>{item.status}</td>
                        <td>
                            <div className='flex justify-center'>
                                <button className='bg-green px-4 py-1 text-white rounded-md'>View</button>
                            </div>
                        </td>
                    </>
                );
            case "Pending":
                return (
                    <>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.owner}</td>
                        <td>{formatDate(item.dateSubmitted)}</td>
                        <td className='text-orange'>{item.status}</td>
                        <td>
                            <button className='bg-green px-4 py-1 text-white rounded-md' onClick={() => handleReviewButtonClick(item)}>Review</button>
                        </td>
                    </>
                );
            case "Rejected":
                return (
                    <>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.owner}</td>
                        <td>{formatDate(item.dateRejected)}</td>
                        <td className='text-red'>{item.status}</td>
                        <td>{item.reason}</td>
                        <td>
                            <div className="flex gap-3 justify-center w-full h-full">
                                <button className='bg-green px-4 py-1 text-white rounded-md'>View</button>
                                <button className='bg-orange px-4 py-1 text-white rounded-md'>Accept</button>
                            </div>
                        </td>
                    </>
                );
            default:
                return null;
        }
    };

    const filterDataBasedOnStatus = () => {
        let filteredData = [];
        let filteredDataLength = 0;

        switch (value) {
            case "Active":
                filteredData = data.filter(item => item.status === 'active');
                filteredDataLength = filteredData.length;
                break;
            case "Pending":
                filteredData = data.filter(item => item.status === 'pending');
                filteredDataLength = filteredData.length;
                break;
            case "Rejected":
                filteredData = data.filter(item => item.status === 'rejected');
                filteredDataLength = filteredData.length;
                break;
            default:
                filteredData = data;
                filteredDataLength = data.length;
        }

        return { filteredData, filteredDataLength };
    };
    const { filteredData, filteredDataLength } = filterDataBasedOnStatus();

    const handleReviewButtonClick = (rowData) => {
        setSelectedRowData(rowData);
        setIsModalOpen(true);
        setEmail(rowData.email)
    };

    const handleAcceptButtonClick = () => {
        setDecision('approve')
        setSubject('Account Registration Approved')
        setIsDecisionModalOpen(true)
    };

    const handleRejectButton = () => {
        setDecision('reject')
        setSubject('Account Registration Rejected')
        setIsDecisionModalOpen(true)
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (decision === 'approve') {
            setMessage(`Welcome Aboard! \n\nYour account is now approved. You may use these credentials to open your account. \n\nEmail: ${selectedRowData.email} \nPassword: 123456 \n\nYou may leave the password as is, but we recommend that you change it to a more secure password once you have logged in to your account. \n\nThank you and welcome! \n\nLGU NAME HERE`);
        } else {
            setMessage(``)
        }
    }, [email, decision]);

    const handleApproveSubmit = async (e) => {
        try {
            setIsLoading(true);
            const emailContent = {
                to: email,
                subject: subject,
                text: message
            };
            await axios.post('https://hygieia-back-end-node.onrender.com/send-email', emailContent);
            registerStore(selectedRowData.id, email);
            setIsLoading(false);
            setIsDecisionModalOpen(false);
            setIsModalOpen(false);
            clearFields();
            alert('Email sent successfully \nStore account created');
        } catch (error) {
            setIsLoading(false);
            alert('Failed to send email');
        }
    };
    
    const handleRejectSubmit = async (e) => {
        try {
            setIsLoading(true);
            const emailContent = {
                to: email,
                subject: subject,
                text: message
            };
            await axios.post('https://hygieia-back-end-node.onrender.com/send-email', emailContent);
            rejectStoreApplication(selectedRowData.id, message)
            setIsLoading(false);
            setIsDecisionModalOpen(false);
            setIsModalOpen(false);
            clearFields();
            alert('Email sent successfully');
        } catch (error) {
            setIsLoading(false);
            alert('Failed to send email');
        }
    };    

    useEffect(() => {
        filterData();
    }, [searchQuery, filteredData]);

    const filterData = () => {
        const filtered = data.filter(item => {
            // Filter based on your criteria, e.g., item.storeName.includes(searchQuery)
            // You can adjust this to match your search requirements
            // return item.name.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredData(filtered);
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="p-5 md:pl-24 overflow-hidden">
            {/* <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search by store name..."
            /> */}
            <Box sx={{ width: '100%' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Active" value="Active" />
                    <Tab label="Pending" value="Pending" />
                    <Tab label="Rejected" value="Rejected" />
                </Tabs>
                <TabPanel value={value} index={"Active"} className="bg-white rounded-md shadow-md">
                    {loading ? (
                        <div className='w-full h-full flex justify-center p-10'>
                            {showLoader()}
                        </div>
                    ) : filteredDataLength === 0 ? (
                        <div className='w-full h-full flex justify-center p-10'>{showNoDataView()}</div>
                    ) : (
                        <div>
                            <div className='table-container'>
                                <Table columns={columns} data={filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} renderRow={renderRow} />
                            </div>
                            <TablePagination
                                rowsPerPageOptions={[]}
                                component="div"
                                count={filteredDataLength}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                // Disable the rows per page change handler by passing an empty function
                                onRowsPerPageChange={() => { }}
                            />
                        </div>
                    )}
                </TabPanel>
                <TabPanel value={value} index={"Pending"} className="bg-white rounded-md shadow-md">
                    {loading ? (
                        <div className='w-full h-full flex justify-center p-10'>
                            {showLoader()}
                        </div>
                    ) : filteredDataLength === 0 ? (
                        <div className='w-full h-full flex justify-center p-10'>{showNoDataView()}</div>
                    ) : (
                        <div>
                            <div className='table-container'>
                                <Table columns={columns} data={filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} renderRow={renderRow} />
                            </div>
                            <TablePagination
                                rowsPerPageOptions={[]}
                                component="div"
                                count={filteredDataLength}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                // Disable the rows per page change handler by passing an empty function
                                onRowsPerPageChange={() => { }}
                            />
                        </div>
                    )}
                </TabPanel>
                <TabPanel value={value} index={"Rejected"} className="bg-white rounded-md shadow-md">
                    {loading ? (
                        <div className='w-full h-full flex justify-center p-10'>
                            {showLoader()}
                        </div>
                    ) : filteredDataLength === 0 ? (
                        <div className='w-full h-full flex justify-center p-10'>{showNoDataView()}</div>
                    ) : (
                        <div>
                            <div className='table-container'>
                                <Table columns={columns} data={filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} renderRow={renderRow} />
                            </div>
                            <TablePagination
                                rowsPerPageOptions={[]}
                                component="div"
                                count={filteredDataLength}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                // Disable the rows per page change handler by passing an empty function
                                onRowsPerPageChange={() => { }}
                            />
                        </div>
                    )}
                </TabPanel>
            </Box>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="modal-content flex justify-center items-center w-screen h-screen">
                    {selectedRowData !== null && typeof selectedRowData.address === 'object' && (
                        <div className="bg-white w-[50rem] rounded-md overflow-hidden">
                            <div className='bg-green text-white font-bold px-3 py-2 flex flex-row items-center justify-between'>
                                Review Store Account Registration
                                <span className="w-7 h-auto cursor-pointer" onClick={() => setIsModalOpen(false)}><IoCloseCircleOutline className="w-full h-full" /></span>
                            </div>
                            <div className=" p-5">
                                <div className='flex flex-row justify-between'>
                                    <div className="w-full">
                                        <p className='font-bold'>ID: {selectedRowData.id}</p>
                                        <p>Shop Name: {selectedRowData.name}</p>
                                        <p>Owner: {selectedRowData.owner}</p>
                                        <p>Address: {Object.values(selectedRowData.address).join(', ')}</p>
                                        <p>Submitted On: {formatDate(selectedRowData.dateSubmitted)}</p>
                                        <p>Valid Id: {selectedRowData.idType}</p>
                                    </div>
                                    <div className="w-full flex justify-end items-start gap-2">
                                        <button className='p-2 rounded-md bg-green text-white' onClick={() => handleAcceptButtonClick()}>Approve</button>
                                        <button className='py-2 px-4 rounded-md bg-red text-white' onClick={() => handleRejectButton()}>Reject</button>
                                    </div>
                                </div>
                                <div className='flex flex-row gap-2 h-[20rem] mt-5'>
                                    <img
                                        className='w-full h-full object-cover cursor-pointer'
                                        src={selectedRowData.validIdFront}
                                        onClick={handleImageClick} alt=""
                                    />
                                    <img
                                        className='w-full h-full object-cover cursor-pointer'
                                        src={selectedRowData.validIdBack}
                                        onClick={handleImageClick} alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
            <Modal open={isDecisionModalOpen} onClose={() => setIsDecisionModalOpen(false)}>
                {selectedRowData !== null && (
                    <div className="modal-content flex justify-center items-center w-screen h-screen">
                        <div className="bg-white overflow-hidden rounded-md w-[40rem]">
                            {decision === "approve" && (
                                <>
                                    <div className='bg-green text-white font-bold px-3 py-2 flex flex-row items-center justify-between'>
                                        Approve Store
                                        <span className="w-7 h-auto cursor-pointer" onClick={() => setIsDecisionModalOpen(false)}><IoCloseCircleOutline className="w-full h-full" /></span>
                                    </div>
                                    <form action="" className='w-full p-4'>
                                        <p>To: {selectedRowData.email}</p>
                                        <p>From: LGU Name Here</p>
                                        <div className='flex flex-row'>
                                            <p>Subject:</p>
                                            <input
                                                type="text"
                                                value={subject}
                                                onChange={handleSubjectChange}
                                                className='w-full ms-1 border border-gray-200 bg-gray-100 ps-2'
                                            />
                                        </div>
                                        <textarea
                                            value={message}
                                            onChange={handleMessageChange}
                                            className='w-full bg-gray-100 border border-gray-200 p-2 h-72 mt-3'
                                        />
                                        <div className="flex flex-row w-full justify-end gap-2 items-center">
                                            {isloading && showLoader()}
                                            <button
                                                type='button'
                                                onClick={handleApproveSubmit}
                                                className='px-5 ms-2 text-white rounded-md py-2 bg-green'>Send and Create Store Account</button>
                                            <button
                                                className='px-3 text-white rounded-md py-2 bg-red'
                                                onClick={() => setIsDecisionModalOpen(false)}>Cancel</button>
                                        </div>
                                    </form>
                                </>
                            )}
                            {decision === "reject" && (
                                <>
                                    <div className='bg-red text-white font-bold px-3 py-2 flex flex-row items-center justify-between'>
                                        Reject Store
                                        <span className="w-7 h-auto cursor-pointer" onClick={() => setIsDecisionModalOpen(false)}><IoCloseCircleOutline className="w-full h-full" /></span>
                                    </div>
                                    <form className='w-full p-4'>
                                        <p>To: {selectedRowData.email}</p>
                                        <p>From: LGU Name Here</p>
                                        <div className='flex flex-row'>
                                            <p>Subject:</p>
                                            <input
                                                type="text"
                                                value={subject}
                                                onChange={handleSubjectChange}
                                                className='w-full ms-1 border border-gray-200 bg-gray-100 ps-2'
                                            />
                                        </div>

                                        {/* <div className='flex flex-row'>
                                            <p>Reason:</p>
                                            <input
                                                type="text"
                                                value={reason}
                                                onChange={handleReasonChange}
                                                className='w-full ms-1 border border-gray-200 bg-gray-100 ps-2'
                                            />
                                        </div> */}

                                        <textarea
                                            value={message}
                                            placeholder='State the reason for rejection in detail'
                                            onChange={handleMessageChange}
                                            className='w-full bg-gray-100 border border-gray-200 p-2 h-72 mt-3'
                                        />
                                        <div className="flex flex-row w-full justify-end gap-2 items-center">
                                            {isloading && showLoader()}
                                            <button
                                                type='button'
                                                onClick={handleRejectSubmit}
                                                className='px-5 text-white ms-3 rounded-md py-2 bg-green'>Send</button>
                                            <button
                                                className='px-3 text-white rounded-md py-2 bg-red'
                                                onClick={() => setIsDecisionModalOpen(false)}>Cancel</button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )
                }
            </Modal >
        </div >
    );
}

export default StoreList;
