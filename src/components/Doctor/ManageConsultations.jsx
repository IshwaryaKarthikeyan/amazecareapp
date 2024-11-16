// src/components/Doctor/ManageConsultations.js
import React, { useState, useEffect, useContext } from 'react';
import appointmentService from '../../services/AppointmentService';
import medicalRecordService from '../../services/MedicalRecordService';
import patientService from '../../services/PatientService'; // Import the patientService
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthProvider';
import doctorService from '../../services/DoctorService';

const ManageConsultations = () => {
    const [appointments, setAppointments] = useState([]);
    const [appointmentsWithPatientNames, setAppointmentsWithPatientNames] = useState([]); // New state with patient names
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [medicalRecord, setMedicalRecord] = useState({
        currentSymptoms: '',
        physicalExamination: '',
        treatmentPlan: '',
        recommendedTests: '',
        prescribedMedications: '',
    });
    const [isUpdate, setIsUpdate] = useState(false); // Track if it's an update or add
    const [validationError, setValidationError] = useState(''); // State for validation error

    const { auth } = useContext(AuthContext);

    // Fetch appointments for the logged-in doctor
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const doctorData = await doctorService.getDoctorByUserId(auth.id);
                const doctorId = doctorData.id;

                const appointments = await appointmentService.getAppointmentsByDoctor(doctorId);

                // Fetch patient names for each appointment
                const updatedAppointments = await Promise.all(
                    appointments.map(async (appointment) => {
                        const patient = await patientService.getPatientById(appointment.patientId);
                        return {
                            ...appointment,
                            patientName: patient.fullName, // Attach patient's full name
                        };
                    })
                );

                setAppointmentsWithPatientNames(updatedAppointments); // Set state with appointments including patient names
            } catch (error) {
                console.error('Error fetching appointments or patient details', error);
            }
        };

        fetchAppointments();
    }, [auth.id]);

    // Open modal to manage consultation and check if medical record already exists
    const handleConsultation = async (appointment) => {
        setSelectedAppointment(appointment);
        console.log("Appointment ID: ", appointment);

        try {
            // Fetch the existing medical record for this appointment if it exists
            const existingRecord = await medicalRecordService.getMedicalRecordByAppointmentId(appointment.id);
            
            if (existingRecord) {
                // If a medical record exists, populate the form and set it to update mode
                setMedicalRecord(existingRecord);
                setIsUpdate(true); // Set flag to update mode
            } else {
                throw new Error('No existing record found'); // Simulate the "no record found" case
            }

        } catch (error) {
            // If no record exists or fetch fails, reset the form and prepare to add a new record
            console.warn('No existing medical record found, adding a new one.');
            setMedicalRecord({
                currentSymptoms: '',
                physicalExamination: '',
                treatmentPlan: '',
                recommendedTests: '',
                prescribedMedications: '',
            });
            setIsUpdate(false); // Set flag to add mode
        }

        setShowModal(true); // Open the modal
    };

    // Validate the prescribed medications format
    const validatePrescribedMedications = (medications) => {
        const prescriptionPattern = /^(?:\w+ \d-\d-\d (AF|BF)(?: \|\| )?)+$/;
        return prescriptionPattern.test(medications.trim());
    };

    /*
    Sample Prescriptions:
    
    Aspirin 2-1-3 AF
    Ibuprofen 5-4-2 BF || Acetaminophen 1-1-1 AF
    Metformin 3-2-1 AF || Losartan 2-3-4 BF
    Antibiotic 1-2-3 AF || Painkiller 1-2-1 BF || Supplement 2-2-2 AF
    Vitamin 3-4-5 BF
    */

    // Handle input changes and validate in real-time
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMedicalRecord({ ...medicalRecord, [name]: value });

        if (name === 'prescribedMedications') {
            if (value && !validatePrescribedMedications(value)) {
                setValidationError('Invalid format. Use: MedicineName dosage AF/BF || MedicineName dosage AF/BF');
            } else {
                setValidationError(''); // Clear error if valid
            }
        }
    };

    // Handle medical record submission (update or add)
    const handleSubmitConsultation = async () => {
        // Validate prescribed medications one last time on submission
        if (medicalRecord.prescribedMedications && !validatePrescribedMedications(medicalRecord.prescribedMedications)) {
            setValidationError('Invalid format. Use: MedicineName dosage AF/BF || MedicineName dosage AF/BF');
            return;
        }

        try {
            const recordData = {
                appointmentId: selectedAppointment.id,
                ...medicalRecord,
            };

            if (isUpdate) {
                // If in update mode, update the existing medical record
                await medicalRecordService.updateMedicalRecord(selectedAppointment.id, recordData);
            } else {
                // If in add mode, create a new medical record
                await medicalRecordService.addMedicalRecord(selectedAppointment.patientId, recordData);
            }

            setShowModal(false); // Close the modal
        } catch (error) {
            console.error('Error submitting consultation', error);
        }
    };

    return (
        <div className="container">
            <h3>Manage Consultations</h3>

            <div className="d-flex flex-wrap">
                {appointmentsWithPatientNames.map((appointment) => (
                    <div key={appointment.id} className="card m-2" style={{ width: '18rem' }}>
                        <div className="card-body">
                            <h5 className="card-title">Appointment with {appointment.patientName}</h5> {/* Display Patient Name */}
                            <p className="card-text">Symptoms: {appointment.symptoms}</p>
                            <p className="card-text">Date: {appointment.appointmentDate}</p>
                            <Button variant="primary" onClick={() => handleConsultation(appointment)}>
                                Manage Consultation
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for managing consultation */}
            {selectedAppointment && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Consultation Details for Patient {selectedAppointment.patientName}
                        </Modal.Title> {/* Use Patient Name in Modal */}
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="currentSymptoms">
                                <Form.Label>Current Symptoms</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={medicalRecord.currentSymptoms}
                                    onChange={handleInputChange}
                                    name="currentSymptoms"
                                />
                            </Form.Group>

                            <Form.Group controlId="physicalExamination">
                                <Form.Label>Physical Examination</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={medicalRecord.physicalExamination}
                                    onChange={handleInputChange}
                                    name="physicalExamination"
                                />
                            </Form.Group>

                            <Form.Group controlId="treatmentPlan">
                                <Form.Label>Treatment Plan</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={medicalRecord.treatmentPlan}
                                    onChange={handleInputChange}
                                    name="treatmentPlan"
                                />
                            </Form.Group>

                            <Form.Group controlId="recommendedTests">
                                <Form.Label>Recommended Tests</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={medicalRecord.recommendedTests}
                                    onChange={handleInputChange}
                                    name="recommendedTests"
                                />
                            </Form.Group>

                            <Form.Group controlId="prescribedMedications">
                                <Form.Label>Prescribed Medications</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={medicalRecord.prescribedMedications}
                                    onChange={handleInputChange}
                                    name="prescribedMedications"
                                />
                                {validationError && (
                                    <Alert variant="danger" className="mt-2">
                                        {validationError}
                                    </Alert>
                                )}
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmitConsultation}>
                            {isUpdate ? 'Update Consultation' : 'Submit Consultation'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default ManageConsultations;
