import React, { useEffect } from 'react';  
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DoctorService from '../../services/DoctorService';

export const AddDoctor = () => {
    const { email: paramEmail } = useParams();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [fullName, setFullName] = React.useState('');
    const [specialty, setSpecialty] = React.useState('');
    const [experience, setExperience] = React.useState('');
    const [qualification, setQualification] = React.useState('');
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (paramEmail) {
            DoctorService.getDoctorByEmail(paramEmail)
                .then((response) => {
                    const doctor = response.data;
                    setEmail(doctor.user.email);
                    setPassword(doctor.user.password);
                    setFullName(doctor.fullName);
                    setSpecialty(doctor.specialty);
                    setExperience(doctor.experience);
                    setQualification(doctor.qualification);
                })
                .catch((error) => {
                    console.error("There was an error fetching the doctor details!", error);
                    setError("There was an issue retrieving the doctor details.");
                });
        }
    }, [paramEmail]);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Create the doctor object matching the backend format
        const doctor = {
            user: {
                email: email,
                password: password,
                role: 'DOCTOR' // Hardcoded as 'DOCTOR'
            },
            fullName: fullName,
            specialty: specialty,
            experience: experience,
            qualification: qualification,
            appointments: [] // Leave appointments empty for now
        };

        console.log("Doctor to be added/updated:", doctor);

        if (paramEmail) {
            // Update an existing Doctor
            DoctorService.updateDoctor(paramEmail, doctor)
                .then((response) => {
                    console.log("Doctor updated successfully:", response.data);
                    navigate('/manage-doctors'); // Navigate to manage doctors page after successful update
                })
                .catch((error) => {
                    console.error("There was an error updating the Doctor!", error);
                    setError("There was an issue updating the Doctor.");
                });
        } else {
            // Save a new Doctor
            DoctorService.addDoctor(doctor)
                .then((response) => {
                    console.log("Doctor added successfully:", response.data);
                    navigate('../manage-doctors'); // Navigate to manage doctors page after successful submission
                })
                .catch((error) => {
                    console.error("There was an error adding the Doctor", error);
                    setError("There was an issue saving the Doctor.");
                });
        }
    };

    return (
        <div>
            <Container>
                <Row className="justify-content-md-center mt-5">
                    <Col md={6}>
                        <h2 className="text-center">{paramEmail ? "Update Doctor" : "Add a New Doctor"}</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <Form className="row g-3" onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={!!paramEmail} // Disable email field when updating
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formFullName">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formSpecialty">
                                <Form.Label>Specialty</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Specialty"
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formExperience">
                                <Form.Label>Experience</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Experience"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formQualification">
                                <Form.Label>Qualification</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Qualification"
                                    value={qualification}
                                    onChange={(e) => setQualification(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                {paramEmail ? "Update Doctor" : "Add Doctor"}
                            </Button>
                        </Form>
                        <Link to='../manage-doctors' className='btn btn-danger mt-3'>Back to Doctor List</Link>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
