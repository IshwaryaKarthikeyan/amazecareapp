import React, { useState, useEffect, useContext } from 'react';
import doctorService from '../../services/DoctorService';
import appointmentService from '../../services/AppointmentService';
import { Button, Form, Alert } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthProvider';
import patientService from '../../services/PatientService';
import { useNavigate } from 'react-router-dom';

const ScheduleAppointment = () => {
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [appointmentDetails, setAppointmentDetails] = useState({
        appointmentDate: '',
        appointmentTime: '',
        symptoms: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [dateError, setDateError] = useState('');
    const [timeError, setTimeError] = useState('');
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            setIsDarkTheme(true);
        } else {
            setIsDarkTheme(false);
        }
    }, []);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await doctorService.getSpecialties();
                setSpecialties(response);
            } catch (error) {
                console.error('Error fetching specialties', error);
            }
        };
        fetchSpecialties();
    }, []);

    useEffect(() => {
        if (selectedSpecialty) {
            const fetchDoctors = async () => {
                try {
                    const response = await doctorService.getDoctorsBySpecialty(selectedSpecialty);
                    setDoctors(response);
                } catch (error) {
                    console.error('Error fetching doctors', error);
                }
            };
            fetchDoctors();
        }
    }, [selectedSpecialty]);

    const handleSubmitAppointment = async () => {
        try {
            const patientData = await patientService.getPatientByUserId(auth.id);
            const patientId = patientData.id;

            const newAppointment = {
                patientId: patientId,
                doctorId: selectedDoctor,
                appointmentDate: `${appointmentDetails.appointmentDate}T${appointmentDetails.appointmentTime}:00`,
                symptoms: appointmentDetails.symptoms,
                status: "UPCOMING",
            };

            await appointmentService.addAppointment(newAppointment);
            setSuccessMessage('Appointment scheduled successfully!');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Failed to schedule the appointment. Please try again.');
            setSuccessMessage('');
        }
    };

    const validateDateAndTime = () => {
        const currentDateTime = new Date();
        const selectedDate = new Date(appointmentDetails.appointmentDate);
        const selectedTime = appointmentDetails.appointmentTime;

        if (selectedDate < currentDateTime.setHours(0, 0, 0, 0)) {
            setDateError('Appointment date cannot be in the past.');
        } else {
            setDateError('');
        }

        if (selectedDate.toDateString() === currentDateTime.toDateString()) {
            const currentTime = currentDateTime.toTimeString().split(' ')[0];
            if (selectedTime < currentTime) {
                setTimeError('Appointment time cannot be in the past.');
            } else {
                setTimeError('');
            }
        } else {
            setTimeError('');
        }
    };

    const handleDateChange = (e) => {
        setAppointmentDetails({ ...appointmentDetails, appointmentDate: e.target.value });
        validateDateAndTime();
    };

    const handleTimeChange = (e) => {
        setAppointmentDetails({ ...appointmentDetails, appointmentTime: e.target.value });
        validateDateAndTime();
    };

    return (
        <div className="container">
            <h2>Schedule an Appointment</h2>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {dateError && <Alert variant="danger">{dateError}</Alert>}
            {timeError && <Alert variant="danger">{timeError}</Alert>}

            <Form.Group controlId="specialty">
                <Form.Label>Select Specialty</Form.Label>
                <Form.Control 
                    as="select" 
                    value={selectedSpecialty} 
                    onChange={(e) => setSelectedSpecialty(e.target.value)} 
                >
                    <option value="">Select a specialty</option>
                    {specialties.map((specialty, index) => (
                        <option key={index} value={specialty}>{specialty}</option>
                    ))}
                </Form.Control>
            </Form.Group>

            {selectedSpecialty && (
                <Form.Group controlId="doctor">
                    <Form.Label>Select Doctor</Form.Label>
                    <Form.Control 
                        as="select" 
                        value={selectedDoctor} 
                        onChange={(e) => setSelectedDoctor(e.target.value)} 
                    >
                        <option value="">Select a doctor</option>
                        {doctors.map((doctor, index) => (
                            <option key={index} value={doctor.id}>{doctor.fullName}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
            )}

            {selectedDoctor && (
                <>
                    <Form.Group controlId="appointmentDate">
                        <Form.Label>Preferred Appointment Date (MM/DD/YYYY)</Form.Label>
                        <Form.Control
                            type="date"
                            value={appointmentDetails.appointmentDate}
                            onChange={handleDateChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="appointmentTime">
                        <Form.Label>Preferred Appointment Time (HH:MM am/pm)</Form.Label>
                        <Form.Control
                            type="time"
                            value={appointmentDetails.appointmentTime}
                            onChange={handleTimeChange}
                        />
                    </Form.Group>
                </>
            )}

            {selectedDoctor && (
                <Form.Group controlId="symptoms">
                    <Form.Label>Symptoms</Form.Label>
                    <Form.Control
                        type="text"
                        value={appointmentDetails.symptoms}
                        onChange={(e) => setAppointmentDetails({ ...appointmentDetails, symptoms: e.target.value })}
                        placeholder="Brief description of your symptoms"
                    />
                </Form.Group>
            )}
            <br />
            <Button
                variant="primary"
                onClick={handleSubmitAppointment}
                disabled={!selectedDoctor || !appointmentDetails.appointmentDate || !appointmentDetails.appointmentTime || dateError || timeError}
            >
                Schedule Appointment
            </Button>
            <br /><br />
        </div>
    );
};

export default ScheduleAppointment;
