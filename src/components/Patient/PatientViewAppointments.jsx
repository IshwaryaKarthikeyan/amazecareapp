// src/components/Patient/PatientViewAppointments.js
import React, { useState, useEffect, useContext } from 'react';
import appointmentService from '../../services/AppointmentService';
import CardItem from '../Shared/CardItem';
import { AuthContext } from '../../context/AuthProvider';
import patientService from '../../services/PatientService';
import doctorService from '../../services/DoctorService'; // Import your doctor service
import { useNavigate } from 'react-router-dom';

const PatientViewAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    // Fetch appointments for the logged-in patient
    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true); // Start loading
            try {
                const patientData = await patientService.getPatientByUserId(auth.id);
                const patientId = patientData.id; // Get the patient ID

                console.log("Patient ID: ", patientId);
                
                const fetchedAppointments = await appointmentService.getAppointmentsByPatient(patientId);
                
                // Fetch doctors' names based on doctor IDs
                const appointmentsWithDoctorNames = await Promise.all(
                    fetchedAppointments.map(async (appointment) => {
                        // Ensure doctorId is valid
                        if (appointment.doctorId) {
                            const doctorData = await doctorService.getDoctorById(appointment.doctorId);
                            return {
                                ...appointment,
                                doctorName: doctorData.fullName
                            };
                        } else {
                            return {
                                ...appointment,
                                doctorName: 'Unknown Doctor' // Fallback if doctorId is undefined
                            };
                        }
                    })
                );

                setAppointments(appointmentsWithDoctorNames);
            } catch (error) {
                console.error('Error fetching appointments', error);
                setError('There was an issue fetching appointments. Please try again later.');
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchAppointments();
    }, [auth.id]); // Added auth.id as a dependency to refetch if it changes

    if (loading) {
        return <p>Loading appointments...</p>; // Loading feedback
    }

    return (
        <div>
            <h3>View Appointments</h3>
            {error && <p className="error">{error}</p>} {/* Display error message */}
            <div className="d-flex flex-wrap">
                {appointments.map((appointment) => (
                    <CardItem
                        key={appointment.id}
                        title={`Appointment with ${appointment.doctorName}`} // Show doctor's name
                        subtitle={appointment.appointmentDate}
                        description={`Symptoms: ${appointment.symptoms}`}
                        onClick={() => navigate(`../appointment-details/${appointment.id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PatientViewAppointments;
