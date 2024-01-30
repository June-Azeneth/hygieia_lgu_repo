import React from "react";
import styles from './dashboard.module.css';
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io"
import * as GiIcons from "react-icons/gi"
import { IconContext } from 'react-icons';
import { Col, Form, Row, Tab, Tabs, Container } from "react-bootstrap";

import newcustomer from '../../Assets/newcustomers.png'
import newStores from '../../Assets/newstores.png'
import total_users from '../../Assets/total_users.png'

function Dashboard() {
  return (
    <IconContext.Provider value={{ color: '#5F8604' }}>
      <div className="container m-0 sm-">
        <Container className="m-0 p-0">
          <Row>
            <Col sm={12} md={6} lg={3}>
              <div className="d-flex flex-column ">
                <h6>User Summary</h6>
                <div className={`${styles.card} mb-2`} >
                  <img className="" src={newStores} alt="" />
                  <div className="d-flex flex-column">
                    <span>New Stores</span>
                    <span>0</span>
                  </div>
                </div>
                <div className={`${styles.card} mb-2`}>
                  <img className="" src={newcustomer} alt="" />
                  <div className="d-flex flex-column">
                    <span>New Customers</span>
                    <span>0</span>
                  </div>
                </div>
                <div className={`${styles.card} mb-2`}>
                  <img className="" src={total_users} alt="" />
                  <div className="d-flex flex-column">
                    <span>Total Users</span>
                    <span>0</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col>
              <div className="d-flex flex-column">
                <h6>Upcoming Pickups</h6>
                <div className="overflow-hidden d-flex flex-column">
                  <div className={`${styles.card} mb-2`}>
                    <img className="" src={total_users} alt="" />
                    <div className="d-flex flex-column">
                      <span>Total Users</span>
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

      </div>
    </IconContext.Provider>
  );
}

export default Dashboard;
