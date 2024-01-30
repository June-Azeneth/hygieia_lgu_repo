import './App.css';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/navbar';
import Dashboard from './Pages/Dashboard/dashboard';
import Scheduler from './Pages/Scheduler/scheduler';
import Reports from './Pages/Reports/reports';
import Requests from './Pages/Requests/requests';
import Storelist from './Pages/StoreManagement/StoreList/storelist';

function App() {
  return (
    <div className="">
      <Router>
        <Navbar />
        <Routes>
          <Route path='/home' element={<Dashboard />} />
          <Route path='/scheduler' element={<Scheduler />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/requests' element={<Requests />} />
          <Route path='/store' element={<Storelist />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
