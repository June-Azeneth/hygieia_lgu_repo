import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Helpers/Context/AuthContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table } from 'antd'
import { MdAdd } from "react-icons/md";

import { showLoader, formatDate } from '../../Helpers/Utils/Common'
import { getClients } from '../../Helpers/Context/ClientRepo';

export default function ClientManager() {
    const { userDetails } = useAuth();
    const [loading, setLoading] = useState(true)
    const [dataSource, setDataSource] = useState([])
    const [pagination, setPagination] = useState({ pageSize: 8 });

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

    const headers = [
        {
            key: 1,
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
            title: 'Address',
            dataIndex: ['address', 'city']
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
        }
        // {
        //     key: 5,
        //     title: 'Actions',
        //     render: (text, record) => (
        //         <div>
        //             <button className="danger-btn w-fit">Deactivate</button>
        //         </div>
        //     )
        // }
    ]

    useEffect(() => {
        fetchData()
    }, [userDetails])

    return (
        <div className='page-container'>
            <ToastContainer />
            {loading ? (
                <div className='w-full h-20 flex justify-center items-center'>
                    {showLoader()}
                </div>
            ) : (
                <div>
                    <div className='w-full justify-end flex mb-5 h-[2.5rem] '>
                        <button className='bg-orange h-full hover:shadow-md items-center flex flex-row text-sm text-white py-2 px-4 rounded-md mb-5 w-fit me-auto'><span className='p-0 text-lg m-0 me-2'><MdAdd /></span>Add Client</button>
                    </div>
                    <div className='overflow-x-scroll w-full scrollbar-none bg-white rounded-md'>
                        <Table
                            columns={headers}
                            dataSource={dataSource}
                            pagination={pagination}
                            onChange={handleTableChange}>
                        </Table>
                    </div>
                </div>
            )
            }
        </div >
    )
}
