import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import doctorService from '../../services/DoctorService';
import appointmentService from '../../services/AppointmentService';
import patientService from '../../services/PatientService'; // Import patient service
import { Card, Container, Button, Spinner } from 'react-bootstrap';

const DoctorDetails = () => {
    const { doctorId } = useParams(); // Get doctorId from URL
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]); // State for appointments
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [patients, setPatients] = useState({}); // State to hold patient names
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const response = await doctorService.getDoctorById(doctorId);
                setDoctor(response);
            } catch (err) {
                setError('Failed to load doctor details.');
            }
        };

        const fetchDoctorAppointments = async () => {
            try {
                const fetchedAppointments = await appointmentService.getAppointmentsByDoctor(doctorId);
                setAppointments(fetchedAppointments);
                
                // Fetch patient names for each appointment
                const patientPromises = fetchedAppointments.map(appointment =>
                    patientService.getPatientById(appointment.patientId)
                        .then(patient => ({ id: appointment.patientId, name: patient.fullName }))
                        .catch(() => ({ id: appointment.patientId, name: 'Unknown Patient' }))
                );
                
                // Wait for all patient names to be fetched
                const patientsData = await Promise.all(patientPromises);
                const patientsMap = patientsData.reduce((map, patient) => {
                    map[patient.id] = patient.name;
                    return map;
                }, {});
                
                setPatients(patientsMap); // Store patient names in state
            } catch (err) {
                setError('Failed to load appointments.');
            }
        };

        // Fetch doctor details and appointments in parallel
        Promise.all([fetchDoctorDetails(), fetchDoctorAppointments()]).then(() => {
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, [doctorId]);

    if (loading) {
        return 
        <div>
        <Spinner animation="border" role="status"></Spinner>
        <p>Loading...</p>;
        </div>
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    return (
        <Container className="mt-5">
            {doctor && (
                <Card className="p-4 shadow-sm">
                    <Card.Body>
                        <Card.Title style={{fontWeight:500, fontSize:'1.75rem'}}>{doctor.fullName}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{doctor.specialty}</Card.Subtitle>
                        <hr/>
                        <p><strong>Email:</strong> {doctor.user?.email}</p>
                        <p><strong>Experience:</strong> {doctor.experience} years</p>
                        <p><strong>Qualification:</strong> {doctor.qualification}</p>

                        {/* Render Appointments if available */}
                        <h5>Appointments:</h5>
                        {appointments && appointments.length > 0 ? (
                            <ul>
                                {appointments.map((appointment) => (
                                    <li key={appointment.id}>
                                        {`Appointment with Patient: ${patients[appointment.patientId] || 'Unknown Patient'} on ${appointment.appointmentDate}`}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No appointments available.</p>
                        )}

                        <Button variant="secondary" onClick={()=>navigate(-1)}>Go Back</Button>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default DoctorDetails;
