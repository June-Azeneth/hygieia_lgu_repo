import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Helpers/Repository/AuthContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table } from 'antd'
import { MdAdd } from "react-icons/md";
import Modal from '@mui/material/Modal';
import QRCode from "qrcode";

//ASSETS
import Placeholder from '../../Assets/placeholder_image.jpg'
import { LuRefreshCw } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";

import { showLoader, formatDate, currentDateTimestamp } from '../../Helpers/Utils/Common'

import {
    getAllConsumers,
    getByConsumerID,
    deleteConsumerRecord,
    updateConsumer,
    updateBalance,
    uploadQrCode,
    updloadToFirestore
} from '../../Helpers/Repository/ConsumerRepo';

import { addConsumer } from '../../Helpers/Repository/ClientRepo';
import { useNavigate } from 'react-router-dom';

function ConsumerList() {
    const { userDetails } = useAuth();
    const [loading, setLoading] = useState(true);
    const [loader, setLoader] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState({ pageSize: 8 });
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('')
    const [selectedRow, setSelectedRow] = useState([])
    const [confirmationDiag, setConfirmationDiag] = useState(false)
    const [action, setAction] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [barangay, setBarangay] = useState("")
    const [city, setCity] = useState("")
    const [province, setProvince] = useState("")
    const [newBalance, setBalance] = useState(0)
    const [notes, setNotes] = useState("")
    const [addConsumerModal, setAddConsumerModal] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [updateBalanceModal, setUpdateBalanceModal] = useState(false)
    const navigate = useNavigate()

    const handleTableChange = pagination => {
        setPagination(pagination);
    };

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await getAllConsumers();
            if (response) {
                const formattedData = response.map(item => ({
                    ...item,
                    dateRegistered: formatDate(item.dateRegistered)
                }));
                setDataSource(formattedData)
            } else {
                toast.error("An error occured: No data returned");
            }
            setLoading(false)
        }
        catch (error) {
            toast.error("An errow occured: " + error)
        }
    }

    const fetchByConsumerId = async () => {
        try {
            if (!search) {
                toast.error("Please enter an ID");
                return;
            }

            setLoading(true)
            const response = await getByConsumerID(search);
            if (response) {
                const { dateRegistered, ...otherFields } = response;
                const formattedDate = formatDate(dateRegistered);
                const formattedData = {
                    ...otherFields,
                    dateRegistered: formattedDate
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
            toast.error('An error occured: ' + error)
        }
    }

    const clearFields = () => {
        setFirstName("")
        setLastName("")
        setBarangay("")
        setCity("")
        setProvince("")
        setEmail("")
        setPassword("")
    }

    const addConsumerRecord = async () => {
        try {
            if (!firstName || !lastName || !barangay || !city || !province || !email || !password) {
                toast.error("Fill in all the required fields")
                return
            }
            setLoader(true)
            const uid = await addConsumer(email, password)
            if (uid) {
                QRCode.toDataURL(uid, { width: 300 }, async (_, dataUrl) => {
                    const downloadURL = await uploadQrCode(dataUrl, uid);
                    const newData = {
                        firstName: firstName,
                        lastName: lastName,
                        address: {
                            barangay: barangay,
                            city: city,
                            province: province
                        },
                        qrCode: downloadURL,
                        currentBalance: 0,
                        dateRegistered: currentDateTimestamp,
                        id: uid,
                        email: email,
                        status: "active"
                    };

                    const success = await updloadToFirestore(newData, uid);
                    if (success) {
                        setLoader(false);
                        setAddConsumerModal(false);
                        clearFields();
                        fetchData();
                    } else {
                        setLoader(false);
                        toast.error("Upload failed");
                    }
                });
            } else {
                setLoader(false);
                toast.error("An error occurred");
            }
        } catch (error) {
            setLoader(false);
            toast.error("An error occurred: " + error);
        }
    }

    const updateConsumerClick = async () => {
        try {
            if (
                firstName != selectedRow.firstName ||
                lastName != selectedRow.lastName ||
                barangay !== selectedRow.address.barangay ||
                city !== selectedRow.address.city ||
                province !== selectedRow.address.province
            ) {
                setLoader(true)
                const updatedData = {
                    firstName: firstName,
                    lastName: lastName,
                    address: {
                        barangay,
                        city,
                        province
                    },
                };
                const success = await updateConsumer(selectedRow.id, updatedData)
                if (success) {
                    toast.success("Consumer details updated!")
                    setLoader(false)
                    setModalOpen(false)
                    clearFields()
                    fetchData()
                }
                else {
                    setLoader(false)
                    setModalOpen(false)
                    toast.error("An error occured")
                }
            }
            else {
                setLoader(false)
                toast.info("No changes detected")
            }
        }
        catch (error) {
            toast.error("An error occured: " + error)
        }
    }


    const handleDeleteClick = (record) => {
        setConfirmationDiag(true)
        setSelectedRow(record)
    }

    const deleteConsumer = async () => {
        try {
            const success = await deleteConsumerRecord(selectedRow.id)

            if (success) {
                toast.success("Consumer Deleted Successfully")
                setConfirmationDiag(false)
                fetchData()
            }
            else {
                toast.error("An error occured")
            }
        }
        catch (error) {
            toast.error("An error occured: " + error)
        }
    }

    const applyChangeClick = async () => {
        try {
            if (newBalance != selectedRow.currentBalance) {
                setLoader(true)

                const trail = {
                    date: currentDateTimestamp,
                    collection: "consumer",
                    notes: notes,
                    document: selectedRow.id,
                    before: selectedRow.currentBalance,
                    after: newBalance
                };

                const success = await updateBalance(selectedRow.id, newBalance, trail)
                if (success) {
                    toast.success("Update Success")
                    setLoader(false)
                    setUpdateBalanceModal(false)
                    setModalOpen(false)
                    setNotes("")
                    setBalance(0)
                    fetchData()
                }
                else {
                    toast.error("Update Failed")
                }
            }
        }
        catch (error) {
            toast.error("An error occured: " + error)
        }
    }

    const cancelClick = (action) => {
        if (action === "balance") {
            setUpdateBalanceModal(false)
            setNotes("")
            setBalance(0)
        } else {
            setAddConsumerModal(false)
            setLoader(false)
            clearFields()
        }
    }

    const handleClick = (record, action) => {
        setModalOpen(true);
        setSelectedRow(record);
        setAction(action);

        if (action === "edit") {
            if (record.address && record.address.barangay != null) {
                setFirstName(record.firstName);
                setLastName(record.lastName);
                setBarangay(record.address.barangay);
                setCity(record.address.city);
                setProvince(record.address.province);
            } else {
                // Handle the case when address is null or barangay is null
                // You can set default values or handle it in some other way
            }
        }
    }

    const headers = [
        {
            key: 0,
            title: 'ID',
            dataIndex: 'id'
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
            title: 'Name',
            // render: (record) => `${record.firstName} ${record.lastName}`,
            render: record => {
                if (record.firstName && record.lastName && record) {
                    return `${record.firstName} ${record.lastName}`
                }
                else {
                    return "Unset"
                }
            }
        },
        {
            key: 3,
            title: 'Email',
            dataIndex: 'email'
        },
        {
            key: 4,
            title: 'Address',
            dataIndex: 'address',
            render: address => {
                if (address && address.barangay && address.city && address.province) {
                    return `${address.barangay}, ${address.city}, ${address.province}`;
                } else {
                    return 'Address not set';
                }
            }
        },
        {
            key: 5,
            title: 'Balance',
            dataIndex: 'currentBalance'
        },
        {
            key: 6,
            title: 'Registered On',
            dataIndex: 'dateRegistered'
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
                <div className='flex flex-col md:flex-row gap-2'>
                    <button className="view-btn w-16" onClick={() => handleClick(record, "view")}>View</button>
                    <button className="warning-btn w-16" onClick={() => handleClick(record, "edit")}>Edit</button>
                    <button className="danger-btn w-16" onClick={() => handleDeleteClick(record)}>Delete</button>
                </div>
            )
        }
    ]

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (userDetails && userDetails.type === "client") {
            navigate('/home')
        }
    }, [userDetails])

    return (
        <div className="page-container">
            <ToastContainer />
            <div className='w-full justify-between flex-col md:gap-0 md:flex-row flex mb-5'>
                <div className='rounded-md border border-gray h-fit overflow-hidden w-fit'>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by ID"
                        className='p-1 focus-within:bg-white outline-none w-56'
                    />
                    <button type="button" className='bg-green py-1 text-white px-3' onClick={() => fetchByConsumerId()}>Search</button>
                </div>
                <div className='flex flex-row justify-end items-center mt-6 md:mt-0'>
                    <LuRefreshCw className='cursor-pointer text-2xl me-4' onClick={() => fetchData()} />
                    <button className='bg-orange hover:shadow-md items-center flex flex-row text-sm text-white py-2 px-4 rounded-md w-fit' onClick={() => setAddConsumerModal(true)}><span className='p-0 text-lg m-0 me-2'><MdAdd /></span>Add Consumer</button>
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
            <Modal open={modalOpen} onClose={() => setModalOpen(true)}>
                <div className='w-screen h-screen justify-center flex items-center'>
                    <div className='w-fit bg-white rounded-md overflow-hidden'>
                        <div className='bg-oliveGreen text-white py-2 text-center flex flex-row items-center justify-between ps-4 pe-2'>
                            {action === "view" ?
                                (<p>Consumer Information</p>) :
                                (<p>Update Information</p>)
                            }
                            <AiOutlineClose className="cursor-pointer text-2xl" onClick={() => setModalOpen(false)} />
                        </div>
                        {action === "view" ?
                            (<div className='flex flex-row me-6'>
                                <img src={selectedRow.qrCode} alt="qr code" className="w-[13rem] h-[13rem]" />
                                <div className="flex flex-col gap-1 mt-5">
                                    <p>ID: {selectedRow.id}</p>
                                    {selectedRow.firstName != "" && selectedRow.lastName ? (
                                        <p>Name: {`${selectedRow.firstName} ${selectedRow.lastName}`}</p>
                                    ) : (
                                        <p>Name: Unset</p>
                                    )}
                                    <p>Email: {selectedRow.email}</p>
                                    {selectedRow.address.barangay != "" && selectedRow.address.province != "" && selectedRow.address.city != "" ? (
                                        <p>Address: {`${selectedRow.address.barangay}, ${selectedRow.address.city}, ${selectedRow.address.province},`}</p>
                                    ) : (
                                        <p>Address: Unset</p>
                                    )}
                                    <p>Current Balance: {selectedRow.currentBalance}</p>
                                    <p>Status : <span className='text-green m-0 uppercase'>{selectedRow.status}</span></p>
                                    <button className="view-btn my-5" onClick={() => setUpdateBalanceModal(true)}>Update Balance</button>
                                </div>
                            </div>) :
                            (<div className="p-5 flex flex-col gap-3">
                                <div className="flex flex-row gap-3">
                                    <div>
                                        <p className="text-sm text-gray">First Name</p>
                                        <input
                                            id=""
                                            name=""
                                            autoComplete='false'
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray">Last Name</p>
                                        <input
                                            id=""
                                            name=""
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row gap-3">
                                    <div>
                                        <p className="text-sm text-gray">Barangay</p>
                                        <input
                                            id=""
                                            name=""
                                            type="text"
                                            value={barangay}
                                            onChange={(e) => setBarangay(e.target.value)}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray">City</p>
                                        <input
                                            id=""
                                            name=""
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray">Province</p>
                                        <input
                                            type="text"
                                            value={province}
                                            onChange={(e) => setProvince(e.target.value)}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex flex-row gap-4 justify-end">
                                    {loader ? (
                                        <div>
                                            {showLoader()}
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                    <button className="cancel-btn w-20" onClick={() => setModalOpen(false)}>Cancel</button>
                                    <button className='view-btn w-20' onClick={() => updateConsumerClick()}>Update</button>
                                </div>
                            </div>)}
                    </div>
                </div>
            </Modal>
            <Modal open={confirmationDiag} onClose={() => setConfirmationDiag(false)}>
                <div className='w-screen h-screen justify-center flex items-center'>
                    <div className='w-96 bg-white rounded-md overflow-hidden'>
                        <div className='bg-red text-white py-2 text-center'>WARNING!</div>
                        <div className="p-5">
                            <p>Are you sure you want to delete this consumer?</p>
                            <div className='flex flex-row justify-end gap-3 mt-5'>
                                <button className='border border-gray rounded-md w-14 hover:bg-gray hover:text-white' onClick={() => setConfirmationDiag(false)}>No</button>
                                <button className='cancel-btn w-14' onClick={() => deleteConsumer()}>Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal open={updateBalanceModal} onClose={() => setUpdateBalanceModal(false)}>
                <div className='w-screen h-screen justify-center flex items-center'>
                    <div className='w-96 bg-white rounded-md overflow-hidden'>
                        <div className='bg-orange text-white py-2 text-center'>Update Customer Balance</div>
                        <div className="p-5">
                            <p>Current Balance: {selectedRow.currentBalance}</p>
                            <p className="text-sm text-gray mt-4">New Balance <span className='text-red m-0'>*</span></p>
                            <input
                                type="text"
                                value={newBalance}
                                onChange={(e) => setBalance(e.target.value)}
                                className='input-field'
                                required
                            />
                            <p className="text-sm text-gray mt-4">Details <span className='text-red m-0'>*</span></p>
                            <textarea
                                name="notes"
                                id="notes"
                                placeholder='Full detail about this update'
                                value={notes}
                                required
                                onChange={(e) => setNotes(e.target.value)}
                                className='input-field w-full'>
                            </textarea>
                            <div className='flex flex-row justify-end gap-3 mt-5'>
                                {loader ? (
                                    <div>
                                        {showLoader()}
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                                <button className='border border-gray rounded-md w-fit px-3 hover:bg-gray hover:text-white' onClick={() => cancelClick("balance")}>Cancel</button>
                                <button className='view-btn w-fit' onClick={() => applyChangeClick()}>Apply Change</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal open={addConsumerModal} onClose={() => addConsumerModal(false)}>
                <div className='w-screen h-screen justify-center flex items-center text-darkGray'>
                    <div className='w-fit bg-white rounded-md overflow-hidden'>
                        <div className='bg-oliveGreen font-bold text-white py-2 text-center flex flex-row items-center justify-center'>Add Consumer</div>
                        <p className='font-bold my-3 mx-5'>General Information</p>
                        <div className='flex flex-row justify-end gap-3 mx-5'>
                            <form className='flex flex-col gap-3 w-full'>
                                <div className='flex flex-row gap-3'>
                                    <div>
                                        <p className="text-sm text-gray">First Name <span className='text-red m-0'>*</span></p>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            className='input-field' />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray">Last Name <span className='text-red m-0'>*</span></p>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                            className='input-field' />
                                    </div>
                                </div>
                                <div className="flex flex-row gap-3">
                                    <div>
                                        <p className="text-sm text-gray">Address (Barangay)<span className='text-red m-0'>*</span></p>
                                        <input
                                            type="text"
                                            id="barangay"
                                            name="barangay"
                                            value={barangay}
                                            onChange={(e) => setBarangay(e.target.value)}
                                            required
                                            className='input-field' />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray">City<span className='text-red m-0'>*</span></p>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            required
                                            className='input-field' />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray">Province<span className='text-red m-0'>*</span></p>
                                        <input
                                            type="text"
                                            id="province"
                                            name="province"
                                            value={province}
                                            onChange={(e) => setProvince(e.target.value)}
                                            required
                                            className='input-field' />
                                    </div>
                                </div>
                                <p className='font-bold'>Set Credentials</p>
                                <div className='flex flex-row gap-3'>
                                    <div>
                                        <p className="text-sm text-gray">Email<span className='text-red m-0'>*</span></p>
                                        <input
                                            type="text"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className='input-field' />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray">Password<span className='text-red m-0'>*</span></p>
                                        <input
                                            type="text"
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className='input-field' />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className='flex flex-row gap-3 w-full justify-end mt-3 py-3 px-5'>
                            {loader ? (
                                <div>
                                    {showLoader()}
                                </div>
                            ) : (
                                <div></div>
                            )}
                            <button className='border border-gray rounded-md w-fit px-3 hover:bg-gray hover:text-white' onClick={() => cancelClick("add")}>Cancel</button>
                            <button className='view-btn w-fit' onClick={() => addConsumerRecord()}>Submit</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ConsumerList
