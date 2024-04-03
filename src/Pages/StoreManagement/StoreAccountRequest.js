import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@mui/material/Modal';
import { AiOutlineClose } from "react-icons/ai";
import { PulseLoader } from 'react-spinners';
import { useAuth } from '../../Helpers/Repository/AuthContext';
import axios from 'axios';
import { Helmet } from 'react-helmet';

import {
    getStore,
    registerStore,
    rejectStoreApplication
} from '../../Helpers/Repository/StoreRepo';

import {
    showLoader,
    formatDate
} from '../../Helpers/Utils/Common';

const StoreAccountRequest = () => {
    const [toggle, setToggle] = useState(false)
    const [isModalOpen, seTIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const { id } = useParams();
    const navigate = useNavigate();
    const { userDetails } = useAuth();
    const [requestDetails, setRequestDetails] = useState(null);
    const [loader, setLoader] = useState(false)
    const [side, setSide] = useState("");
    const [decision, setDecision] = useState("");
    const [password, setPassword] = useState("");
    const [subject, setSubject] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(``);
    const [isDecisionModalOpen, setDecisionModalOpen] = useState(false)

    // function handleBackToDashboard() {
    //     navigate('/dashboard');
    // }

    const fetchData = async () => {
        try {
            setLoading(true);
            const requestDetails = await getStore(id);
            setRequestDetails(requestDetails);
            setEmail(requestDetails.email)
        } catch (error) {
            toast.error("An error occurred: " + error);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleDecisionClick = (decision) => {
        setDecision(decision)
        if (decision === "approve") {
            setSubject("Account Registration Approved")
        }
        else {
            setSubject("Account Registration Rejected")
        }
        setDecisionModalOpen(true)
    }

    const handleImageClick = (side) => {
        seTIsModalOpen(true)
        setSide(side)
    }

    const clearFields = () => {
        setMessage("")
        setPassword("")
    }

    const handleCancelClick = (event) => {
        if (event === "cancel_modal") {
            setDecisionModalOpen(false)
            clearFields()
            return;
        }

        if (event === "cancel_action") {
            navigate('/store')
            return;
        }
    }

    const handleMessageChange = (event) => {
        setMessage(event.target.value)
    }

    async function handleSubmitClick(event) {
        event.preventDefault();
        try {
            setLoader(true)
            if (decision === "approve") {
                if (!password) {
                    toast.error("Password Required");
                    return;
                }
                if (!subject) {
                    toast.error("Subject Required");
                    return;
                }
                if (!message) {
                    toast.error("Message Required. Please compose an email");
                    return;
                }

                const emailContent = {
                    to: email,
                    subject: subject,
                    text: message
                };

                await registerStore(requestDetails.id, email, password).catch(error => {
                    throw error;
                });
                await axios.post('https://hygieia-back-end-node.onrender.com/send-email', emailContent);
                toast.success('Email sent successfully \nStore account created');
                setLoader(false)
                setDecisionModalOpen(false);
                clearFields();
                setTimeout(() => {
                    navigate('/store');
                }, 3000);
            } else {
                if (!subject) {
                    toast.error("Subject Required");
                    return;
                }
                if (!message) {
                    toast.error("Message Required. Please compose an email");
                    return;
                }

                const emailContent = {
                    to: email,
                    subject: subject,
                    text: message
                };

                await axios.post('https://hygieia-back-end-node.onrender.com/send-email', emailContent);
                await rejectStoreApplication(requestDetails.id, message).catch(error => {
                    throw error;
                });

                setDecisionModalOpen(false);
                clearFields();
                toast.success('Email sent successfully');
                setTimeout(() => {
                    navigate('/store');
                }, 3000);
            }
        } catch (error) {
            toast.error("Failed: " + error.message);
        }
    }

    useEffect(() => {
        fetchData();
    }, [id, userDetails]);

    useEffect(() => {
        if (decision === 'approve') {
            setMessage(`Welcome Aboard! \n\nYour account is now approved. You may use these credentials to open your account. \n\nEmail: ${requestDetails.email} \nPassword: ${password} \n\nYou may leave the password as is, but we recommend that you change it to a more secure password once you have logged in to your account. \n\nThank you and welcome! \n\nRegards,`);
        } else {
            setMessage(``)
        }
    }, [email, decision, password]);

    return (
        <div className='page-container'>
            <Helmet>
                <title>Req. No: {requestDetails.id}</title>
            </Helmet>
            {loading ? (
                <div className='w-full flex justify-center items-center h-36'>
                    {showLoader()}
                </div>
            ) : (
                <div className='bg-white rounded-md px-3 lg:mx-32 lg:px-10 py-4 shadow-md'>
                    <ToastContainer />
                    <p className='w-full text-center pt-3 font-bold text-xl'>Store Account Registration</p>
                    <p className='w-full text-center'>Request No: {requestDetails.id}</p>
                    <div className='flex flex-col md:flex-row'>
                        <div className='w-full mt-10 md:text-end lg:order-2'>
                            <p>Submitted On: {formatDate(requestDetails.dateSubmitted)}</p>
                            <p>Status: <span className={`uppercase font-bold ${requestDetails.status === 'pending' ? 'text-orange' : requestDetails.status === 'rejected' ? 'text-red' : ''}`}>{requestDetails.status}</span></p>
                        </div>
                        <div className='w-full'>
                            <p className='mt-10 mb-5'>General Information</p>
                            <p>Store Name: {requestDetails.name}</p>
                            <p>Address: {`${requestDetails.address.sitio} ${requestDetails.address.barangay}, ${requestDetails.address.city}, ${requestDetails.address.province}`}</p>
                            <p>Owner: {requestDetails.owner}</p>
                            <p>Email: {requestDetails.email}</p>
                            <p>LGU ID: {requestDetails.lguId}</p>
                        </div>
                    </div>
                    <p className='mt-5 font-bold'>Valid ID</p>
                    <p>Type: {requestDetails.idType}</p>
                    <div className='flex flex-row gap-3'>
                        <div className='relative w-full rounded-md overflow-hidden' onClick={() => handleImageClick("front")} >
                            <img className='w-full h-[20rem] bg-gray object-cover' src={requestDetails.validIdFront} alt="valid id front" />
                            <div className='absolute bg-black opacity-30 w-full h-full top-0'>
                                <div className='flex justify-center items-center w-full h-full text-white font-bold'>
                                    Front
                                </div>
                            </div>
                        </div>
                        <div className='relative w-full rounded-md overflow-hidden' onClick={() => handleImageClick("back")} >
                            <img className='w-full h-[20rem] bg-gray object-cover' src={requestDetails.validIdBack} alt="valid id front" />
                            <div className='absolute bg-black opacity-30 w-full h-full top-0'>
                                <div className='flex justify-center items-center w-full h-full text-white font-bold'>
                                    Back
                                </div>
                            </div>
                        </div>
                    </div>
                    {requestDetails.status === "pending" ? (
                        <div className='flex gap-3 flex-row mt-10 justify-center md:justify-end mb-10'>
                            <button className='py-2 px-3 w-32 rounded-md  hover:bg-gray hover:text-white border border-gray' onClick={() => handleCancelClick("cancel_action")}>Cancel</button>
                            <button className='py-2 px-3 w-32 rounded-md text-red border border-red hover:bg-red hover:text-white' onClick={() => handleDecisionClick("reject")}>Reject</button>
                            <button className='py-2 px-3 w-32 rounded-md text-white bg-oliveGreen' onClick={() => handleDecisionClick("approve")}>Approve</button>
                        </div>
                    ) : (
                        <div className='flex gap-3 flex-row my-10'>
                            <p>Reason For Rejection: <span className='text-red'>{requestDetails.reason}</span></p>
                        </div>
                    )}
                </div>
            )}

            <Modal open={isModalOpen} onClose={() => seTIsModalOpen(false)}>
                {requestDetails != null ? (
                    <div className="flex w-screen h-screen justify-center items-center" onClick={() => seTIsModalOpen(false)}>
                        <img src={side === "front" ? requestDetails.validIdFront : requestDetails.validIdBack} alt={side === "front" ? "valid id front" : "valid id back"} />
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </Modal>

            <Modal open={isDecisionModalOpen} onClose={() => setDecisionModalOpen(false)}>
                <div className='w-screen h-screen flex justify-center items-center'>
                    {requestDetails != null ? (
                        <div>
                            {decision === "approve" ? (
                                <div className='bg-white rounded-md px-5 pt-3 pb-5 w-[40rem]'>
                                    <AiOutlineClose className="text-2xl hover:text-red ms-auto" onClick={() => setDecisionModalOpen(false)} />
                                    <p className="font-bold">Compose Email</p>
                                    <form>
                                        <div className="flex flex-row gap-2 mt-2">
                                            <p>Subject: </p>
                                            <input
                                                id='subject'
                                                name='subject'
                                                value={subject}
                                                type="text"
                                                onChange={e => setSubject(e.target.value)}
                                                required
                                                className='px-1 border border-gray rounded-sm mb-2 w-1/2'
                                            />
                                        </div>
                                        <textarea
                                            id='message'
                                            name='message'
                                            typeof='text'
                                            value={message}
                                            onChange={handleMessageChange}
                                            className='p-3 h-36 border border-gray rounded-sm w-full'
                                            required
                                        />
                                        <p className='mt-5 font-bold'>Set Account Credentials</p>
                                        <input
                                            id='email'
                                            name='email'
                                            value={requestDetails.email}
                                            type="text"
                                            required
                                            className='px-1 border h-10 border-gray rounded-sm'
                                        />
                                        <input
                                            id='email'
                                            name='email'
                                            value={password}
                                            type="text"
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder='Set Password'
                                            className='px-1 border h-10 border-gray rounded-sm ms-4'
                                        />
                                        <div className="flex gap-3 flex-row mt-10 justify-end">
                                            <div>
                                                {loader ? (
                                                    <div>{showLoader()}</div>
                                                ) : (
                                                    <div>   </div>
                                                )}
                                            </div>
                                            <button className="w-36 py-2 border-red border text-red hover:text-white hover:bg-red rounded-md" onClick={() => handleCancelClick("cancel_modal")}>Cancel</button>
                                            <button className="w-36 py-2 bg-oliveGreen text-white rounded-md" onClick={(e) => handleSubmitClick(e)}>Submit</button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className='bg-white rounded-md px-5 pt-3 pb-5 w-[40rem]'>
                                    <AiOutlineClose className="text-2xl hover:text-red ms-auto" onClick={() => setDecisionModalOpen(false)} />
                                    <form>
                                        <p className="font-bold">Compose Email</p>
                                        <div className="flex flex-row gap-2 mt-2">
                                            <p>Subject: </p>
                                            <input
                                                id='subject'
                                                name='subject'
                                                value={subject}
                                                type="text"
                                                onChange={e => setSubject(e.target.value)}
                                                required
                                                className='px-1 border border-gray rounded-sm mb-2 w-1/2'
                                            />
                                        </div>
                                        <textarea
                                            id='message'
                                            name='message'
                                            typeof='text'
                                            value={message}
                                            onChange={handleMessageChange}
                                            placeholder='State the reason for rejection in detail'
                                            className='p-3 h-36 border border-gray rounded-sm w-full'
                                            required
                                        />
                                        <div className="flex gap-3 flex-row mt-10 justify-end">
                                            <div>
                                                {loader ? (
                                                    <div>{showLoader()}</div>
                                                ) : (
                                                    <div>   </div>
                                                )}
                                            </div>
                                            <button className="w-36 py-2 border-red border text-red hover:text-white hover:bg-red rounded-md" onClick={() => handleCancelClick("cancel_modal")}>Cancel</button>
                                            <button className="w-36 py-2 bg-oliveGreen text-white rounded-md" onClick={(e) => handleSubmitClick(e)}>Submit</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            </Modal>
        </div>
    )
}

export default StoreAccountRequest
