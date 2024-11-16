// src/components/Patient/PatientViewMedicalRecords.js
import React, { useState, useEffect, useContext } from 'react';
import medicalRecordService from '../../services/MedicalRecordService';
import appointmentService from '../../services/AppointmentService'; // Import to fetch appointments
import CardItem from '../Shared/CardItem';
import { AuthContext } from '../../context/AuthProvider';
import patientService from '../../services/PatientService';
import { useNavigate } from 'react-router-dom';

const PatientViewMedicalRecords = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);

    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch medical records for the logged-in patient
    useEffect(() => {
        const fetchMedicalRecords = async () => {
            try {
                // Fetch the patient details using the user ID
                const patientData = await patientService.getPatientByUserId(auth.id);
                const patientId = patientData.id;

                // Fetch all medical records for the patient
                const recordsResponse = await medicalRecordService.getMedicalRecordByPatientId(patientId);
                
                // Fetch related appointments to extract appointment dates
                const updatedRecords = await Promise.all(
                    recordsResponse.map(async (record) => {
                        // Fetch the appointment for each medical record
                        const appointment = await appointmentService.getAppointmentById(record.appointmentId);
                        return {
                            ...record,
                            appointmentDate: appointment.appointmentDate // Add the appointment date
                        };
                    })
                );

                setMedicalRecords(updatedRecords); // Set the enriched medical records
            } catch (error) {
                console.error('Error fetching medical records', error);
            }
        };
        fetchMedicalRecords();
    }, [auth.id]); // Dependency on auth.id to refetch when it changes

    return (
        <div>
            <h3>View Medical Records</h3>
            <div className="d-flex flex-wrap">
                {medicalRecords.map((record) => (
                    <CardItem
                        key={record.id}
                        title={`Record from ID: ${record.id}`}
                        subtitle={`Date: ${new Date(record.appointmentDate).toLocaleDateString()}`} // Format the date
                        description={`Symptoms: ${record.currentSymptoms}, Treatment Plan: ${record.treatmentPlan}`}
                        onClick={() => navigate(`../record-details/${record.id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PatientViewMedicalRecords;
