// src/components/Doctors/DoctorList.js
import React, { useState, useEffect } from 'react';
import doctorService from '../../api/doctorService';
import CardItem from '../Shared/CardItem';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            const response = await doctorService.getAllDoctors();
            setDoctors(response);
        };
        fetchDoctors();
    }, []);

    return (
        <div className="container">
            <h2>Available Doctors</h2>
            <div className="d-flex flex-wrap">
                {doctors.map((doctor) => (
                    <CardItem
                        key={doctor.id}
                        title={doctor.fullName}
                        subtitle={doctor.specialty}
                        description={`Experience: ${doctor.experience} years`}
                        onClick={() => console.log(`Selected doctor: ${doctor.fullName}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default DoctorList;
