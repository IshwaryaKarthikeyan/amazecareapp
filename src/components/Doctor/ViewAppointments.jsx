import React, { useState, useEffect, useContext } from 'react';
import appointmentService from '../../services/AppointmentService';
import patientService from '../../services/PatientService'; // Import patientService to fetch patient details
import { Card, Form, Button } from 'react-bootstrap'; // Import Bootstrap components
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import doctorService from '../../services/DoctorService';

const ViewAppointments = () => {
    const [appointmentsWithPatientNames, setAppointmentsWithPatientNames] = useState([]); // State to hold appointments with patient names
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    // Fetch appointments for the logged-in doctor
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const doctorData = await doctorService.getDoctorByUserId(auth.id); // Get the doctor by user ID
                const doctorId = doctorData.id; // Get the doctor ID

                const appointments = await appointmentService.getAppointmentsByDoctor(doctorId);
                const updatedAppointments = await Promise.all(
                    appointments.map(async (appointment) => {
                        // Fetch patient details for each appointment
                        const patient = await patientService.getPatientById(appointment.patientId);
                        return {
                            ...appointment,
                            patientName: patient.fullName, // Attach patient name to each appointment
                        };
                    })
                );
                setAppointmentsWithPatientNames(updatedAppointments); // Set the updated appointments with patient names
            } catch (error) {
                console.error('Error fetching appointments or patient details', error);
            }
        };
        fetchAppointments();
    }, [auth.id]);

    // Handle status change for an appointment
    const handleStatusChange = async (appointmentId, newStatus) => {
        try {
            // Update on the backend using the new updateStatus method
            await appointmentService.updateStatus(appointmentId, newStatus);

            // Update the state with the new status
            setAppointmentsWithPatientNames((prevAppointments) =>
                prevAppointments.map((appointment) =>
                    appointment.id === appointmentId
                        ? { ...appointment, status: newStatus }
                        : appointment
                )
            );
        } catch (error) {
            console.error('Error updating appointment status', error);
        }
    };

    return (
        <div>
            <h3>View Appointments</h3>
            <div className="d-flex flex-wrap">
                {appointmentsWithPatientNames.map((appointment) => (
                    <Card key={appointment.id} className="m-3 shadow-sm" style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>{`Appointment with ${appointment.patientName}`}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{`Date: ${appointment.appointmentDate}`}</Card.Subtitle>
                            <Card.Text>{`Symptoms: ${appointment.symptoms}`}</Card.Text>

                            {/* Status Dropdown inside the card */}
                            <Form.Group controlId={`status-${appointment.id}`} className="mt-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={appointment.status}
                                    onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                                >
                                    <option value="UPCOMING">Upcoming</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </Form.Control>
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                className="mt-3 w-100" 
                                onClick={() => navigate(`../appointment-details/${appointment.id}`)}
                            >
                                View Details
                            </Button>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ViewAppointments;
