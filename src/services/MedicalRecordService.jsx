// src/api/medicalRecordService.js
import axios from './axios.jsx';

// Add a medical record for a specific patient
const addMedicalRecord = async (patientId, recordData) => {
    const response = await axios.post(`/medical-records/add/patient/${patientId}`, recordData);
    return response.data;
};

// Get medical records for a specific patient
const getMedicalRecordByPatientId = async (patientId) => {
    const response = await axios.get(`/medical-records/patient/${patientId}`);
    return response.data;
};

const getMedicalRecordByAppointmentId = async (appointmentId) => {
    const response = await axios.get(`/medical-records/appointment/${appointmentId}`);
    return response.data;
};

// Get a medical record by its ID
const getMedicalRecordById = async (recordId) => {
    const response = await axios.get(`/medical-records/get/${recordId}`);
    return response.data;
};

// Update a medical record
const updateMedicalRecord = async (recordId, recordData) => {
    const response = await axios.put(`/medical-records/update/${recordId}`, recordData);
    return response.data;
};

// Delete a medical record
const deleteMedicalRecord = async (recordId) => {
    const response = await axios.delete(`/medical-records/delete/${recordId}`);
    return response.data;
};

const medicalRecordService = {
    addMedicalRecord,
    getMedicalRecordByPatientId,
    getMedicalRecordByAppointmentId,
    getMedicalRecordById,
    updateMedicalRecord,
    deleteMedicalRecord,
};

export default medicalRecordService;
