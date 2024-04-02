import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Dashboard from './Pages/Dashboard/Dashboard';
import Scheduler from './Pages/Scheduler/Scheduler';
import Reports from './Pages/Reports/Reports';
import Requests from './Pages/Requests/Requests';
import Login from './Pages/Login/LoginPage';
import { AuthProvider } from './Helpers/Repository/AuthContext';
import PrivateRoute from './Components/PrivateRoute';
// import List from './Pages/StoreManagement/StoreList/List.'
import StoreProfile from './Pages/StoreManagement/StoreProfile'
import Transactions from './Pages/Transaction/Transactions';
import StoresList from './Pages/StoreManagement/StoreList/StoresList'
import StoreAccountRequest from './Pages/StoreManagement/StoreAccountRequest';
import ClientManager from './Pages/Client/ClientManager';
import ConsumerList from './Pages/Consumer/ConsumerList';
import AdminManager from './Pages/Admin/AdminManager'

import { useAuth } from './Helpers/Repository/AuthContext'
import { useEffect, useState } from 'react';

function App() {
  // const { currentUser } = useAuth()
  const [type, setType] = useState("admin")
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   try {
  //     if (currentUser && currentUser.type === "client") {
  //       setType("client");
  //     } else {
  //       setType("admin");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false); // Set loading to false once the effect is done
  //   }
  // }, [currentUser]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route
            path='/*'
            element={
              <>
                <Navbar />
                <Routes>
                  <Route element={<PrivateRoute />}>
                    <Route path="/home" element={<Dashboard />} />
                    <Route path='/transactions' element={<Transactions />} />
                    <Route path='/scheduler' element={<Scheduler />} />
                    <Route path='/reports' element={<Reports />} />
                    <Route path='/requests' element={<Requests />} />
                    <Route path='/store' element={<StoresList />} />
                    <Route path='/store-profile/:id' element={<StoreProfile />} />
                    <Route path="/account-request/:id" element={<StoreAccountRequest />} />
                    <Route path='/clients' element={<ClientManager />} />
                    <Route path='/consumers' element={<ConsumerList />} />
                    <Route path='/admin' element={<AdminManager />} />
                  </Route>
                </Routes>
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
