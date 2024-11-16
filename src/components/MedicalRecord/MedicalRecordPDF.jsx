import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Path, Font } from '@react-pdf/renderer';

// Register custom fonts
Font.register({
    family: 'Montserrat',
    fonts: [
        { src: 'http://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.ttf', fontWeight: 'normal' }, // Regular
        { src: 'http://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-Y3tcoqK5.ttf', fontWeight: 700 }, // Bold
    ],
});
Font.register({
    family: 'Orbitron',
    fonts: [
        { src: 'http://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6xpmIyXjU1pg.ttf' }, // Regular
        { src: 'http://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1ny_CmxpmIyXjU1pg.ttf', fontWeight: 700 }, // Bold
    ],
});

// Define styles for PDF layout
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: 'Montserrat',  // Set default font to Montserrat
    },
    logoSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoIcon: {
        marginRight: 10,
    },
    logoText: {
        fontSize: 22,
        color: '#e11541',
        fontWeight: 'bold',
        fontFamily: 'Orbitron',  // Custom font for the logo text
    },
    section: {
        marginBottom: 12,
        padding: 12,
        border: '1px solid #e0e0e0',
        borderRadius: 5,
        backgroundColor: '#f9f9f9', // Light background for sections
    },
    heading: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#e11541',
        fontFamily: 'Montserrat',  // Bold Montserrat for headings
        textDecoration: 'underline',
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
        color: '#333',  // Darker color for labels
    },
    value: {
        fontSize: 12,
        color: '#555',  // Softer color for values
        fontFamily: 'Montserrat',  // Regular Montserrat for values
        fontWeight: 'normal',
    },
    recordSection: {
        marginTop: 15,
    },
});

// SVG Heart Icon Component
const HeartIcon = () => (
    <Svg viewBox="0 0 512 512" width="20" height="20" style={styles.logoIcon}>
        <Path
            d="M228.3 469.1L47.6 300.4c-4.2-3.9-8.2-8.1-11.9-12.4l87 0c22.6 0 43-13.6 51.7-34.5l10.5-25.2 49.3 109.5c3.8 8.5 12.1 14 21.4 14.1s17.8-5 22-13.3L320 253.7l1.7 3.4c9.5 19 28.9 31 50.1 31l104.5 0c-3.7 4.3-7.7 8.5-11.9 12.4L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9zM503.7 240l-132 0c-3 0-5.8-1.7-7.2-4.4l-23.2-46.3c-4.1-8.1-12.4-13.3-21.5-13.3s-17.4 5.1-21.5 13.3l-41.4 82.8L205.9 158.2c-3.9-8.7-12.7-14.3-22.2-14.1s-18.1 5.9-21.8 14.8l-31.8 76.3c-1.2 3-4.2 4.9-7.4 4.9L16 240c-2.6 0-5 .4-7.3 1.1C3 225.2 0 208.2 0 190.9l0-5.8c0-69.9 50.5-129.5 119.4-141C165 36.5 211.4 51.4 244 84l12 12 12-12c32.6-32.6 79-47.5 124.6-39.9C461.5 55.6 512 115.2 512 185.1l0 5.8c0 16.9-2.8 33.5-8.3 49.1z"
            fill="#e11541"
        />
    </Svg>
);

// PDF component for the Medical Record
const MedicalRecordPDF = ({ appointment, patient, doctor, medicalRecord }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.logoSection}>
                <HeartIcon />
                <Text style={styles.logoText}>AmazeCare Medical Record</Text>
            </View>

            {/* Patient and Doctor Information */}
            <View style={styles.section}>
                <Text style={styles.heading}>Patient Information</Text>
                <Text style={styles.label}>Name: <Text style={styles.value}>{patient.fullName}</Text></Text>
                <Text style={styles.label}>Email: <Text style={styles.value}>{patient.user.email}</Text></Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Doctor Information</Text>
                <Text style={styles.label}>Name: <Text style={styles.value}>{doctor.fullName}</Text></Text>
                <Text style={styles.label}>Specialty: <Text style={styles.value}>{doctor.specialty}</Text></Text>
                <Text style={styles.label}>Email: <Text style={styles.value}>{doctor.user.email}</Text></Text>
            </View>

            {/* Medical Record Details */}
            <View style={[styles.section, styles.recordSection]}>
                <Text style={styles.heading}>Medical Record</Text>
                <Text style={styles.label}>Appointment ID: <Text style={styles.value}>{appointment.appointmentId}</Text></Text>
                <Text style={styles.label}>Current Symptoms: <Text style={styles.value}>{medicalRecord.currentSymptoms}</Text></Text>
                <Text style={styles.label}>Physical Examination: <Text style={styles.value}>{medicalRecord.physicalExamination}</Text></Text>
                <Text style={styles.label}>Treatment Plan: <Text style={styles.value}>{medicalRecord.treatmentPlan}</Text></Text>
                <Text style={styles.label}>Recommended Tests: <Text style={styles.value}>{medicalRecord.recommendedTests}</Text></Text>
                <Text style={styles.label}>Prescribed Medications: <Text style={styles.value}>{medicalRecord.prescribedMedications}</Text></Text>
            </View>
        </Page>
    </Document>
);

export default MedicalRecordPDF;