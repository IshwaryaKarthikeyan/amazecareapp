// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Navbar from './components/Shared/Navbar';
import Login from './components/Auth/Login';
import Registration from './components/Auth/Registration';

import PatientDashboard from './components/Dashboard/PatientDashboard';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import RequireAuth from './components/Auth/RequireAuth';

import ManageAppointments from './components/Admin/ManageAppointments';
import ManageDoctors from './components/Admin/ManageDoctors';
import Reports from './components/Admin/Reports';

import './bootstrap/css/bootstrap.min.css';
import { AddDoctor } from './components/Doctor/AddDoctor';
import ViewAppointments from './components/Doctor/ViewAppointments';
import ManageConsultations from './components/Doctor/ManageConsultations';
import DoctorDetails from './components/Doctor/DoctorDetails';
import DoctorProfile from './components/Doctor/DoctorProfile';

import PatientViewAppointments from './components/Patient/PatientViewAppointments';
import PatientViewMedicalRecords from './components/Patient/PatientViewMedicalRecords';
import PatientProfile from './components/Patient/PatientProfile';
import ScheduleAppointment from './components/Patient/ScheduleAppointment';
import { UserProvider } from './context/UserContext';
import ErrorPage from './components/Shared/ErrorPage';
import HomePage from './components/Shared/HomePage';

import './components/Styles/global.css';
import AppointmentDetails from './components/Appointment/AppointmentDetails';
import MedicalRecordDetails from './components/MedicalRecord/MedicalRecordDetails';

function App() {
    return (
        <Router>
            <AuthProvider>
                <UserProvider>
                    <Navbar className='custom-navbar' />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Registration />} />

                        {/* Protected Routes */}
                        {/* Patient Routes - Only accessible by PATIENT role */}
                        <Route element={<RequireAuth allowedRoles={['PATIENT']} />}>
                            <Route path="/patient/dashboard" element={<PatientDashboard />}>
                                <Route path="view-appointments" element={<PatientViewAppointments />} />
                                <Route path="view-medical-records" element={<PatientViewMedicalRecords />} />
                                <Route path="schedule-appointment" element={<ScheduleAppointment />} />
                                <Route path="update-profile" element={<PatientProfile />} />
                                <Route path="doctor-details/:doctorId" element={<DoctorDetails />} />
                                <Route path="appointment-details/:appointmentId" element={<AppointmentDetails />} />
                                <Route path="record-details/:id" element={<MedicalRecordDetails/>} />
                            </Route>
                        </Route>

                        {/* Doctor Routes - Only accessible by DOCTOR role */}
                        <Route element={<RequireAuth allowedRoles={['DOCTOR']} />}>
                            <Route path="/doctor/dashboard" element={<DoctorDashboard />}>
                                <Route path="view-appointments" element={<ViewAppointments />} />
                                <Route path="manage-consultations" element={<ManageConsultations />} />
                                <Route path="appointment-details/:appointmentId" element={<AppointmentDetails />} />
                                <Route path="update-profile" element={<DoctorProfile/>}/>
                            </Route>
                        </Route>

                        {/* Admin Routes - Only accessible by ADMIN role */}
                        <Route element={<RequireAuth allowedRoles={['ADMIN']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />}>
                                <Route path="manage-doctors" element={<ManageDoctors />} />
                                <Route path="add-doctor" element={<AddDoctor />} />
                                <Route path="manage-appointments" element={<ManageAppointments />} />
                                <Route path="reports" element={<Reports />} />
                                <Route path="doctor-details/:doctorId" element={<DoctorDetails />} />
                                <Route path="appointment-details/:appointmentId" element={<AppointmentDetails />} />
                            </Route>
                        </Route>

                        {/* Catch-All Route */}
                        <Route path="*" element={<ErrorPage />} /> {/* Redirect to error page for unknown routes */}
                    </Routes>
                </UserProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
