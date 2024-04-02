import React, { useState, useEffect } from 'react';
import { Table } from 'antd'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//HELPERS
import {
  formatDate,
  showLoader,
} from '../../Helpers/Utils/Common'
import { useAuth } from '../../Helpers/Repository/AuthContext';
import { getRequests, markAsCompleted, markAsActive, getRequestCounts } from '../../Helpers/Repository/RequestsRepo'

//ASSETS
import { LuRefreshCw } from "react-icons/lu";
// import { AiOutlineClose } from "react-icons/ai";

function Requests() {
  const { currentUser } = useAuth();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ pageSize: 8 });
  const [toggleState, setToggleState] = useState('today');
  const [search, setSearch] = useState("")
  const [selectedRow, setSelectedRow] = useState([])
  const [requestCounts, setRequestCounts] = useState({
    today: 0,
    upcoming: 0,
    pending: 0,
    completed: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getRequests(toggleState)
      if (response) {
        const formattedData = response.map(item => ({
          ...item,
          date: formatDate(item.date)
        }));
        setDataSource(formattedData);
      } else {
        toast.error("An error occured: No data returned");
      }
      setLoading(false)
    }
    catch (error) {
      toast.error("An error occured: " + error)
      setLoading(false)
    }
  }

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

  const handleClick = (action, record) => {
    setSelectedRow(record)
    if (action === "acknowledge") {
      acknowledgeRequest()
    }
    else {
      markAsDoneClick()
    }
  }

  const acknowledgeRequest = async () => {
    try {
      setLoading(true)
      const success = await markAsActive(selectedRow.id)
      if (success) {
        setLoading(false)
        toast.success("Success!")
        fetchData()
      }
      else {
        setLoading(false)
        toast.error("An error occured!")
      }
    }
    catch (error) {
      setLoading(false)
      toast.error("An error occured: " + error)
    }
  }

  const markAsDoneClick = async () => {
    try {
      setLoading(true)
      const success = await markAsCompleted(selectedRow.id)
      if (success) {
        toast.success("Success!")
        fetchData()
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
      key: 1,
      title: 'Req. ID',
      dataIndex: 'id'
    },
    {
      key: 2,
      title: 'Store Name',
      dataIndex: 'storeName'
    },
    {
      key: 3,
      title: 'Address',
      dataIndex: ['address', 'city'],
    },
    {
      key: 4,
      title: 'Date',
      dataIndex: 'date'
    },
    {
      key: 5,
      title: 'Notes',
      dataIndex: 'notes'
    },
    {
      key: 6,
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
      key: 7,
      title: 'Actions',
      render: (record) => (
        <div className='flex flex-row gap-3'>
          {toggleState === "today" && (
            <div>
              <button className="view-btn">View</button>
            </div>
          )}
          {toggleState === "upcoming" && (
            <div>
              <button className="view-btn">View</button>
            </div>
          )}
          {toggleState === "pending" && (
            <div>
              <button className="warning-btn me-3" onClick={() => handleClick("acknowledge", record)}>Acknowledge</button>
              <button className="view-btn" onClick={() => handleClick("mark_as_done", record)}> Mark as Done</button>
            </div>
          )
          }
          {toggleState === "done" && (
            <div>

            </div>
          )}
        </div >
      )
    }
  ]

  // const adminHeaders = [
  //   {
  //     key: 1,
  //     title: 'Req. ID',
  //     dataIndex: 'id'
  //   },
  //   {
  //     key: 2,
  //     title: 'Requester',
  //     dataIndex: 'storeName'
  //   },
  //   {
  //     key: 2,
  //     title: 'Requested To',
  //     dataIndex: 'client'
  //   },
  //   {
  //     key: 3,
  //     title: 'Address',
  //     dataIndex: ['address', 'city'],
  //   },
  //   {
  //     key: 4,
  //     title: 'Date',
  //     dataIndex: 'date'
  //   },
  //   {
  //     key: 5,
  //     title: 'Notes',
  //     dataIndex: 'notes'
  //   },
  //   {
  //     key: 6,
  //     title: 'Status',
  //     dataIndex: 'status'
  //   },
  //   {
  //     key: 7,
  //     title: 'Actions',
  //     render: (text, record) => (
  //       <div className='flex flex-row gap-3'>
  //         <button className="warning-btn">Acknowledge</button>
  //         <button className="view-btn">Mark as Done</button>
  //       </div>
  //     )
  //   },
  // ]

  useEffect(() => {
    fetchData();
  }, [currentUser, toggleState]);

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
    <div className="p-5 md:pl-24 text-darkGray">
      <ToastContainer />
      <div className='w-full justify-end flex-col md:gap-0 md:flex-row flex mb-5'>
        {/* <div className='rounded-md border border-gray h-fit overflow-hidden w-fit'>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID"
            className='p-1 focus-within:bg-white outline-none w-56'
          />
          <button type="button" className='bg-green py-1 text-white px-3' onClick={() => handleSearch()}>Search</button>
        </div> */}
        <div className='flex flex-row justify-end gap-3 items-center mt-7 md:mt-0'>
          <LuRefreshCw className='cursor-pointer text-2xl me-4' onClick={() => fetchData()} />
          {/* <button className='bg-orange hover:shadow-md items-center flex flex-row text-sm text-white py-2 px-4 rounded-md w-fit' onClick={() => handleAddClientClick(true)}><span className='p-0 text-lg m-0 me-2'><MdAdd /></span>Add Client</button> */}
        </div>
      </div>
      <div className='w-full flex-row gap-1 flex'>
        <div
          className={toggleState === 'today' ? "tabs active-tab" : "tabs"}
          onClick={() => toggleTab('today')}>
          Today
          <span className={requestCounts.today != 0 ? "bg-red rounded-full px-2 text-white inline-flex text-sm" : "hidden"}>{requestCounts.today}</span>
        </div>
        <div
          className={toggleState === 'upcoming' ? "tabs active-tab" : "tabs"}
          onClick={() => toggleTab('upcoming')}>
          Upcoming
          <span className={requestCounts.upcoming != 0 ? "bg-red rounded-full px-2 text-white inline-flex text-sm" : "hidden"}>{requestCounts.upcoming}</span>
        </div>
        <div
          className={toggleState === 'pending' ? "tabs active-tab" : "tabs"}
          onClick={() => toggleTab('pending')}>
          Pending
          <span className={requestCounts.pending != 0 ? "bg-red rounded-full px-2 text-white inline-flex text-sm" : "hidden"}>{requestCounts.pending}</span>
        </div>
        <div
          className={toggleState === 'done' ? "tabs active-tab" : "tabs"}
          onClick={() => toggleTab('done')}>
          Completed
          <span className={requestCounts.completed != 0 ? "bg-red rounded-full px-2 text-white inline-flex text-sm" : "hidden"}>{requestCounts.completed}</span>
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
        </div>
      )}
    </div >
  );
}

export default Requests;
