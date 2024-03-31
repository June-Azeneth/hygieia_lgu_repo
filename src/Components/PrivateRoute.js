import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../Helpers/Repository/AuthContext';
import Unauthorized from '../Pages/Unauthorized';

const PrivateRoute = () => {
    const { currentUser } = useAuth();
    return currentUser ? <Outlet/> : <Unauthorized/>
};

export default PrivateRoute;
