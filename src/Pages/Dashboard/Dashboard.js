import React, { useEffect, useState } from "react";
import { useAuth } from '../../Helpers/Context/AuthContext'

import { IoStorefrontOutline } from "react-icons/io5";
import { VscRequestChanges } from "react-icons/vsc";
import { PiTruck } from "react-icons/pi";

import {
  showLoader
} from '../../Helpers/Utils/Common'

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const { userDetails } = useAuth()
  const [user, setUser] = useState("Unknown User");
  const [admin, setAdmin] = useState("")

  useEffect(() => {
    if (userDetails) {
      setLoading(true)
      setUser(userDetails.name || "Unauthenticated Access");
      setAdmin(userDetails.type || "Unknown account")
      setLoading(false)
    }
  }, [userDetails]);

  return (
    <div className='container text-darkGray'>
      <p className="font-bold text-xl">Welcome Back {user}!</p>
      <div className="mt-4">
        {loading ? (
          <div className="w-full h-56 flex justify-center items-center">
            {showLoader()}
          </div>
        ) : admin === "admin" ? (
          <div>
            Admin
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="bg-white rounded-md w-[22rem] p-5 flex flex-row items-center gap-4 shadow-md">
              <VscRequestChanges className="text-[3.5rem] text-oliveGreen" />
              <div>
                <p>Account Registration Requests</p>
                <p className="font-bold text-lg">100</p>
              </div>
            </div>

            <div className="bg-white rounded-md w-[22rem] p-5 flex flex-row items-center gap-4 shadow-md">
              <IoStorefrontOutline className="text-[3.5rem] text-oliveGreen" />
              <div>
                <p>Total Stores</p>
                <p className="font-bold text-lg">100</p>
              </div>
            </div>

            <div className="bg-white rounded-md w-[22rem] p-5 flex flex-row items-center gap-4 shadow-md">
              <PiTruck className="text-[3.5rem] text-oliveGreen" />
              <div>
                <p>Garbage Pick-up Requests</p>
                <p className="font-bold text-lg">100</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;
