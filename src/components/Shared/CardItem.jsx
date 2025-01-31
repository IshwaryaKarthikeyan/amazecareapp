import React from 'react';
import { Card, Button } from 'react-bootstrap';

const CardItem = ({ title, subtitle, description, onClick }) => {
    return (
        <Card
            style={{
                width: '18rem',
                margin: '1rem',

            }}
        >
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
                <Card.Text>{description}</Card.Text>
                <Button variant="primary" onClick={onClick}>
                    View Details
                </Button>
            </Card.Body>
        </Card>
    );
};

export default CardItem;
