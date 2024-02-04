import React from "react";
import styles from './dashboard.module.css';
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io"
import * as GiIcons from "react-icons/gi"
import { IconContext } from 'react-icons';
// import { Col, Form, Row, Tab, Tabs, Container } from "react-bootstrap";

import newcustomer from '../../Assets/newcustomers.png'
import NewStores from '../../Assets/newstores.png'
import total_users from '../../Assets/total_users.png'

function Dashboard() {
  return (
    <div className='p-5'>
      <div className="flex flex-col gap-3 lg:w-96">
        <p>User Summary</p>
        <div className="bg-white rounded-md flex p-3">
          <img src={NewStores} alt='...' />
          <div className="flex flex-col ml-4 justify-center">
            <p>New Stores</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>

        <div className="bg-white rounded-md flex p-3">
          <img src={NewStores} alt='...' />
          <div className="flex flex-col ml-4 justify-center">
            <p>New Customers</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>

        <div className="bg-white rounded-md flex p-3">
          <img src={NewStores} alt='...' />
          <div className="flex flex-col ml-4 justify-center">
            <p>Total Earnings</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>

        <div className="bg-white rounded-md flex p-3">
          <img src={NewStores} alt='...' />
          <div className="flex flex-col ml-4 justify-center">
            <p>Total Earnings</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
