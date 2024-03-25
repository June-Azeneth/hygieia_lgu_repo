import React, { useState, useEffect } from 'react';
import { Table } from 'antd'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../Helpers/Context/AuthContext';

import {
  formatDate,
  showLoader,
} from '../../Helpers/Utils/Common'

import { getRequests } from '../../Helpers/Context/RequestsRepo'

function Requests() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ pageSize: 8 });
  const { userDetails } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getRequests(userDetails)
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
      toast.error("An error occured: " + error.message)
      setLoading(false)
    }
  }

  const handleTableChange = pagination => {
    setPagination(pagination);
  };

  const clientHeaders = [
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
      dataIndex: 'status'
    },
    {
      key: 7,
      title: 'Actions',
      render: (text, record) => (
        <div>
          <button className="warning-btn me-2">Acknowledge</button>
          <button className="view-btn">Mark as Done</button>
        </div>
      )
    },
  ]

  const adminHeaders = [
    {
      key: 1,
      title: 'Req. ID',
      dataIndex: 'id'
    },
    {
      key: 2,
      title: 'Requester',
      dataIndex: 'storeName'
    },
    {
      key: 2,
      title: 'Requested To',
      dataIndex: 'client'
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
      dataIndex: 'status'
    },
    {
      key: 7,
      title: 'Actions',
      render: (text, record) => (
        <div>
          <button className="view-btn">Acknowledge</button>
          <button className="danger-btn">Mark as Done</button>
        </div>
      )
    },
  ]

  useEffect(() => {
    fetchData();
  }, [userDetails]);

  return (
    <div className="p-5 md:pl-24">
      <ToastContainer />
      {loading ? (
        <div className='w-full h-full flex justify-center p-10'>
          {showLoader()}
        </div>) : (
        <div className='overflow-x-scroll w-full scrollbar-none'>
          {userDetails && userDetails.type === "client" ? (
            <div>
              <Table
                columns={clientHeaders}
                dataSource={dataSource}
                pagination={pagination}
                onChange={handleTableChange}>
              </Table>
            </div>
          ) : (
            <div>
              <Table
                columns={adminHeaders}
                dataSource={dataSource}
                pagination={pagination}
                onChange={handleTableChange}>
              </Table>
            </div>
          )}
        </div>
      )}
    </div >
  );
}

export default Requests;
