// src/context/AuthProvider.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ username: null, token: null, role: null, id: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            const user = JSON.parse(storedUser);
            setAuth({
                username: user.email,
                token: token,
                role: user.role,
                id: user.id,
            });
        }

        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show loading until auth is initialized
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
