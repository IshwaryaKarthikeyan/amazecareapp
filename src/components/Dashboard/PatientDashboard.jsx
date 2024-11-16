// src/components/Dashboard/PatientDashboard.js
import { faBookMedical, faCalendarDays, faCalendarPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const PatientDashboard = () => {

    const navigate = useNavigate();

    useEffect(() => {
        navigate('update-profile');
    }, []);
    
    return (
        <Container fluid>
            <Row>
                {/* Sidebar */}
                <Col md={3} className="sidebar">
                    <Nav className="flex-column p-3">
                        <Nav.Item>
                            <Nav.Link as={Link} to="view-appointments">
                            <FontAwesomeIcon icon={faCalendarDays} /> &nbsp;
                                View Appointments</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="view-medical-records">
                            <FontAwesomeIcon icon={faBookMedical} /> &nbsp;
                                View Medical Records</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="schedule-appointment">
                            <FontAwesomeIcon icon={faCalendarPlus} /> &nbsp;
                                Schedule Appointment</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="update-profile">
                                <FontAwesomeIcon icon={faUser} /> &nbsp;
                                Update Profile</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>

                {/* Content Area */}
                <Col className="content-box">
                    <Outlet /> {/* This renders the selected component based on the sidebar link clicked */}
                </Col>
            </Row>
        </Container>
    );
};

export default PatientDashboard;
