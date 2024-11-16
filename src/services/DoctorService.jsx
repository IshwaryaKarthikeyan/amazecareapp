// src/api/doctorService.js
import axios from './axios';

// Add a new doctor
const addDoctor = async (doctorData) => {
    const response = await axios.post('/doctors/add', doctorData);
    return response.data;
};

// Get all doctors
const getAllDoctors = async () => {
    const response = await axios.get('/doctors/get');
    return response.data;
};

// Get a specific doctor by ID
const getDoctorById = async (id) => {
    const response = await axios.get(`/doctors/get/${id}`);
    return response.data;
};

const getDoctorByUserId = async (id) => {
    const response = await axios.get(`/doctors/get-user/${id}`);
    return response.data;
};

// Get doctors by specialty
const getDoctorsBySpecialty = async (specialty) => {
    const response = await axios.get(`/doctors/get-specialty/${specialty}`);
    return response.data;
};

// Get all specialties
const getSpecialties = async () => {
    const response = await axios.get('/doctors/specialties');
    return response.data;
};

// Update doctor details
const updateDoctor = async (id, doctorData) => {
    const response = await axios.put(`/doctors/update/${id}`, doctorData);
    return response.data;
};

// Delete a doctor
const deleteDoctor = async (id) => {
    const response = await axios.delete(`/doctors/delete/${id}`);
    return response.data;
};

const doctorService = {
    addDoctor,
    getAllDoctors,
    getDoctorById,
    getDoctorByUserId,
    getDoctorsBySpecialty,
    getSpecialties,
    updateDoctor,
    deleteDoctor,
};

export default doctorService;
