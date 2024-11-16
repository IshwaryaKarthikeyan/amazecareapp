// src/components/Shared/Navbar.js
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Button, Form, ThemeProvider } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartPulse, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import '../Styles/Navbar.css';

const NavigationBar = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            setIsDarkMode(true);
        }
    }, []);

    const handleToggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        document.body.classList.toggle('dark-theme', newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');

    };

    const handleLogout = () => {
        localStorage.clear();
        setAuth({ username: null, token: null, role: null, id: null });
        navigate('/login');
    };

    let roleLabel = '';
    if (auth.role === 'ADMIN') roleLabel = 'Admin';
    else if (auth.role === 'DOCTOR') roleLabel = 'Doctor';
    else if (auth.role === 'PATIENT') roleLabel = 'Patient';

    return (
        <Navbar className="custom-navbar" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <FontAwesomeIcon icon={faHeartPulse} className="me-2" />
                    AmazeCare
                </Navbar.Brand>
                
                {auth.role && <span className="role-badge">Logged in as: {roleLabel}</span>}

                <Navbar.Collapse className="justify-content-end">
                    {auth.token && (
                        <Button variant="outline-light" onClick={handleLogout}>
                            Logout
                        </Button>
                    )}
                        <div className="theme-toggle">
                        <Form.Check 
                            type="switch"
                            id="theme-toggle"
                            label={isDarkMode ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}
                            onChange={handleToggleTheme}
                            checked={isDarkMode}
                        />
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
