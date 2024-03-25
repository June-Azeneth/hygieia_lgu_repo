import React, { useEffect, useState } from "react";
import { useAuth } from '../../Helpers/Context/AuthContext'

import { IoStorefrontOutline } from "react-icons/io5";
import { VscRequestChanges } from "react-icons/vsc";
import { PiTruck } from "react-icons/pi";

import {
  showLoader
} from '../../Helpers/Utils/Common'

import {
  getStores
} from '../../Helpers/Context/ClientRepo'

import { getRequests } from "../../Helpers/Context/RequestsRepo";

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const { userDetails } = useAuth()
  const [user, setUser] = useState("Unknown User");
  const [admin, setAdmin] = useState("")
  const [activeStores, setActiveStores] = useState(0)
  const [requests, setRequests] = useState(0)
  const [pickUp, setPickUp] = useState(0)

  const fetchData = async () => {
    if (userDetails) {
      const stores = await getStores(userDetails);
      const pickUpRequests = await getRequests(userDetails)
      const active = stores.filter(store => store.status === 'active');
      const pending = stores.filter(store => store.status === 'pending');
      setActiveStores(active.length)
      setRequests(pending.length)
      setPickUp(pickUpRequests.length)
    }
  }

  useEffect(() => {
    fetchData()
    if (userDetails) {
      setLoading(true)
      setUser(userDetails.name || "Unauthenticated Access");
      setAdmin(userDetails.type || "Unknown account")
      setLoading(false)
    }
  }, [userDetails]);

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='container text-darkGray'>
      <p className="font-bold text-xl">Welcome Back {user}!</p>
      <div className="mt-4">
        {loading ? (
          <div className="w-full h-56 flex justify-center items-center">
            {showLoader()}
          </div>
        ) : userDetails && userDetails.type === "admin" ? (
          <div>
            Admin
          </div>
        ) : userDetails && userDetails.type === "client" && (
          <div className="flex gap-3">
            <div className="bg-white rounded-md w-[22rem] p-5 flex flex-row items-center gap-4 shadow-md">
              <VscRequestChanges className="text-[3.5rem] text-oliveGreen" />
              <div>
                <p>Account Registration Requests</p>
                <p className="font-bold text-2xl">{requests}</p>
              </div>
            </div>

            <div className="bg-white rounded-md w-[22rem] p-5 flex flex-row items-center gap-4 shadow-md">
              <IoStorefrontOutline className="text-[3.5rem] text-oliveGreen" />
              <div>
                <p>Total Stores</p>
                <p className="font-bold text-2xl">{activeStores}</p>
              </div>
            </div>

            <div className="bg-white rounded-md w-[22rem] p-5 flex flex-row items-center gap-4 shadow-md">
              <PiTruck className="text-[3.5rem] text-oliveGreen" />
              <div>
                <p>Garbage Pick-up Requests</p>
                <p className="font-bold text-2xl">{pickUp}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;
