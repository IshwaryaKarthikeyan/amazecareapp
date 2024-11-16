import React, { useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useContext(AuthContext); // Access the full auth object
    const location = useLocation();

    // Check if the user is authenticated (token exists)
    if (!auth || !auth.token) {
        return <Navigate to="/" state={{ from: location, message:"Session Expired, You have been redirected to the Home Page." }} replace />;
    }

    // If `allowedRoles` is provided, check if the user's role is allowed
    if (allowedRoles && !allowedRoles.includes(auth.role)) {
        // Redirect to ErrorPage with 403 Forbidden if the user does not have the required role
        return <Navigate to="/error" state={{ code: 403, message: "Forbidden: You do not have permission to access this page." }} replace />;
    }

    // If authenticated and role is allowed (or no specific role restrictions), render the child components
    return <Outlet />;
};

export default RequireAuth;
