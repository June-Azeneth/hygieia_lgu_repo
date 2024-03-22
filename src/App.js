import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Dashboard from './Pages/Dashboard/Dashboard';
import Scheduler from './Pages/Scheduler/Scheduler';
import Reports from './Pages/Reports/Reports';
import Requests from './Pages/Requests/Requests';
import Login from './Pages/Login/LoginPage';
import { AuthProvider } from './Helpers/Context/AuthContext';
import PrivateRoute from './Components/PrivateRoute';
// import List from './Pages/StoreManagement/StoreList/List.'
import StoreProfile from './Pages/StoreManagement/StoreProfile/StoreProfile'
import Transactions from './Pages/Transaction/Transactions';
import StoresList from './Pages/StoreManagement/StoreList/StoresList'

function App() {
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
