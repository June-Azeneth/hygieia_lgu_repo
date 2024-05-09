import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Helpers/Repository/AuthContext'
import { Table } from 'antd'
import { LuRefreshCw } from "react-icons/lu";
import { ToastContainer, toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';

import {
    showLoader,
    formatDate
} from '../../Helpers/Utils/Common'

import {
    getAllAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
    createAnnouncement
} from '../../Helpers/Repository/AnnouncementRepo';

import { currentDateTimestamp } from '../../Helpers/Utils/Common';

const Announcement = () => {
    const { currentUser } = useAuth()
    const [dataSource, setDataSource] = useState([])
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [loading, setLoading] = useState(false)
    const [loader, setLoader] = useState(false)
    const [pagination, setPagination] = useState({ pageSize: 8 });
    const [selectedRow, setSelectedRow] = useState([])
    const [action, setAction] = useState("add")
    const [confirmationDiag, setConfirmationDiag] = useState(false)

    const handleTableChange = pagination => {
        setPagination(pagination);
    };

    const fetchData = async () => {
        setLoading(true)
        const response = await getAllAnnouncements()
        if (response) {
            const formattedData = response.map(item => ({
                ...item,
                datePosted: formatDate(item.datePosted)
            }));
            setLoading(false)
            setDataSource(formattedData)
        } else {
            setLoading(false)
            toast.error("An error occured: No data returned");
        }
    }

    const addAnnouncement = async () => {
        try {
            if (title === "" || body === "") {
                toast.info("Input all required fields")
                return
            }

            setLoader(true)
            const data = {
                title: title,
                body: body,
                datePosted: currentDateTimestamp,
                status: 'active'
            }
            const success = await createAnnouncement(data)
            if (success) {
                clearFields()
                toast.success("Success!")
                setLoader(false)
                fetchData()
            }
            else {
                toast.success("An error occured!")
                setLoader(false)
            }
        }
        catch (error) {
            setLoader(false)
            toast.error("An error occured: No data returned");
        }
    }

    const clearFields = () => {
        setAction("add")
        setTitle("")
        setBody("")
    }

    const handleDeleteClick = async (record) => {
        setSelectedRow(record)
        setConfirmationDiag(true)
    }

    const deleteAnnouncementRecord = async () => {
        try {
            setLoading(true)
            const success = await deleteAnnouncement(selectedRow.id)
            if (success) {
                setLoading(false)
                setConfirmationDiag(false)
                fetchData()
            }
            else {
                fetchData()
                setLoading(false)
            }
        }
        catch (error) {
            setLoading(false)
            toast.error("An error occured: " + error)
        }
    }

    const handleUpdateClick = async (record) => {
        setAction("update")
        setSelectedRow(record)
        setTitle(record.title)
        setBody(record.body)
    }

    const updateAnnouncementRecord = async () => {
        try {
            if (!title || !body) {
                toast.info("Input all required fields")
                return
            }
            setLoading(true)
            const updateData = {
                title: title,
                body: body
            }
            const success = await updateAnnouncement(selectedRow.id, updateData)
            if (success) {
                setAction("add")
                fetchData()
                clearFields()
                setLoading(false)
            }
            else {
                setLoading(false)
            }
        }
        catch (error) {
            toast.error("An error occured: " + error)
        }
    }

    const headers = [
        {
            index: 0,
            title: "Title",
            dataIndex: 'title'
        },
        {
            index: 1,
            title: "Body",
            dataIndex: 'body',
            render: (text) => {
                const lines = text.split('\n'); // Split the text into lines
                const truncatedText = lines.slice(0, 2).join('\n'); // Get the first two lines
                return truncatedText;
            }
        },
        {
            index: 2,
            title: "Date Posted",
            dataIndex: 'datePosted'
        },
        {
            index: 3,
            title: "Actions",
            render: (record) => (
                <div className='flex flex-col md:flex-row gap-2'>
                    <button className="warning-btn w-18" onClick={() => handleUpdateClick(record)}>Edit</button>
                    <button className="danger-btn w-18" onClick={() => handleDeleteClick(record)}>Delete</button>
                </div>
            )
        }
    ]

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <div className="page-container flex flex-col md:flex-row gap-6">
            <ToastContainer />
            <Helmet>
                <title>Announcements</title>
            </Helmet>
            <div className='w-full md:w-[50rem]'>
                <form>
                    <div className="mb-3">
                        <p className="text-sm text-gray">Title<span className='text-red m-0'>*</span></p>
                        <input
                            id='title'
                            name='title'
                            type="text"
                            value={title}
                            placeholder='Enter title'
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className='input-field w-full'
                        />
                    </div>
                    <div>
                        <p className="text-sm text-gray">Body<span className='text-red m-0'>*</span></p>
                        <textarea
                            id='body'
                            name='body'
                            type="text"
                            placeholder='Enter announcement details'
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                            className='input-field w-full h-[25rem]'
                        />
                    </div>
                    <div className='flex flex-row gap-3 w-full justify-end mt-3 py-3 ps-5'>
                        {loader ? (
                            <div>
                                {showLoader()}
                            </div>
                        ) : (
                            <div></div>
                        )}
                        <button type="button" className='border border-gray rounded-md w-16 px-3 hover:bg-gray hover:text-white' onClick={() => clearFields()}>Clear</button>
                        {action === "add" ? (
                            <button type="button" className='view-btn w-fit' onClick={() => addAnnouncement()}>Submit</button>
                        ) : (
                            <button type="button" className='view-btn w-fit' onClick={() => updateAnnouncementRecord()}>Update</button>
                        )}
                    </div>
                </form>
            </div>
            <div className='w-full'>
                {loading ? (
                    <div className='w-full h-full flex justify-center p-10'>
                        {showLoader()}
                    </div>
                ) : (
                    <div>
                        <LuRefreshCw onClick={() => fetchData()} className="text-2xl ms-auto mb-3 text-darkGreen cursor-pointer" />
                        <div className='bg-white rounded-md'>
                            <Table
                                columns={headers}
                                dataSource={dataSource}
                                pagination={pagination}
                                onChange={handleTableChange}>
                            </Table>
                        </div>
                    </div>
                )}
            </div>
            <Modal open={confirmationDiag} onClose={() => setConfirmationDiag(false)}>
                <div className='w-screen h-screen justify-center flex items-center'>
                    <div className='w-96 bg-white rounded-md overflow-hidden'>
                        <div className='bg-red text-white py-2 text-center'>WARNING!</div>
                        <div className="p-5">
                            <p>Are you sure you want to delete this announcement?</p>
                            <div className='flex flex-row justify-end gap-3 mt-5'>
                                <button className='border border-gray rounded-md w-14 hover:bg-gray hover:text-white' onClick={() => setConfirmationDiag(false)}>No</button>
                                <button className='cancel-btn w-14' onClick={() => deleteAnnouncementRecord()}>Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Announcement
