import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Dashboard from './Pages/Dashboard/Dashboard';
import Scheduler from './Pages/Scheduler/Scheduler';
import Reports from './Pages/Reports/Reports';
import Requests from './Pages/Requests/Requests';
// import {StoresList} from './Pages/StoreManagement/StoreList/StoresList';
import Login from './Pages/Login/LoginPage';
import { AuthProvider } from './Helpers/Context/AuthContext';
import PrivateRoute from './Components/PrivateRoute';
import List from './Pages/StoreManagement/StoreList/List.'
import Transactions from './Pages/Transaction/Transactions';

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
                    <Route path='/store' element={<List />} />
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
