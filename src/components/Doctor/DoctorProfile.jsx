// src/components/Doctor/DoctorProfile.js
import React, { useState, useEffect, useContext } from 'react';
import doctorService from '../../services/DoctorService';
import { Button, Form } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthProvider';

const DoctorProfile = () => {
    const [profile, setProfile] = useState({
        id:'',
        fullName: '',
        specialty: '',
        experience: '',
        qualification: '',
    });

    const { auth } = useContext(AuthContext);

    const [alert,setAlert] = useState('');

    useEffect(() => {
        // Fetch doctor profile information
        const fetchProfile = async () => {
            try {
                const response = await doctorService.getDoctorByUserId(auth.id);
                setProfile(response);
            } catch (error) {
                console.error('Error fetching doctor profile', error);
            }
        };
        fetchProfile();
    }, [auth.id]);

    const handleUpdateProfile = async () => {
        try {
            await doctorService.updateDoctor(Number(profile.id), profile);
            setAlert('Profile  updated successfully!');
            setTimeout(() => {
                setAlert('');
            }, 3000);
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    return (
        <div>
            <h3>Update Doctor Profile</h3>
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
                <Form.Group controlId="specialty">
                    <Form.Label>Specialty</Form.Label>
                    <Form.Control
                        type="text"
                        value={profile.specialty}
                        onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                    />
                </Form.Group>
                <Form.Group controlId="experience">
                    <Form.Label>Years of Experience</Form.Label>
                    <Form.Control
                        type="number"
                        value={profile.experience}
                        onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    />
                </Form.Group>
                <Form.Group controlId="qualification">
                    <Form.Label>Qualification</Form.Label>
                    <Form.Control
                        type="text"
                        value={profile.qualification}
                        onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                    />
                </Form.Group>
                <br/>
                <Button onClick={handleUpdateProfile}>Update Profile</Button>
            </Form>
            <br/>
        </div>
    );
};

export default DoctorProfile;
