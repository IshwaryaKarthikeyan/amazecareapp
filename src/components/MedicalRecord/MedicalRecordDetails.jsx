import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartPulse } from '@fortawesome/free-solid-svg-icons';
import medicalRecordService from '../../services/MedicalRecordService';
import appointmentService from '../../services/AppointmentService'; // Import appointment service
import patientService from '../../services/PatientService'; // Import patient service
import doctorService from '../../services/DoctorService'; // Import doctor service
import MedicalRecordPDF from './MedicalRecordPDF.jsx';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

const MedicalRecordDetails = () => {
    const { id } = useParams(); // Fetch the MedicalRecord id from URL
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const [patient, setPatient] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMedicalRecordDetails = async () => {
            try {
                if (id && !isNaN(id)) {
                    // Fetch the medical record first
                    const medicalRecordResponse = await medicalRecordService.getMedicalRecordById(Number(id));
                    setMedicalRecord(medicalRecordResponse);

                    // Then fetch the appointment using appointmentId from medical record
                    const appointmentResponse = await appointmentService.getAppointmentById(medicalRecordResponse.appointmentId);
                    setAppointment(appointmentResponse);

                    // Now, fetch the patient and doctor details using patientId and doctorId from the appointment
                    const patientResponse = await patientService.getPatientById(appointmentResponse.patientId);
                    const doctorResponse = await doctorService.getDoctorById(appointmentResponse.doctorId);

                    setPatient(patientResponse);
                    setDoctor(doctorResponse);
                }
            } catch (error) {
                console.error('Error fetching medical record, appointment, or related details', error);
            }
        };

        fetchMedicalRecordDetails();
    }, [id]);

    if (!medicalRecord || !appointment || !patient || !doctor) {
        return <div>Loading...</div>; // Loading state
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card className="p-4 shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4" style={{ fontSize: '1.75rem', fontWeight: '700', color: '#e11541' }}>
                                Medical Record Details
                            </Card.Title>
                            <hr />
                            <Card.Subtitle className="mb-3">
                                Appointment ID: {medicalRecord.appointmentId}
                            </Card.Subtitle>
                            <Card.Text><strong>Patient Name:</strong> {patient.fullName}</Card.Text>
                            <Card.Text><strong>Doctor Name:</strong> {doctor.fullName}</Card.Text>
                            <Card.Text><strong>Doctor Specialty:</strong> {doctor.specialty}</Card.Text>
                            <Card.Text><strong>Doctor Email:</strong> {doctor.user.email}</Card.Text>
                            <hr />
                            <Card.Text><strong>Current Symptoms:</strong> {medicalRecord.currentSymptoms}</Card.Text>
                            <Card.Text><strong>Physical Examination:</strong> {medicalRecord.physicalExamination}</Card.Text>
                            <Card.Text><strong>Treatment Plan:</strong> {medicalRecord.treatmentPlan}</Card.Text>
                            <Card.Text><strong>Recommended Tests:</strong> {medicalRecord.recommendedTests}</Card.Text>
                            <Card.Text><strong>Prescribed Medications:</strong> {medicalRecord.prescribedMedications}</Card.Text>
                            <PDFDownloadLink
                                document={<MedicalRecordPDF appointment={appointment} patient={patient} doctor={doctor} medicalRecord={medicalRecord} />}
                                fileName={`Medical_Record_${medicalRecord.appointmentId}.pdf`}
                            >
                                {({ loading }) => (
                                    <Button variant="primary" className="mt-3">
                                        {loading ? 'Preparing document...' : 'Download PDF'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                            <br/><br/>
                            <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MedicalRecordDetails;
