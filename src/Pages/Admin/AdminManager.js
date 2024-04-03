import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Helpers/Repository/AuthContext'
import { ToastContainer, toast, useToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table } from 'antd'
import { MdAdd } from "react-icons/md";
import Modal from '@mui/material/Modal';
import QRCode from "qrcode";
import { Helmet } from 'react-helmet';

//ASSETS
import Placeholder from '../../Assets/placeholder_image.jpg'
import { LuRefreshCw } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";

import { showLoader, formatDate, currentDateTimestamp } from '../../Helpers/Utils/Common'

import {
  getAllAdmins,
  getAdminById,
  addAdmin,
  deleteAdmin,
  editAdmin
} from '../../Helpers/Repository/AdminRepo';

const AdminManager = () => {
  const [addAdminModal, setAddAdminModal] = useState(false)
  const [search, setSearch] = useState("")
  const [dataSource, setDataSource] = useState([])
  const [pagination, setPagination] = useState({ pageSize: 8 });
  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  const [confirmationDiag, setConfirmationDiag] = useState(false)
  const [editRecordModal, setEditRecordModal] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loader, setLoader] = useState("")


  const handleTableChange = pagination => {
    setPagination(pagination);
  };

  const headers = [
    {
      key: 0,
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
      title: 'Email',
      dataIndex: 'email'
    },
    {
      key: 6,
      title: 'Added On',
      dataIndex: 'dateAdded'
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
          <button className="view-btn w-16" onClick={() => handleEditClick(record)}>Edit</button>
          <button className="danger-btn w-16" onClick={() => handleDeleteClick(record)}>Delete</button>
        </div>
      )
    }
  ]

  const handleEditClick = async (record) => {
    setSelectedRow(record)
    setName(record.name)
    setEditRecordModal(true)
  }

  const handleDeleteClick = (record) => {
    setConfirmationDiag(true)
    setSelectedRow(record)
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getAllAdmins();
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
      toast.error("An errow occured: " + error)
    }
  }

  const fetchAdminByID = async () => {
    try {
      if (!search) {
        toast.info("Please enter an ID");
        return;
      }

      setLoading(true)
      const response = await getAdminById(search);
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
      toast.error("An error occured:" + error)
    }
  }

  const deleteAdminRecord = async () => {
    try {
      const success = deleteAdmin(selectedRow.id)
      if (success) {
        toast.success("Admin Deleted Successfully")
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
      toast.error("An error occured:" + error)
    }
  }

  const addAdminRecord = async () => {
    try {
      if (!name || !email || !password) {
        toast.info("Input all required fields")
        return
      }

      setLoader(true)
      const data =
      {
        name: name,
        email: email,
        dateAdded: currentDateTimestamp,
        status: "active",
        type: "admin",
      }
      const success = await addAdmin(email, password, data)
      if (success) {
        setLoader(false)
        setAddAdminModal(false)
        clearFields()
        fetchData()
      }
      else {
        setLoader(false)
        toast.error("An error occured!")
      }
    }
    catch (error) {
      setLoader(false)
      toast.error("An error occured: " + error)
    }
  }

  const clearFields = () => {
    setName("")
    setEmail("")
    setPassword("")
  }

  const editAdminRecord = async () => {
    try {
      if (!name) {
        toast.info("Fill in the required field!")
        return
      }

      if (name != selectedRow.name) {
        setLoader(true)
        const data = {
          name: name
        }

        const success = await editAdmin(selectedRow.id, data)
        if (success) {
          toast.success("Admin edited successfully")
          setLoader(false)
          setEditRecordModal(false)
          clearFields()
          fetchData()
        }
        else {
          setLoader(false)
          toast.error("An error occured")
        }
      }
      else {
        toast.info("No changes detected!")
      }
    }
    catch (error) {
      setLoader(false)
      toast.error("An error occured: " + error)
    }
  }

  const cancelClick = (action) => {
    if (action === "add") {
      setAddAdminModal(false)
    }
    else {
      setEditRecordModal(false)
    }
    clearFields()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='page-container'>
       <Helmet>
        <title>Admins</title>
      </Helmet>
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
          <button type="button" className='bg-green py-1 text-white px-3' onClick={() => fetchAdminByID()}>Search</button>
        </div>
        <div className='flex flex-row justify-end items-center mt-6 md:mt-0'>
          <LuRefreshCw className='cursor-pointer text-2xl me-4' onClick={() => fetchData()} />
          <button className='bg-orange hover:shadow-md items-center flex flex-row text-sm text-white py-2 px-4 rounded-md w-fit' onClick={() => setAddAdminModal(true)}><span className='p-0 text-lg m-0 me-2'><MdAdd /></span>Add Admin</button>
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
      <Modal open={confirmationDiag} onClose={() => setConfirmationDiag(false)}>
        <div className='w-screen h-screen justify-center flex items-center'>
          <div className='w-96 bg-white rounded-md overflow-hidden'>
            <div className='bg-red text-white py-2 text-center'>WARNING!</div>
            <div className="p-5">
              <p>Are you sure you want to delete this admin?</p>
              <div className='flex flex-row justify-end gap-3 mt-5'>
                <button className='border border-gray rounded-md w-14 hover:bg-gray hover:text-white' onClick={() => setConfirmationDiag(false)}>No</button>
                <button className='cancel-btn w-14' onClick={() => deleteAdminRecord()}>Yes</button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={addAdminModal} onClose={() => setAddAdminModal(false)}>
        <div className='w-screen h-screen justify-center flex items-center'>
          <div className='w-fit bg-white rounded-md overflow-hidden'>
            <div className='bg-oliveGreen text-white py-2 text-center'>Add an Admin</div>
            <form className='p-5 flex flex-wrap gap-3'>
              <div>
                <p className="text-sm text-gray">Name<span className='text-red m-0'>*</span></p>
                <input
                  id='name'
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='input-field'
                />
              </div>
              <div>
                <p className="text-sm text-gray">Email<span className='text-red m-0'>*</span></p>
                <input
                  id='name'
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='input-field'
                />
              </div>
              <div>
                <p className="text-sm text-gray">Password<span className='text-red m-0'>*</span></p>
                <input
                  id='name'
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='input-field'
                />
              </div>
            </form>
            <div className='flex flex-row gap-3 w-full justify-end mt-3 py-3 px-5'>
              {loader ? (
                <div>
                  {showLoader()}
                </div>
              ) : (
                <div></div>
              )}
              <button className='border border-gray rounded-md w-fit px-3 hover:bg-gray hover:text-white' onClick={() => cancelClick("add")}>Cancel</button>
              <button className='view-btn w-fit' onClick={() => addAdminRecord()}>Submit</button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={editRecordModal} onClose={() => setEditRecordModal(true)}>
        <div className='w-screen h-screen justify-center flex items-center'>
          <div className='w-fit bg-white rounded-md overflow-hidden'>
            <div className='bg-oliveGreen text-white py-2 text-center'>Edit Information</div>
            <form className='p-5 flex flex-wrap gap-3'>
              <div>
                <p className="text-sm text-gray">Name<span className='text-red m-0'>*</span></p>
                <input
                  id='name'
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='input-field'
                />
              </div>
            </form>
            <div className='flex flex-row gap-3 w-full justify-center py-3 px-5'>
              {loader ? (
                <div>
                  {showLoader()}
                </div>
              ) : (
                <div></div>
              )}
              <button className='border border-gray rounded-md w-fit px-3 hover:bg-gray hover:text-white' onClick={() => cancelClick("edit")}>Cancel</button>
              <button className='view-btn w-fit' onClick={() => editAdminRecord()}>Submit</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminManager
