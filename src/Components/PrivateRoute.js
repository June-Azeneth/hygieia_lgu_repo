import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Helpers/Context/AuthContext';
import Unauthorized from '../Pages/Unauthorized';

const PrivateRoute = () => {
    const { currentUser } = useAuth();
    return currentUser ? <Outlet/> : <Unauthorized/>
};

export default PrivateRoute;
