// src/components/Admin/ManageDoctors.js
import React, { useState, useEffect } from 'react';
import doctorService from '../../services/DoctorService';
import CardItem from '../Shared/CardItem';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [showModal, setShowModal] = useState(false); // State for delete confirmation modal
    const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
    const [doctorToDelete, setDoctorToDelete] = useState(null); // State for the doctor to delete
    const navigate = useNavigate();

    // Fetch all doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await doctorService.getAllDoctors();
                setDoctors(response);
            } catch (error) {
                console.error('Error fetching doctors', error);
            }
        };
        fetchDoctors();
    }, []);

    // Handle delete doctor
    const handleDeleteDoctor = async (doctorId) => {
        try {
            await doctorService.deleteDoctor(doctorId); // Call delete service
            setDoctors(doctors.filter(doctor => doctor.id !== doctorId)); // Remove doctor from state
            setShowModal(false); // Close delete confirmation modal
            setShowSuccessModal(true); // Open success modal
        } catch (error) {
            console.error('Error deleting doctor', error);
            alert('Failed to delete the doctor. Please try again.'); // You can also change this to use a modal
        }
    };

    const openModal = (doctorId) => {
        setDoctorToDelete(doctorId);
        setShowModal(true); // Show the delete confirmation modal
    };

    const closeModal = () => {
        setShowModal(false); // Close the delete confirmation modal
        setDoctorToDelete(null); // Clear doctor to delete
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false); // Close the success modal
    };

    return (
        <div>
            <div className='d-flex align-items-center mb-3'>
                <h3 className='me-3'>Manage Doctors</h3>
                <Button onClick={() => navigate('../add-doctor')}>Add New Doctor</Button>
            </div>
            <hr />
            <div className="d-flex flex-wrap">
                {doctors.map((doctor) => (
                    <div key={doctor.id} className="card m-3 p-3 shadow-sm" style={{ width: '18rem' }}>
                        <h5>{doctor.fullName}</h5>
                        <p>{doctor.specialty}</p>
                        <p>{`Experience: ${doctor.experience} years`}</p>

                        {/* View details button */}
                        <Button variant="primary" className="mb-2" onClick={() => navigate(`../doctor-details/${doctor.id}`)}>
                            View Details
                        </Button>

                        {/* Delete doctor button inside card */}
                        <Button variant="danger" onClick={() => openModal(doctor.id)}>
                            Delete Doctor
                        </Button>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this doctor?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => {
                        if (doctorToDelete) {
                            handleDeleteDoctor(doctorToDelete);
                        }
                    }}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={closeSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Doctor deleted successfully!</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={closeSuccessModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageDoctors;
