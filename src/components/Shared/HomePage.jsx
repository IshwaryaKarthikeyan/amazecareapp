// src/components/HomePage.js
import React, { useContext } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import '../Styles/HomePage.css'; // Import CSS for custom styles

const HomePage = () => {
    const { auth } = useContext(AuthContext); // Get the auth context
    const navigate = useNavigate();


    // Navigate to the appropriate dashboard based on the user's role
    const handleDashboardRedirect = () => {
        if (auth.role === 'PATIENT') {
            navigate('/patient/dashboard');
        } else if (auth.role === 'DOCTOR') {
            navigate('/doctor/dashboard');
        } else if (auth.role === 'ADMIN') {
            navigate('/admin/dashboard');
        }
    };

    return (
        <div>
            <Container className="mt-5">
                {/* Hero Section with Background Image */}
                <section className="hero-section text-center text-light p-5 mb-5 rounded">
                    <Card style={{height: "250px"}} className="overlay p-2">
                        <h1 className="home-title">Welcome to AmazeCare Hospital!</h1>
                        <p>Your health, our priority. We provide top-notch medical services and consultations with our experienced medical professionals.</p>
                        <p className="button-group">
                        {auth.token ? (
                            <Button variant="primary" onClick={handleDashboardRedirect}>
                                Go To Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button as={Link} to="/login" variant="primary" className="me-3">
                                    Login
                                </Button>
                                <Button as={Link} to="/register" variant="secondary">
                                    Register
                                </Button>
                            </>
                        )}
                    </p>
                    </Card>
                </section>

                <Row className="mt-5">
                <Col md={4}>
                    <Card style={{height: "250px"}} className="p-4">
                        <h3>About Us</h3>
                        <p>
                            At AmazeCare, we believe in providing the best healthcare services for you and your family.
                            Our hospital is equipped with the latest technology and staffed by highly qualified professionals.
                        </p>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card style={{height: "250px"}} className="p-4">
                        <h3>Our Services</h3>
                        <p>
                            We offer a wide range of services, including general consultations, specialist treatments, surgeries, and emergency care.
                            Book an appointment today to experience the best medical care.
                        </p>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card style={{height: "250px"}} className="p-4">
                        <h3>Contact Us</h3>
                        <p>
                            Reach out to us for any queries or to book an appointment. Our team is here to assist you with all your healthcare needs.
                        </p>
                        <p><strong>Email:</strong> support@amazecare.com</p>
                        <p><strong>Phone:</strong> +1 234 567 890</p>
                    </Card>
                </Col>
            </Row>

            </Container>
        </div>
    );
};

export default HomePage;
