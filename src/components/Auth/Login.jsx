import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import authService from '../../services/AuthService';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    // Real-time email validation
    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailError(!emailPattern.test(emailValue) ? 'Please enter a valid email address.' : '');
    };

    // Real-time password validation
    const handlePasswordChange = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);
        setPasswordError(passwordValue.length === 0 ? 'Password must not be empty.' : '');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!emailError && !passwordError) {
            try {
                const data = await authService.login(email, password);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    email: data.email,
                    role: data.role,
                    id: data.id
                }));

                setAuth({
                    username: data.email,
                    token: data.token,
                    role: data.role,
                    id: data.id
                });

                const redirectPath = data.role === 'PATIENT' ? '/patient/dashboard' : 
                                     data.role === 'DOCTOR' ? '/doctor/dashboard' : 
                                     '/admin/dashboard';
                navigate(redirectPath);
            } catch (err) {
                setError('Invalid email or password. Please try again.');
            }
        } else {
            setError('Please fix the validation errors.');
        }
    };

    return (
        <div>
            <br /><br /><br />
            <Container className="mt-5">
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Card className="p-4 shadow-sm">
                            <Card.Body>
                                <h2 className="text-center mb-4">Login</h2>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form noValidate onSubmit={handleLogin}>
                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            placeholder="Enter your email"
                                            required
                                            isInvalid={!!emailError}
                                            className="w-100"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {emailError}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter your password"
                                            required
                                            isInvalid={!!passwordError}
                                            className="w-100"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {passwordError}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="w-100">
                                        Login
                                    </Button>
                                </Form>

                                <div className="text-center mt-3">
                                    <small>
                                        Don't have an account?{' '}
                                        <a href="/register">Register here</a>
                                    </small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
