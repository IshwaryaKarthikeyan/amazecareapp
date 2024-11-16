// src/components/Appointments/AppointmentForm.js
import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/AppointmentService';
import doctorService from '../../services/DoctorService';
import CardItem from '../Shared/CardItem';
import { useNavigate } from 'react-router-dom';

const AppointmentForm = () => {
    const [doctors, setDoctors] = useState([]);
    const [appointment, setAppointment] = useState({
        doctorId: '',
        appointmentDate: '',
        symptoms: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            const response = await doctorService.getAllDoctors();
            setDoctors(response);
        };
        fetchDoctors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await appointmentService.addAppointment(appointment);
            navigate('/patient/appointments');
        } catch (error) {
            console.error('Error scheduling appointment', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment({ ...appointment, [name]: value });
    };

    return (
        <div className="container">
            <h2>Schedule Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Select Doctor</label>
                    <div className="d-flex flex-wrap">
                        {doctors.map((doctor) => (
                            <CardItem
                                key={doctor.id}
                                title={doctor.fullName}
                                subtitle={doctor.specialty}
                                description={`Experience: ${doctor.experience} years`}
                                onClick={() => setAppointment({ ...appointment, doctorId: doctor.id })}
                            />
                        ))}
                    </div>
                </div>
                <div className="mb-3">
                    <label>Date of Appointment</label>
                    <input
                        type="datetime-local"
                        name="appointmentDate"
                        value={appointment.appointmentDate}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label>Symptoms</label>
                    <textarea
                        name="symptoms"
                        value={appointment.symptoms}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Schedule Appointment</button>
            </form>
        </div>
    );
};

export default AppointmentForm;
