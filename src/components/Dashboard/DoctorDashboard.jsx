// src/components/Dashboard/DoctorDashboard.js
import { faBookMedical, faCalendarDays, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {

    const navigate = useNavigate();

    useEffect(() => {
        navigate('update-profile');
    }, []);

    return (
        <Container fluid>
            <Row>
                {/* Sidebar */}
                <Col md={3} className="sidebar  ">
                    <Nav className="flex-column p-3">
                        <Nav.Item>
                            <Nav.Link as={Link} to="view-appointments">
                            <FontAwesomeIcon icon={faCalendarDays} /> &nbsp;
                                View Appointments</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="manage-consultations">
                            <FontAwesomeIcon icon={faBookMedical} /> &nbsp;
                                Manage Consultations</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="update-profile">
                            <FontAwesomeIcon icon={faUserDoctor} /> &nbsp;
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

export default DoctorDashboard;
