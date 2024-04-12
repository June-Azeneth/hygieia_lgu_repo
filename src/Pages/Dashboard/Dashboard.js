import React, { useEffect, useState } from "react";
import { useAuth } from '../../Helpers/Repository/AuthContext'
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';

import { IoStorefrontOutline } from "react-icons/io5";
import { VscRequestChanges } from "react-icons/vsc";
import { PiTruck } from "react-icons/pi";
// import { FaBuildingColumns } from "react-icons/fa6";
// import { FaRegUser } from "react-icons/fa6";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import { FiUsers } from "react-icons/fi";
import { MdOutlinePending } from "react-icons/md";
import { IoTodayOutline } from "react-icons/io5";
import { TiDocumentAdd } from "react-icons/ti";

import {
  showLoader,
  formatDate
} from '../../Helpers/Utils/Common'

import {
  getStores,
  getClients
} from '../../Helpers/Repository/ClientRepo'
import { getRequestCounts } from "../../Helpers/Repository/RequestsRepo";
import { getAllConsumers } from "../../Helpers/Repository/ConsumerRepo";
import { getRequests } from "../../Helpers/Repository/RequestsRepo";

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const { userDetails } = useAuth()
  const [dataSource, setDataSource] = useState([]);
  const [user, setUser] = useState("Unknown User");
  const [consumerCount, setCounsumerCount] = useState(0)
  const [activeStoresCount, setActiveStores] = useState(0)
  const [pickUpRequestsCount, setRequests] = useState(0)
  const [pickUpTodayCount, setPickUpTodayCount] = useState(0)
  const [clientCount, setClientCount] = useState(0)
  const [storeReq, setStoreReq] = useState(0)
  const navigate = useNavigate()

  const fetchData = async () => {
    if (userDetails) {
      setLoading(true)
      const stores = await getStores(userDetails);
      const clients = await getClients()
      const consumers = await getAllConsumers()
      const pickUpRequests = await getRequestCounts()

      setActiveStores(stores.filter(store => store.status === 'active').length);
      setStoreReq(stores.filter(store => store.status === 'pending').length);
      setCounsumerCount(consumers.length)
      setClientCount(clients.length)
      setRequests(pickUpRequests.pending)
      setPickUpTodayCount(pickUpRequests.today)

      const response = await getRequests("upcoming")
      if (response) {
        const formattedData = response.map(item => ({
          ...item,
          date: formatDate(item.date)
        }));
        setDataSource(formattedData);
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    if (userDetails) {
      setLoading(true)
      setUser(userDetails.name || "Unauthenticated Access");
      setLoading(false)
    }
  }, [userDetails]);

  useEffect(() => {
    fetchData()
  }, [])

  const handleClick = (path) => {
    navigate(path)
  }

  const userBreakdown = [
    {
      index: 0,
      title: 'Total Stores',
      icon: <IoStorefrontOutline />,
      count: activeStoresCount,
      path: '/store'
    },
    {
      index: 1,
      title: 'Total Clients',
      icon: <HiOutlineBuildingLibrary />,
      count: clientCount,
      path: '/clients'
    },
    {
      index: 2,
      title: 'Total Consumers',
      icon: <FiUsers />,
      count: consumerCount,
      path: '/consumers'
    }
  ]

  const garbagePickUpBreakDown = [
    {
      index: 0,
      icon: <MdOutlinePending />,
      title: 'Pending Requests',
      count: pickUpRequestsCount,
      path: '/requests'
    },
    {
      index: 1,
      icon: <IoTodayOutline />,
      title: 'Today',
      count: pickUpTodayCount,
      path: '/requests'
    }
  ]

  const storesRequests = [
    {
      index: 0,
      icon: <TiDocumentAdd />,
      title: 'Pending',
      count: storeReq,
      path: '/store'
    },
  ]

  return (
    <div className='page-container text-darkGray'>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <p className="font-bold text-xl">Welcome Back {user}!</p>
      <div className="mt-4 h-full">
        {loading ? (
          <div className="w-full h-56 flex justify-center items-center">
            {showLoader()}
          </div>
        ) : userDetails && userDetails.type === "admin" ? (
          <div className="flex flex-col lg:flex-row gap-9">
            <div className="flex flex-col gap-9 w-full">
              <div>
                <p className="text-lg">Users Breakdown</p>
                <div className="flex flex-row gap-4">
                  {userBreakdown.map(item => (
                    <div key={item.index} className="bg-white rounded-md w-[15rem] p-5 flex flex-row items-center gap-4 hover:shadow-md cursor-pointer" onClick={() => handleClick(item.path)}>
                      {/* <item.icon className="text-[3.5rem] text-oliveGreen" /> */}
                      <div className="text-[3rem] text-oliveGreen">
                        {item.icon}
                      </div>
                      <div>
                        <p>{item.title}</p>
                        <p className="font-bold text-2xl">{item.count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-lg">Garbage Collection</p>
                <div className="flex flex-row gap-4">
                  {garbagePickUpBreakDown.map(item => (
                    <div key={item.index} className="bg-white rounded-md w-[15rem] p-5 flex flex-row items-center gap-4 hover:shadow-md cursor-pointer" onClick={() => handleClick(item.path)}>
                      <div className="text-[3rem] text-orange">
                        {item.icon}
                      </div>
                      <div>
                        <p>{item.title}</p>
                        <p className="font-bold text-2xl">{item.count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-lg">Store Account Registration Requests</p>
                <div className="flex flex-row gap-4">
                  {storesRequests.map(item => (
                    <div key={item.index} className="bg-white rounded-md w-[15rem] p-5 flex flex-row items-center gap-4 hover:shadow-md cursor-pointer" onClick={() => handleClick(item.path)}>
                      <div className="text-[3rem] text-green">
                        {item.icon}
                      </div>
                      <div>
                        <p>{item.title}</p>
                        <p className="font-bold text-2xl">{item.count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full">
              <p className="mb-2">Upcoming Garbage Collection</p>
              {dataSource.length === 0 ? (
                <div>
                  <p className="rounded-md shadow-md bg-white p-3 h-[30rem] flex justify-center items-center w-full"> No Data</p>
                </div>
              ) : (
                <div className="rounded-md shadow-md bg-white p-3 h-[30rem]">
                  {dataSource.map((item, index) => (
                    <div key={index} className={`text-white max-h-24 overflow-y-scroll scrollbar-none cursor-pointer hover:shadow-md rounded-md p-4 ${index % 2 === 0 ? 'bg-oliveGreen' : 'bg-mutedGreen'}`} onClick={() => navigate('/requests')}>
                      <p>{item.storeName}</p>
                      <p className="text-sm">{item.date}</p>
                    </div>
                  ))}</div>
              )}
            </div>
          </div>
        ) : userDetails && userDetails.type === "client" && (
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="bg-white rounded-md w-[22rem] p-5 flex flex-row items-center gap-4 hover:shadow-md cursor-pointer" onClick={() => navigate('/store')}>
                <VscRequestChanges className="text-[3.5rem] text-oliveGreen" />
                <div>
                  <p>Account Registration Requests</p>
                  <p className="font-bold text-2xl">{storeReq}</p>
                </div>
              </div>
              <div className="bg-white rounded-md w-[22rem] p-5 flex flex-row items-center gap-4 hover:shadow-md cursor-pointer" onClick={() => navigate('/store')}>
                <IoStorefrontOutline className="text-[3.5rem] text-oliveGreen" />
                <div>
                  <p>Total Stores</p>
                  <p className="font-bold text-2xl">{activeStoresCount}</p>
                </div>
              </div>
              <div className="bg-white rounded-md w-[22rem] p-5 flex flex-row items-center gap-4 hover:shadow-md cursor-pointer" onClick={() => navigate('/requests')}>
                <PiTruck className="text-[3.5rem] text-oliveGreen" />
                <div>
                  <p>Garbage Pick-up Requests</p>
                  <p className="font-bold text-2xl">{pickUpRequestsCount}</p>
                </div>
              </div>
            </div>
            <div className="w-fit">
              <p className="mb-2">Upcoming Garbage Collection</p>
              {loading ? (
                <div classname="w-full p-9 flex flex-row items-center justify-center">
                  {showLoader()}
                </div>
              ) : (
                <div className="overflow-y-scroll scrollbar-none">
                  {dataSource.map((item, index) => (
                    <div key={index} className={`text-white w-[20rem] cursor-pointer hover:shadow-md rounded-md p-4 ${index % 2 === 0 ? 'bg-oliveGreen' : 'bg-mutedGreen'}`} onClick={() => navigate('/requests')}>
                      <p classname="font-bold">{item.storeName}</p>
                      <p className="text-sm">{item.date}</p>
                    </div>
                  ))}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div >
  );
}
export default Dashboard;
