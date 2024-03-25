import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import { DatePicker } from 'antd';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import {
    formatDate,
    showLoader,
} from '../../Helpers/Utils/Common'

import { useAuth } from '../../Helpers/Context/AuthContext';

import { IoMdDownload } from "react-icons/io";

import { getTransactions } from '../../Helpers/Context/TransactionRepo'
import { ToastContainer, toast } from 'react-toastify';

function Transactions() {
    const { userDetails } = useAuth();
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ pageSize: 8 });
    const [dateRange, setDateRange] = useState([]);

    const handleTableChange = pagination => {
        setPagination(pagination);
    };

    const handleDateChange = dates => {
        setDateRange(dates);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            if (!userDetails) {
                return;
            }
            const response = await getTransactions(userDetails);
            const formattedData = response.map(transaction => {
                const { addedOn, ...otherFields } = transaction;
                const formattedDate = formatDate(addedOn);
                return {
                    ...otherFields,
                    addedOn: formattedDate
                };
            });
            const filteredData = formattedData.filter(transaction => {
                const transactionDate = new Date(transaction.addedOn).getTime();
                const startDate = dateRange[0] ? dateRange[0].startOf('day').toDate().getTime() : 0;
                const endDate = dateRange[1] ? dateRange[1].endOf('day').toDate().getTime() : Infinity;
                return transactionDate >= startDate && transactionDate <= endDate;
            });
            setDataSource(filteredData);
            setLoading(false);
        }
        catch (error) {
            toast.error("An error occured: " + error)
        }
    };

    const columns = [
        {
            key: 1,
            title: 'ID',
            dataIndex: 'id'
        },
        {
            key: 2,
            title: 'Date',
            dataIndex: 'addedOn'
        },
        {
            key: 3,
            title: 'Store',
            dataIndex: 'storeName'
        },
        {
            key: 4,
            title: 'Customer',
            dataIndex: 'customerName'
        },
        {
            key: 5,
            title: 'Type',
            dataIndex: 'type'
        },
        {
            key: 6,
            title: 'Reward',
            dataIndex: 'product'
        },
        {
            key: 7,
            title: 'Promo',
            dataIndex: 'promoName'
        },
        {
            key: 8,
            title: 'Points Earned',
            dataIndex: 'pointsEarned'
        },
        {
            key: 9,
            title: 'Points Spent',
            dataIndex: 'pointsSpent'
        },
    ]

    const exportToExcel = () => {
        const header = columns.map(column => column.title);
        const data = dataSource.map(item => columns.map(column => item[column.dataIndex]));

        const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
        const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

        let formattedDateRange = '';
        if (dateRange && dateRange.length === 2) {
            formattedDateRange = `${dateRange[0].format('YYYY-MMM-DD')} to ${dateRange[1].format('YYYY-MMM-DD')}`;
        } else {
            formattedDateRange = '';
        }

        const fileName = `Transactions ${formattedDateRange}.xlsx`;

        saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), fileName);
    };

    const s2ab = s => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    };

    useEffect(() => {
        fetchData();
    }, [dateRange, userDetails]);

    return (
        <div className='pt-8 pl-8 md:pl-24 pr-8'>
            <ToastContainer />
            <div className='flex flew-row'>
                <div className='w-full'>
                    {/* <DatePicker />
                    <DatePicker className='ms-2' /> */}
                    <div className='w-full'>
                        <DatePicker.RangePicker onChange={handleDateChange} />
                    </div>
                </div>
                <div>
                    <button className='bg-orange hover:shadow-md items-center flex flex-row text-sm text-white py-2 px-4 rounded-md mb-5 w-fit me-auto' onClick={exportToExcel}><span className='p-0 m-0 me-2'><IoMdDownload /></span>Download</button>
                </div>
            </div>
            <div className='bg-white rounded-md overflow-x-scroll scrollbar-none'>
                {loading ? (
                    <div className='w-full h-full flex justify-center p-10'>
                        {showLoader()}
                    </div>) : (
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        pagination={pagination}
                        onChange={handleTableChange}>
                    </Table>
                )}
            </div>
        </div>
    )
}

export default Transactions
