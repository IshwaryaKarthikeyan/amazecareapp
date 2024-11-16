import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const ErrorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract error information from state or default to 404
    const state = location.state || {};
    const code = state.code || 404; // Default to 404 if not provided
    const message = state.message || "Page not found";

    return (
        <Container className="text-center mt-5">
            <Row>
                <Col className='mt-5 mt-5'>
                    <h1>Error {code}</h1>
                    <p>{message}</p>
                    {code === 404 && (
                        <p>The page <strong>{location.pathname}</strong> could not be found.</p>
                    )}
                    <Button variant="primary" onClick={() => navigate(-1)}>Go Back</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ErrorPage;
