// src/components/Appointments/AppointmentList.js
import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/AppointmentService';
import CardItem from '../Shared/CardItem.jsx';

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            const response = await appointmentService.getAppointmentsByPatient(5); // Assuming patientId is 5
            setAppointments(response);
        };
        fetchAppointments();
    }, []);

    const handleCancel = async (appointmentId) => {
        try {
            await appointmentService.deleteAppointment(appointmentId);
            setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
        } catch (error) {
            console.error('Error canceling appointment', error);
        }
    };

    return (
        <div className="container">
            <h2>Your Appointments</h2>
            <div className="d-flex flex-wrap">
                {appointments.map((appointment) => (
                    <CardItem
                        key={appointment.id}
                        title={`Appointment with Doctor ID: ${appointment.doctorId}`}
                        subtitle={appointment.appointmentDate}
                        description={`Symptoms: ${appointment.symptoms}`}
                        onClick={() => handleCancel(appointment.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AppointmentList;
