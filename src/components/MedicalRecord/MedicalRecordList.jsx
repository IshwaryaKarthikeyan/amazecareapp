// src/components/MedicalRecords/MedicalRecordList.js
import React, { useState, useEffect } from 'react';
import medicalRecordService from '../../services/MedicalRecordService';
import CardItem from '../Shared/CardItem';

const MedicalRecordList = () => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const fetchRecords = async () => {
            const response = await medicalRecordService.getMedicalRecordByPatientId(5); // Assuming patientId is 5
            setRecords(response);
        };
        fetchRecords();
    }, []);

    return (
        <div className="container">
            <h2>Your Medical Records</h2>
            <div className="d-flex flex-wrap">
                {records.map((record) => (
                    <CardItem
                        key={record.id}
                        title={`Consultation on ${record.appointmentDate}`}
                        subtitle={`Symptoms: ${record.currentSymptoms}`}
                        description={`Diagnosis: ${record.treatmentPlan}`}
                        onClick={() => console.log('View full medical record')}
                    />
                ))}
            </div>
        </div>
    );
};

export default MedicalRecordList;
