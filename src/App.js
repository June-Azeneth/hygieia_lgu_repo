import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/navbar';
import Dashboard from './Pages/Dashboard/dashboard';
import Scheduler from './Pages/Scheduler/scheduler';
import Reports from './Pages/Reports/reports';
import Requests from './Pages/Requests/requests';
import Storelist from './Pages/StoreManagement/StoreList/storelist';
import Login from './Pages/Login/LoginPage';
import { AuthProvider } from './Helpers/Context/AuthContext';
import PrivateRoute from './Components/PrivateRoute';

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
                    <Route path="/home" element={<Dashboard/>} />
                    <Route path='/scheduler' element={<Scheduler />} />
                    <Route path='/reports' element={<Reports />} />
                    <Route path='/requests' element={<Requests />} />
                    <Route path='/store' element={<Storelist />} />
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
