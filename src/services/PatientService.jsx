// src/api/patientService.js
import axios from './axios';

// Add a new patient
const addPatient = async (patientData) => {
    const response = await axios.post('/patients/add', patientData);
    return response.data;
};

// Get all patients
const getAllPatients = async () => {
    const response = await axios.get('/patients/get');
    return response.data;
};

// Get a specific patient by ID
const getPatientById = async (id) => {
    const response = await axios.get(`/patients/get/${id}`);
    return response.data;
};

const getPatientByUserId = async (id) => {
    const response = await axios.get(`/patients/getuser/${id}`);
    return response.data;
};

// Update patient details
const updatePatient = async (id, patientData) => {
    const response = await axios.put(`/patients/update/${id}`, patientData);
    return response.data;
};

// Delete a patient
const deletePatient = async (id) => {
    const response = await axios.delete(`/patients/delete/${id}`);
    return response.data;
};

const patientService = {
    addPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    getPatientByUserId
};

export default patientService;
