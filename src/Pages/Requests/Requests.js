import React, { useState, useEffect } from 'react';
import { Table } from 'antd'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';
import Modal from '@mui/material/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

//HELPERS
import {
  formatDate,
  showLoader,
} from '../../Helpers/Utils/Common'
import { useAuth } from '../../Helpers/Repository/AuthContext';
import { editRequestDetails, getRequests, markAsCompleted, markAsActive, getRequestCounts, markAsRejected, createRequest } from '../../Helpers/Repository/RequestsRepo'

//ASSETS
import { LuRefreshCw } from "react-icons/lu";
import { MdAdd } from "react-icons/md";

function Requests() {
  const { currentUser } = useAuth();
  const [dataSource, setDataSource] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [pagination, setPagination] = useState({ pageSize: 8 });
  const [toggleState, setToggleState] = useState('today');
  const [dialog, setDialog] = useState(false);
  const [storeId, setStoreId] = useState("");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [action, setAction] = useState();
  const [addRequestModal, setAddRequestModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [display, setDisplay] = useState("list")
  const [requestCounts, setRequestCounts] = useState({
    today: 0,
    upcoming: 0,
    pending: 0,
    completed: 0
  });

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const handlePhoneNumberChange = (event) => {
    const number = event.target.value;
    setPhone(number);
    // Regular expression for validating phone numbers (supports numbers with or without country code)
    const phonePattern = /^\+?([0-9]{1,4})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    setIsPhoneValid(phonePattern.test(number));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      if (display === "list") {
        const response = await getRequests(toggleState);
        if (response) {
          const formattedData = response.map(item => {
            const date = new Date(item.date.seconds * 1000);
            const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            return {
              ...item,
              date: formatDate(item.date),
              time: timeString,
              dateAndTime: date
            };
          });
          setDataSource(formattedData);
          setLoading(false);
        } else {
          toast.error("An error occurred: No data returned");
        }
      }
      else {
        const response = await getRequests("all");
        if (response) {
          const eventData = response.map(item => ({
            title: item.storeName,
            start: new Date(item.date.seconds * 1000),
          }));
          setEvents(eventData)
        } else {
          toast.error("An error occurred: No data returned");
        }
      }
    } catch (error) {
      toast.error("An error occurred: " + error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  };

  // const handleSearch = async () => {
  //   try {
  //     if (!search) {
  //       toast.error("Please s ply an ID")
  //       return;
  //     }

  //     setLoading(true)
  //     const response = await getRequestById(toggleState, search);
  //     if (Array.isArray(response)) {
  //       if (response.length > 0) {
  //         const formattedData = response.map(item => ({
  //           ...item,
  //           dateJoined: formatDate(item.dateJoined),
  //           dateSubmitted: formatDate(item.dateSubmitted),
  //           dateRejected: formatDate(item.dateRejected)
  //         }));
  //         setDataSource(formattedData);
  //         setLoading(false)
  //       } else {
  //         setDataSource([]);
  //         setLoading(false)
  //       }
  //     } else {
  //       if (response) {
  //         const formattedData = {
  //           ...response,
  //           dateJoined: formatDate(response.dateJoined),
  //           dateSubmitted: formatDate(response.dateSubmitted),
  //           dateRejected: formatDate(response.dateRejected)
  //         };
  //         setLoading(false)
  //         setDataSource([formattedData]);
  //       } else {
  //         setLoading(false)
  //         setDataSource([]);
  //       }
  //     }
  //   }
  //   catch (error) {
  //     toast.error("An error occured: " + error)
  //   }
  // }

  // const handleClick = (action, record) => {
  //   if (action === "acknowledge") {
  //     setSelectedRow(record)
  //   }
  //   else if (action === "reject") {
  //     setSelectedRow(record)
  //   } else if (action == "mark_as_done") {
  //     setSelectedRow(record)
  //     markAsDoneClick()
  //   }
  // }

  const handleCancelClick = () => {
    setAddRequestModal(false)
    clearFields()
  }

  const acceptClick = (record) => {
    setSelectedRow(record)
    setSelectedDate(record.date)
    setDialog(true)
  }

  const editClick = record => {
    setSelectedRow(record)
    setAddress(record.address)
    setStoreId(record.storeId)
    setPhone(record.phone)
    setNotes(record.notes)
    setSelectedDate(record.dateAndTime)
    setAction("edit")
    setAddRequestModal(true)
  }

  const handleAddScehduleClick = () => {
    setAction("add")
    setAddRequestModal(true)
  }

  const acceptRequest = async () => {
    try {

      if (selectedDate == null) {
        toast.info("Select a date and time")
        return
      }

      setLoader(true)
      const success = await markAsActive(selectedRow.id, selectedDate)
      if (success) {
        setLoader(false)
        toast.success("Success!")
        setDialog(false)
        fetchData()
      }
      else {
        setLoader(false)
        toast.error("An error occured!")
      }
    }
    catch (error) {
      setLoading(false)
      toast.error("An error occured: " + error)
    }
  }

  const clearFields = () => {
    setStoreId("")
    setPhone("")
    setAddress("")
    setSelectedDate(null)
    setNotes("")
  }

  const editRequest = async () => {
    try {
      if (!storeId || !phone || !address || selectedDate === null) {
        toast.info("Fill in all the required fields.")
        return
      }

      if (!isPhoneValid) {
        toast.info("Invalid phone number")
        return
      }

      setLoader(true)
      const data = {
        date: selectedDate,
        phone: phone,
        notes: notes,
        address: address
      }
      const response = await editRequestDetails(selectedRow.id, data)
      if (response) {
        toast.success("Schedule updated successfully!")
        setLoader(false)
        setAddRequestModal(false)
        clearFields()
        fetchData()
      }
      else {
        toast.error("An error occured")
        setLoader(false)
      }

    }
    catch (error) {
      setLoader(false)
      toast.error("An error occured: " + error)
    }
  }

  const createRequestClick = async () => {
    try {
      if (!storeId || !phone || !address || selectedDate === null) {
        toast.info("Fill in all the required fields.")
        return
      }

      if (!isPhoneValid) {
        toast.info("Invalid phone number")
        return
      }

      setLoader(true)
      const data = {
        status: "active",
        date: selectedDate,
        phone: phone,
        storeId: storeId,
        notes: notes,
        address: address
      }
      const response = await createRequest(data)
      if (response) {
        toast.success("Schedule successfully created!")
        setLoader(false)
        setAddRequestModal(false)
        clearFields()
        fetchData()
      }
      else {
        toast.error("An error occured")
        setLoader(false)
      }

    }
    catch (error) {
      setLoader(false)
      toast.error("An error occured: " + error)
    }
  }

  const markAsRejectedClick = async (record) => {
    try {
      const success = await markAsRejected(record.id)
      if (success) {
        toast.success("Success!")
        fetchData()
        setLoading(false)
      }
      else {
        toast.error("An error occured!")
      }
    }
    catch (error) {
      toast.error("An error occured: " + error)
    }
  }

  const markAsDoneClick = async (record) => {
    try {
      const success = await markAsCompleted(record.id)
      if (success) {
        toast.success("Success!")
        fetchData()
        setLoading(false)
      }
      else {
        toast.error("An error occured!")
      }
    }
    catch (error) {
      toast.error("An error occured: " + error)
    }
  }

  const handleTableChange = pagination => {
    setPagination(pagination);
  };

  const toggleTab = (tab) => {
    setToggleState(tab)
  }

  const headers = [
    {
      key: 0,
      title: 'Req. ID',
      dataIndex: 'id'
    },
    {
      key: 1,
      title: 'Store Name',
      dataIndex: 'storeName'
    },
    {
      key: 2,
      title: 'Address',
      dataIndex: 'address'
    },
    {
      key: 3,
      title: 'Date',
      dataIndex: 'date'
    },
    {
      key: 4,
      title: 'Time',
      dataIndex: 'time',
      render: (time, record) => record.status !== 'pending' && time
    },
    {
      key: 5,
      title: 'Notes',
      dataIndex: 'notes'
    },
    {
      key: 6,
      title: 'Phone',
      dataIndex: 'phone'
    },
    {
      key: 7,
      title: 'Status',
      dataIndex: 'status',
      render: status => (
        <div>
          {status === "active" ? (
            <p className='font-bold text-blue-600'>ACTIVE</p>
          ) : status === "pending" ? (
            <p className='font-bold text-orange'>PENDING</p>
          ) : status === "completed" ? (
            <p className='font-bold text-green'>COMPLETED</p>
          ) : null}
        </div>
      )
    },
    {
      key: 8,
      title: 'Actions',
      render: (record) => (
        <div className='flex flex-row gap-3'>
          {toggleState === "today" && (
            <div className='flex flex-col gap-3'>
              <button className="warning-btn me-3" onClick={() => editClick(record)}>Edit</button>
              <button className="view-btn" onClick={() => markAsDoneClick(record)}>Mark As Done</button>
            </div>
          )}
          {toggleState === "upcoming" && (
            <div className='flex flex-col lg:flex-row gap-3'>
              <button className="warning-btn w-24" onClick={() => editClick(record)}>Edit</button>
              <button className="view-btn" onClick={() => markAsDoneClick(record)}>Mark As Done</button>
            </div>
          )}
          {toggleState === "pending" && (
            <div>
              <button className="warning-btn w-24 me-3" onClick={() => acceptClick(record)}>Accept</button>
              <button className="cancel-btn w-24" onClick={() => markAsRejectedClick(record)}> Reject</button>
            </div>
          )
          }
          {toggleState === "done" && (
            <div>
              -
            </div>
          )}
        </div >
      )
    }
  ]

  useEffect(() => {
    fetchData();
  }, [currentUser, toggleState, display]);

  useEffect(() => {
    async function fetchCount() {
      try {
        const counts = await getRequestCounts();
        setRequestCounts(counts);
        setLoading(false);
      } catch (error) {
        toast.error('Error:', error);
      }
    }
    fetchCount();
  }, [requestCounts]);

  return (
    <div className="p-5 md:pl-24 text-darkGray ">
      <Helmet>
        <title>Garbage Collection</title>
      </Helmet>
      <ToastContainer />
      <div className='w-full justify-between flex-col md:gap-0 md:flex-row flex mb-5'>
        <div className="flex flex-row gap-3">
          <button
            type='button'
            className={display === 'list' ? "border text-white bg-gray h-full border-gray rounded-md w-24" : "border h-full border-gray rounded-md w-24 hover:bg-gray hover:text-white"}
            onClick={() => setDisplay("list")}>
            List
          </button>
          <button
            type='button'
            className={display === 'calendar' ? "border text-white bg-gray h-full border-gray rounded-md w-24" : "border h-full border-gray rounded-md w-24 hover:bg-gray hover:text-white"}
            onClick={() => setDisplay("calendar")}>
            Calendar
          </button>
        </div>
        <div className='flex flex-row justify-end gap-3 items-center mt-7 md:mt-0'>
          <LuRefreshCw className='cursor-pointer text-2xl me-4' onClick={() => fetchData()} />
          <button className='bg-orange hover:shadow-md items-center flex flex-row text-sm text-white py-2 px-4 rounded-md w-fit' onClick={() => handleAddScehduleClick()}><span className='p-0 text-lg m-0 me-2'><MdAdd /></span>Add Schedule</button>
        </div>
      </div>
      {display === "list" ? (
        <div>
          <div className='w-full flex-row gap-1 flex'>
            <div
              className={toggleState === 'today' ? "tabs active-tab" : "tabs"}
              onClick={() => toggleTab('today')}>
              Today
              <span className={requestCounts.today !== 0 ? "bg-red rounded-full px-2 text-white inline-flex text-sm" : "hidden"}>{requestCounts.today}</span>
            </div>
            <div
              className={toggleState === 'upcoming' ? "tabs active-tab" : "tabs"}
              onClick={() => toggleTab('upcoming')}>
              Upcoming
              <span className={requestCounts.upcoming !== 0 ? "bg-red rounded-full px-2 text-white inline-flex text-sm" : "hidden"}>{requestCounts.upcoming}</span>
            </div>
            <div
              className={toggleState === 'pending' ? "tabs active-tab" : "tabs"}
              onClick={() => toggleTab('pending')}>
              Pending
              <span className={requestCounts.pending !== 0 ? "bg-red rounded-full px-2 text-white inline-flex text-sm" : "hidden"}>{requestCounts.pending}</span>
            </div>
            <div
              className={toggleState === 'done' ? "tabs active-tab" : "tabs"}
              onClick={() => toggleTab('done')}>
              Completed
            </div>
          </div>
          {loading ? (
            <div className='w-full h-full flex justify-center p-10 bg-white rounded-tr-md rounded-b-md'>
              {showLoader()}
            </div>) : (
            <div className='overflow-x-scroll w-full scrollbar-none'>
              <div className={toggleState === "today" ? "content active-content" : "content"}>
                {loading ? (
                  <div className='w-full h-full flex justify-center p-10 shadow-md'>
                    {showLoader()}
                  </div>) : (
                  <div className='overflow-x-scroll w-full scrollbar-none h-full'>
                    <Table
                      columns={headers}
                      dataSource={dataSource}
                      pagination={pagination}
                      onChange={handleTableChange}>
                    </Table>
                  </div>
                )}
              </div>
              <div className={toggleState === "upcoming" ? "content active-content" : "content"}>
                {loading ? (
                  <div className='w-full h-full flex justify-center p-10 shadow-md'>
                    {showLoader()}
                  </div>) : (
                  <div className='overflow-x-scroll w-full scrollbar-none h-full'>
                    <Table
                      columns={headers}
                      dataSource={dataSource}
                      pagination={pagination}
                      onChange={handleTableChange}>
                    </Table>
                  </div>
                )}
              </div>
              <div className={toggleState === "pending" ? "content active-content" : "content"}>
                {loading ? (
                  <div className='w-full h-full flex justify-center p-10 shadow-md'>
                    {showLoader()}
                  </div>) : (
                  <div className='overflow-x-scroll w-full scrollbar-none h-full'>
                    <Table
                      columns={headers}
                      dataSource={dataSource}
                      pagination={pagination}
                      onChange={handleTableChange}>
                    </Table>
                  </div>
                )}
              </div>
              <div className={toggleState === "done" ? "content active-content" : "content"}>
                {loading ? (
                  <div className='w-full h-full flex justify-center p-10 shadow-md'>
                    {showLoader()}
                  </div>) : (
                  <div className='overflow-x-scroll w-full scrollbar-none h-full'>
                    <Table
                      columns={headers}
                      dataSource={dataSource}
                      pagination={pagination}
                      onChange={handleTableChange}>
                    </Table>
                  </div>
                )}
              </div>
              <Modal open={dialog} onClose={() => setDialog(false)}>
                <div className="flex justify-center items-center w-screen h-screen">
                  <div className='bg-white rounded-md p-6 text-darkGray'>
                    <p className='font-bold text-xl'>Set the time and date for collection</p>
                    <div className="flex flex-row gap-3 my-3">
                      <div>
                        <p>Select Date and Time</p>
                        <DatePicker
                          placeholderText='Select a date'
                          selected={selectedDate}
                          value={selectedDate}
                          onChange={handleDateChange}
                          dateFormat="MMMM dd, yyyy - hh : mm a"
                          showTimeInput={true}
                          className='w-[20rem] input-field h-[2.5rem]' />
                      </div>
                    </div>
                    <div className='w-full justify-end gap-3 flex flex-row mt-5'>
                      {loader ? (
                        <div>
                          {showLoader()}
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <button
                        type='button'
                        className='cancel-btn w-24'
                        onClick={() => setDialog(false)}>
                        Cancel
                      </button>
                      <button
                        type='button'
                        className='view-btn w-24'
                        onClick={() => acceptRequest()}>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          )}
        </div>
      ) : (
        <div className='pb-5'>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            fixedWeekCount={false}
            weekNumbers={false}
            events={events}
          />
        </div>
      )}
      <Modal open={addRequestModal} onClose={() => setAddRequestModal(false)}>
        <div className="flex justify-center items-center w-screen h-screen">
          <div className='bg-white rounded-md p-6 text-darkGray'>
            <p className="text-xl font-bold mb-3">{action === "edit" ? 'Edit Schedule Details' : 'Add Schedule'}</p>
            <form>
              <div>
                <p className="text-sm text-gray">Store ID<span className='text-red m-0'>*</span></p>
                <input
                  type="text"
                  id="storeId"
                  name="storeId"
                  placeholder='Enter store ID'
                  value={storeId}
                  disabled={action === 'edit' ? true : false}
                  onChange={(e) => setStoreId(e.target.value)}
                  required
                  className='input-field w-full' />
              </div>
              <p className="text-sm text-gray mt-3">Address<span className='text-red m-0'>*</span></p>
              <div className='flex flex-row gap-3'>
                <div className='w-full'>
                  <textarea
                    type="text"
                    id="address"
                    name="address"
                    placeholder='Address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className='input-field w-full' />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray mt-3">Phone<span className='text-red m-0'>*</span></p>
                <input
                  type="phone"
                  id="phone"
                  name="phone"
                  placeholder='Phone'
                  value={phone}
                  onChange={handlePhoneNumberChange}
                  required
                  className='input-field w-full' >
                </input>
              </div>
              <div>
                <p className="text-sm text-gray mt-3">Notes</p>
                <textarea
                  type="text"
                  id="notes"
                  name="notes"
                  placeholder='Notes'
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                  className='input-field w-full'>
                </textarea>
              </div>
              <div className='mt-3'>
                <p className="text-sm text-gray mt-3">Select A Date<span className='text-red m-0'>*</span></p>
                <DatePicker
                  placeholderText='Select a date'
                  selected={selectedDate}
                  value={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="MMMM dd, yyyy - hh : mm a"
                  showTimeInput={true}
                  className='w-[20rem] input-field h-[2.5rem]' />
              </div>
              <div className='w-full justify-end gap-3 flex flex-row mt-5'>
                {loader ? (
                  <div>
                    {showLoader()}
                  </div>
                ) : (
                  <div></div>
                )}
                <button
                  type='button'
                  className='cancel-btn w-24'
                  onClick={() => handleCancelClick()}>
                  Cancel
                </button>
                {action === "edit" ? (
                  <button
                    type='button'
                    className='view-btn w-24'
                    onClick={() => editRequest()}>
                    Edit
                  </button>
                ) : (
                  <button
                    type='button'
                    className='view-btn w-24'
                    onClick={() => createRequestClick()}>
                    Add
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div >
  );
}

export default Requests;
