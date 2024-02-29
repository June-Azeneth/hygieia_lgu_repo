import React from "react";

import NewStores from '../../Assets/newstores.png'

function Dashboard() {
  const data = [
    { sitio: "Kasuntingan", date: "January 25" },
    { sitio: "Nangka", date: "January 29" },
    { sitio: "Nangka", date: "January 29" },
    { sitio: "Nangka", date: "January 29" },
  ];

  const _data = [
    { id: 1, store: 'John', customer: 30, product: "chocolate", status: "Completed" },
    { id: 2, store: 'John', customer: 30, product: "chocolate", status: "Completed" },
    { id: 3, store: 'John', customer: 30, product: "chocolate", status: "Completed" },
  ];

  const handleViewClick = (customerId) => {
    // Handle the view button click, for example, navigate to a new page with the customer's ID
    console.log('View button clicked for customer ID:', customerId);
  };

  return (
    <div className='p-5 md:pl-24'>
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex flex-col gap-3 lg:w-80">
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

          {/* <div className="bg-white rounded-md flex p-3">
          <img src={NewStores} alt='...' />
          <div className="flex flex-col ml-4 justify-center">
            <p>Total Earnings</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div> */}
        </div>

        <div>
          <p>Upcoming Garbage Collection Schedule</p>
          <ul className="mt-3">
            {data.map((item, index) => (
              <li key={index} className="mt-2 bg-mutedGreen text-white p-3 rounded-md">
                <div className="flex justify-between">
                  <p>{item.sitio}</p>
                  <p>{item.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <table className="w-full text-center bg-white rounded-md mt-4">
        <thead className="bg-green  text-white">
          <tr>
            <th>Transaction ID</th>
            <th>Store</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {_data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.store}</td>
              <td>{row.customer}</td>
              <td>{row.product}</td>
              <td>{row.status}</td>
              <td>
                <button className="bg-green text-white px-6 py-1 rounded-md" onClick={() => handleViewClick(row.id)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <div className="flex text-center mt-5 h-72">
        <div className="w-full p-4 h-full bg-white">PIE CHART</div>
        <div className="w-full p-4 h-full bg-white">LINE GRAP</div>
      </div> */}
    </div>
  );
}
export default Dashboard;
