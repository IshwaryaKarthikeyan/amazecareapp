// src/components/Patient/PatientProfile.js
import React, { useState, useEffect, useContext } from 'react';
import patientService from '../../services/PatientService';
import { Button, Form } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthProvider';

const PatientProfile = () => {
    const [profile, setProfile] = useState({
        id:'',
        fullName: '',
        dateOfBirth: '',
        gender: '',
        contactNumber: '',
    });

    const { auth } = useContext(AuthContext); // Access the full `auth` object from context
    const { id } = auth || {}; // Destructure `id` safely from `auth`
    
    const [alert,setAlert] = useState('');

    useEffect(() => {
        if (!id) {
            console.log("User ID is missing, waiting for it...");
            return;
        }

        // Fetch patient profile information when `id` is available
        const fetchProfile = async () => {
            try {
                console.log("Fetching profile for user ID:", id); // Debug log
                const response = await patientService.getPatientByUserId(id);
                console.log("Profile fetched:", response); // Debug log
                setProfile(response); // Update profile state with fetched data
            } catch (error) {
                console.error('Error fetching patient profile', error);
            }
        };

        fetchProfile();
    }, [id]); // Run effect only when `id` changes

    const handleUpdateProfile = async () => {
        try {
            console.log("Updating profile for user ID:", id); // Debug log
            await patientService.updatePatient(Number(profile.id), profile); // Use `id` to update profile
            setAlert('Profile  updated successfully!');
            setTimeout(() => {
                setAlert('');
            }, 3000);
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    if (!id) {
        return <div>Loading...</div>; // Show loading or an error message if `id` is not available
    }

    return (
        <div>
            <h3>Update Profile</h3>
            {alert && (
                <div className="alert alert-success text-center" role="alert">
                    {alert}
                </div>
            )}
            <Form>
                <Form.Group controlId="fullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    />
                </Form.Group>
                <Form.Group controlId="dateOfBirth">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                        type="date"
                        value={profile.dateOfBirth}
                        onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    />
                </Form.Group>
                <Form.Group controlId="gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                        as="select"
                        value={profile.gender}
                        onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="contactNumber">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                        type="text"
                        value={profile.contactNumber}
                        onChange={(e) => setProfile({ ...profile, contactNumber: e.target.value })}
                    />
                </Form.Group>
                <br/>
                <Button onClick={handleUpdateProfile}>Update Profile</Button>
            </Form>
            <br/>
        </div>
    );
};

export default PatientProfile;
