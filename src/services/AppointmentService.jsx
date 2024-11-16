// src/api/appointmentService.js
import axios from './axios';

// Add a new appointment
const addAppointment = async (appointmentData) => {
    const response = await axios.post('/appointments/add', appointmentData);
    return response.data;
};

const getAppointmentById = async (id) => {
    const response = await axios.get(`/appointments/get/${id}`);
    return response.data;
};

// Get appointments for a specific doctor by ID
const getAppointmentsByDoctor = async (doctorId) => {
    const response = await axios.get(`/appointments/doctor/${doctorId}`);
    return response.data;
};

// Get appointments for a specific patient by ID (assuming the endpoint exists)
const getAppointmentsByPatient = async (patientId) => {
    const response = await axios.get(`/appointments/patient/${patientId}`);
    return response.data;
};

const getAllAppointments = async () => {
    const response = await axios.get(`/appointments/all`);
    return response.data;
};

// Update an appointment
const updateAppointment = async (id, appointmentData) => {
    const response = await axios.put(`/appointments/update/${id}`, appointmentData);
    return response.data;
};

// Update the status of an appointment
const updateStatus = async (id, status) => {
    const response = await axios.put(`/appointments/update-status/${id}`, status);
    return response.data;
};

// Delete an appointment
const deleteAppointment = async (id) => {
    const response = await axios.delete(`/appointments/delete/${id}`);
    return response.data;
};

const appointmentService = {
    addAppointment,
    getAppointmentById,
    getAppointmentsByDoctor,
    getAppointmentsByPatient,
    updateAppointment,
    updateStatus, // Add the updateStatus method here
    deleteAppointment,
    getAllAppointments
};

export default appointmentService;
