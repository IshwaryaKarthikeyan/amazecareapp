import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reenterPassword, setReenterPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        number: false,
        specialChar: false,
    });

    const navigate = useNavigate();

    const validateEmail = (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value);
    };

    const validatePassword = (value) => {
        const length = value.length >= 8;
        const uppercase = /[A-Z]/.test(value);
        const number = /\d/.test(value);
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        return { length, uppercase, number, specialChar };
    };

    const validateContactNumber = (value) => {
        const phonePattern = /^\d{10}$/;  // Basic 10-digit number validation
        return phonePattern.test(value);
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        const criteria = validatePassword(value);
        setPasswordCriteria(criteria);

        const isValid = Object.values(criteria).every(Boolean);
        setPasswordError(
            isValid ? '' : 'Password must include at least 8 characters, an uppercase letter, a number, and a special character.'
        );
    };

    const validateField = (name, value) => {
        let errorMsg = '';
        switch (name) {
            case 'email':
                errorMsg = !value ? 'Email is required' : !validateEmail(value) ? 'Invalid email format' : '';
                break;
            case 'password':
                errorMsg = !value ? 'Password is required' : '';
                break;
            case 'reenterPassword':
                errorMsg = value !== password ? 'Passwords do not match' : '';
                break;
            case 'fullName':
                errorMsg = !value ? 'Full Name is required' : '';
                break;
            case 'dateOfBirth':
                errorMsg = !value ? 'Date of Birth is required' : '';
                break;
            case 'gender':
                errorMsg = !value ? 'Gender is required' : '';
                break;
            case 'contactNumber':
                errorMsg = !value ? 'Contact Number is required' : !validateContactNumber(value) ? 'Invalid contact number' : '';
                break;
            default:
                break;
        }

        setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const requiredFields = { fullName, email, password, reenterPassword, dateOfBirth, gender, contactNumber };
        let valid = true;
        for (const field in requiredFields) {
            validateField(field, requiredFields[field]);
            if (!requiredFields[field] || (field === 'reenterPassword' && password !== reenterPassword)) {
                valid = false;
            }
        }

        if (!valid) return;

        try {
            const userData = {
                user: {
                    email,
                    password,
                    role: 'PATIENT',
                },
                fullName,
                dateOfBirth,
                gender,
                contactNumber,
            };

            await authService.register(userData);
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError('Email is already registered. Please use a different email.');
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div>
            <br/><br/><br/>
            <Container className="mt-5">
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Card className="p-4 shadow-sm">
                            <Card.Body>
                                <h2 className="text-center mb-4">Register as a Patient</h2>
                                {error && <Alert variant="danger">{error}</Alert>}
                                {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                                <Form onSubmit={handleRegister}>
                                    
                                    {/* Full Name */}
                                    <Form.Group className="mb-3" controlId="formFullName">
                                        <Form.Label>Full Name <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => { setFullName(e.target.value); validateField('fullName', e.target.value); }}
                                            placeholder="Enter your full name"
                                            required
                                            className="w-100"
                                        />
                                        {fieldErrors.fullName && <div style={{ color: 'red' }}>{fieldErrors.fullName}</div>}
                                    </Form.Group>

                                    {/* Email */}
                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label>Email <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); validateField('email', e.target.value); }}
                                            placeholder="Enter your email"
                                            required
                                            className="w-100"
                                        />
                                        {fieldErrors.email && <div style={{ color: 'red' }}>{fieldErrors.email}</div>}
                                    </Form.Group>

                                    {/* Password */}
                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <Form.Label>Password <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter your password"
                                            required
                                            className="w-100"
                                        />
                                        {fieldErrors.password && <div style={{ color: 'red' }}>{fieldErrors.password}</div>}

                                        {/* Password Criteria */}
                                        <ul style={{ color: 'red', fontSize: 'small' }}>
                                            <li style={{ color: passwordCriteria.length ? 'green' : 'red' }}>At least 8 characters</li>
                                            <li style={{ color: passwordCriteria.uppercase ? 'green' : 'red' }}>One uppercase letter</li>
                                            <li style={{ color: passwordCriteria.number ? 'green' : 'red' }}>One number</li>
                                            <li style={{ color: passwordCriteria.specialChar ? 'green' : 'red' }}>One special character</li>
                                        </ul>
                                    </Form.Group>

                                    {/* Re-enter Password */}
                                    <Form.Group className="mb-3" controlId="formReenterPassword">
                                        <Form.Label>Re-enter Password <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={reenterPassword}
                                            onChange={(e) => { setReenterPassword(e.target.value); validateField('reenterPassword', e.target.value); }}
                                            placeholder="Re-enter your password"
                                            required
                                            className="w-100"
                                        />
                                        {fieldErrors.reenterPassword && <div style={{ color: 'red' }}>{fieldErrors.reenterPassword}</div>}
                                    </Form.Group>

                                    {/* Date of Birth */}
                                    <Form.Group className="mb-3" controlId="formDateOfBirth">
                                        <Form.Label>Date of Birth <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={dateOfBirth}
                                            onChange={(e) => { setDateOfBirth(e.target.value); validateField('dateOfBirth', e.target.value); }}
                                            required
                                            className="w-100"
                                        />
                                        {fieldErrors.dateOfBirth && <div style={{ color: 'red' }}>{fieldErrors.dateOfBirth}</div>}
                                    </Form.Group>

                                    {/* Gender */}
                                    <Form.Group className="mb-3" controlId="formGender">
                                        <Form.Label>Gender <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Select
                                            value={gender}
                                            onChange={(e) => { setGender(e.target.value); validateField('gender', e.target.value); }}
                                            required
                                            className="w-100"
                                        >
                                            <option value="">Select your gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                        {fieldErrors.gender && <div style={{ color: 'red' }}>{fieldErrors.gender}</div>}
                                    </Form.Group>

                                    {/* Contact Number */}
                                    <Form.Group className="mb-3" controlId="formContactNumber">
                                        <Form.Label>Contact Number <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="tel"
                                            value={contactNumber}
                                            onChange={(e) => { setContactNumber(e.target.value); validateField('contactNumber', e.target.value); }}
                                            placeholder="Enter your contact number"
                                            required
                                            className="w-100"
                                        />
                                        {fieldErrors.contactNumber && <div style={{ color: 'red' }}>{fieldErrors.contactNumber}</div>}
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="w-100">
                                        Register as Patient
                                    </Button>
                                </Form>

                                <div className="text-center mt-3">
                                    <small>
                                        Already have an account? <a href="/login">Login here</a>
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

export default Register;