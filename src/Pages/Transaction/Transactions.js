import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import { DatePicker } from 'antd';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../Helpers/Repository/AuthContext';
import {
    formatDate,
    showLoader,
} from '../../Helpers/Utils/Common'

import { IoMdDownload } from "react-icons/io";
import { LuRefreshCw } from "react-icons/lu";

import { getTransactions, getTransactionByID } from '../../Helpers/Repository/TransactionRepo'
import { ToastContainer, toast } from 'react-toastify';

function Transactions() {
    const { userDetails } = useAuth();
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ pageSize: 8 });
    const [dateRange, setDateRange] = useState([]);
    const [search, setSearch] = useState('')
    const [transactionFee, setTransactionFee] = useState(0)

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
            const { transactions } = await getTransactions(userDetails);

            // Process transactions
            const formattedData = transactions.map(transaction => {
                const { addedOn, ...otherFields } = transaction;
                const formattedDate = formatDate(addedOn);
                return {
                    ...otherFields,
                    addedOn: formattedDate
                };
            });

            // Filter transactions based on date range
            const filteredData = formattedData.filter(transaction => {
                const transactionDate = new Date(transaction.addedOn).getTime();
                const startDate = dateRange[0] ? dateRange[0].startOf('day').toDate().getTime() : 0;
                const endDate = dateRange[1] ? dateRange[1].endOf('day').toDate().getTime() : Infinity;
                return transactionDate >= startDate && transactionDate <= endDate;
            });

            const transactionFee = filteredData.length * 0.5;   

            setTransactionFee(transactionFee)
            setDataSource(filteredData);
            setLoading(false);
        }
        catch (error) {
            toast.error("An error occurred: " + error);
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

        let formattedDateRange = '';
        if (dateRange && dateRange.length === 2) {
            formattedDateRange = `${dateRange[0].format('YYYY-MMM-DD')} to ${dateRange[1].format('YYYY-MMM-DD')}`;
        } else {
            formattedDateRange = '';
        }

        // Add transaction fee and date range to specific cells
        const transactionFeeCell = `A1`;
        const dateRangeCell = `A2`;
        XLSX.utils.sheet_add_aoa(ws, [[`Total Commision Fee:`, transactionFee]], { origin: transactionFeeCell });
        XLSX.utils.sheet_add_aoa(ws, [[`Date Range:`, formattedDateRange]], { origin: dateRangeCell });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

        const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

        const fileName = `Transactions ${formattedDateRange}.xlsx`;

        saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), fileName);
    };


    const s2ab = s => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    };

    function handleExport() {
        try {
            const header = columns.map(column => column.title);
            const data = dataSource.map(item => columns.map(column => item[column.dataIndex]));

            let formattedDateRange = '';
            if (dateRange && dateRange.length === 2) {
                formattedDateRange = `${dateRange[0].format('YYYY-MMM-DD')} to ${dateRange[1].format('YYYY-MMM-DD')}`;
            } else {
                formattedDateRange = 'All';
            }

            const meta = [
                ['Title:', 'Transaction List'],
                ['Date Range:', formattedDateRange],
                ['Total Commision Fee:', `₱${transactionFee}`]
            ];

            const sheet = XLSX.utils.json_to_sheet([{}], {
                // header: header
            });

            /* generate worksheet and workbook */
            const workbook = XLSX.utils.book_new();
            XLSX.utils.sheet_add_json(sheet, data, { origin: 'A5' });
            XLSX.utils.book_append_sheet(workbook, sheet, "Sheet 1");
            XLSX.utils.sheet_add_aoa(sheet, meta, { origin: "A1" });
            XLSX.utils.sheet_add_aoa(sheet, [header], { origin: "A5" });
            XLSX.writeFile(workbook, `Trial.xlsx`, { compression: true });
        }
        catch (error) {
            toast.error("Error: " + error)
        }
    }

    const fetchTrasactionById = async () => {
        try {
            if (!search) {
                toast.error("Please supply an ID");
                return;
            }
            setLoading(true)
            const response = await getTransactionByID(search);
            if (response) {
                const { addedOn, ...otherFields } = response;
                const formattedDate = formatDate(addedOn);
                const formattedData = {
                    ...otherFields,
                    addedOn: formattedDate
                };
                setDataSource([formattedData]);
                setLoading(false)
            } else {
                toast.error("Error: No record found");
                setLoading(false)
                setDataSource([])
            }
        } catch (error) {
            toast.error("Error: " + error.message);
            setLoading(false)
            setDataSource([])
        }
    }

    useEffect(() => {
        fetchData();
    }, [dateRange, userDetails]);

    useEffect(() => {
    }, [dataSource])

    return (
        <div className='pt-5 px-5 md:pl-24'>
            <Helmet>
                <title>Transactions</title>
            </Helmet>
            <ToastContainer />
            <div className='flex flew-row justify-between'>
                <div className='rounded-md border border-gray overflow-hidden'>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by Transaction ID"
                        className='p-1 focus-within:bg-white outline-none w-56'
                    />
                    <button type="button" className='bg-green py-1 text-white px-3' onClick={() => fetchTrasactionById()}>Search</button>
                </div>
            </div>
            <div className='w-full my-3 flex flex-col md:flex-row justify-between'>
                <DatePicker.RangePicker
                    picker="date"
                    showTime={false}
                    onChange={handleDateChange}
                />
                <div className='flex flex-row text-darkGray items-center mt-4 md:mt-0 justify-end'>
                    <LuRefreshCw className='cursor-pointer text-2xl me-4' onClick={() => fetchData()} />
                    <button className='bg-orange hover:shadow-md items-center flex flex-row text-sm text-white py-2 px-4 rounded-md w-fit' onClick={() => handleExport()}><span className='p-0 m-0 me-2'><IoMdDownload /></span>Download</button>
                </div>
            </div>
            <div className='bg-white rounded-md overflow-x-scroll scrollbar-none'>
                {loading ? (
                    <div className='w-full h-full flex justify-center p-10'>
                        {showLoader()}
                    </div>) : (
                    <div>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            pagination={pagination}
                            onChange={handleTableChange}>
                        </Table>
                    </div>
                )}
            </div>
            {/* <div className="mt-3">
                <p>Transaction Fee: ₱{transactionFee}</p>
            </div> */}
        </div>
    )
}

export default Transactions
