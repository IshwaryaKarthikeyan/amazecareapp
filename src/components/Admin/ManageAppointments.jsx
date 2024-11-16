import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/AppointmentService';
import doctorService from '../../services/DoctorService';
import patientService from '../../services/PatientService'; // Import patientService to fetch patient details
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(''); // Add error state
    const [showModal, setShowModal] = useState(false); // State for delete confirmation modal
    const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
    const [appointmentToDelete, setAppointmentToDelete] = useState(null); // State for the appointment to delete
    const navigate = useNavigate();

    // Fetch all appointments, doctors' names, and patient names
    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true); // Start loading
            try {
                const fetchedAppointments = await appointmentService.getAllAppointments();

                // Fetch doctors' and patients' names based on their IDs
                const appointmentsWithDetails = await Promise.all(
                    fetchedAppointments.map(async (appointment) => {
                        const doctorData = appointment.doctorId
                            ? await doctorService.getDoctorById(appointment.doctorId)
                            : { fullName: 'Unknown Doctor' };

                        const patientData = appointment.patientId
                            ? await patientService.getPatientById(appointment.patientId)
                            : { fullName: 'Unknown Patient' };

                        return {
                            ...appointment,
                            doctorName: doctorData.fullName,
                            patientName: patientData.fullName // Add patient name to the appointment
                        };
                    })
                );

                setAppointments(appointmentsWithDetails);
            } catch (error) {
                console.error('Error fetching appointments', error);
                setError('There was an issue fetching appointments. Please try again later.');
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchAppointments();
    }, []);

    // Handle delete appointment
    const handleDeleteAppointment = async (appointmentId) => {
        try {
            await appointmentService.deleteAppointment(appointmentId);
            setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
            setShowModal(false); // Close delete confirmation modal
            setShowSuccessModal(true); // Open success modal
        } catch (error) {
            console.error('Error deleting appointment', error);
            alert('Failed to delete the appointment. Please try again.'); // You can also change this to use a modal
        }
    };

    const openModal = (appointmentId) => {
        setAppointmentToDelete(appointmentId);
        setShowModal(true); // Show the delete confirmation modal
    };

    const closeModal = () => {
        setShowModal(false); // Close the delete confirmation modal
        setAppointmentToDelete(null); // Clear appointment to delete
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false); // Close the success modal
    };

    if (loading) {
        return <p>Loading appointments...</p>; // Display loading feedback
    }

    return (
        <div>
            <h3>Manage Appointments</h3>
            {error && <p className="error">{error}</p>} {/* Display error message */}
            <hr />
            <div className="d-flex flex-wrap">
                {appointments.map((appointment) => (
                    <div key={appointment.id} className="card m-3 p-3 shadow-sm" style={{ width: '18rem' }}>
                        <h5>{`Appointment with Dr. ${appointment.doctorName}`}</h5> {/* Doctor name instead of doctorId */}
                        <p>{`Date: ${appointment.appointmentDate}`}</p>
                        <p>{`Patient: ${appointment.patientName}, Symptoms: ${appointment.symptoms}`}</p> {/* Display patient name */}

                        {/* View details button */}
                        <Button variant="primary" className="mb-2" onClick={() => navigate(`../appointment-details/${appointment.id}`)}>
                            View Details
                        </Button>

                        {/* Delete appointment button */}
                        <Button variant="danger" onClick={() => openModal(appointment.id)}>
                            Delete Appointment
                        </Button>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this appointment?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => {
                        if (appointmentToDelete) {
                            handleDeleteAppointment(appointmentToDelete);
                        }
                    }}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={closeSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Appointment deleted successfully!</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={closeSuccessModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageAppointments;
