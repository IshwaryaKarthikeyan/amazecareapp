// src/components/Dashboard/AdminDashboard.js
import React, { useEffect } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import '../Styles/Dashboard.css';
import { faCalendarDays, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdminDashboard = () => {

    const navigate = useNavigate();

    useEffect(() => {
        navigate('manage-doctors');
    }, []);

    return (
        <Container fluid className='dashboard-container'>
            <Row>
                {/* Sidebar */}
                <Col md={3} className="sidebar">
                    <Nav className="flex-column p-3">
                        <Nav.Item>
                            <Nav.Link as={Link} to="manage-doctors">
                            <FontAwesomeIcon icon={faUserDoctor} /> &nbsp;
                                Manage Doctors</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="manage-appointments">
                            <FontAwesomeIcon icon={faCalendarDays} /> &nbsp;
                                Manage Appointments</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>

                {/* Content Area */}
                <Col md={9} className="content-box">
                    <Outlet /> {/* This renders the selected component based on the sidebar link clicked */}
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
