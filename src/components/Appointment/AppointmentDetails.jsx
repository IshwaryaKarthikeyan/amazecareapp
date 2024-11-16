// src/components/Patient/AppointmentDetails.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import appointmentService from '../../services/AppointmentService';
import patientService from '../../services/PatientService'; // Import patient service
import doctorService from '../../services/DoctorService'; // Import doctor service
import { Card, Container, Button, Spinner } from 'react-bootstrap';

const AppointmentDetails = () => {
    const { appointmentId } = useParams(); // Get appointmentId from URL
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [patientName, setPatientName] = useState(''); // State for patient name
    const [doctorName, setDoctorName] = useState(''); // State for doctor name

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            try {
                const response = await appointmentService.getAppointmentById(appointmentId);
                console.log("APPOINTMENT RESPONSE: ",response);
                setAppointment(response);

                // Fetch patient name
                const patientResponse = await patientService.getPatientById(response.patientId);
                setPatientName(patientResponse?.fullName || 'Unknown Patient'); // Fallback

                // Fetch doctor name
                const doctorResponse = await doctorService.getDoctorById(response.doctorId);
                setDoctorName(doctorResponse?.fullName || 'Unknown Doctor'); // Fallback

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load appointment details. Please try again later.');
                setLoading(false);
            }
        };

        fetchAppointmentDetails();
    }, [appointmentId]);

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status" />
                <p>Loading appointment details...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <p className="text-danger">{error}</p>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            {appointment && (
                <Card className="p-4 shadow-sm">
                    <Card.Body>
                    <Card.Title className="mb-4" style={{ fontSize: '1.75rem', fontWeight: '700', color: '#e11541' }}>
                            Appointment Details
                        </Card.Title>
                        <hr/>
                        <p><strong>Patient Name:</strong> {patientName}</p>
                        <p><strong>Doctor Name:</strong> {doctorName}</p>
                        <p><strong>Appointment Date and Time:</strong> {new Date(appointment.appointmentDate).toLocaleString()}</p>
                        <p><strong>Symptoms:</strong> {appointment.symptoms}</p>
                        <p><strong>Status:</strong> {appointment.status}</p>

                        <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button> {/* Navigate back to the previous page */}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default AppointmentDetails;
