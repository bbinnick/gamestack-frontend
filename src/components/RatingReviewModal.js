import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Rating } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const labels = {
    0.5: 'Boring',
    1: 'Boring+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const RatingReviewModal = ({ open, onClose, onSubmit, initialRating = 0, initialReview = '', message }) => {
    const [rating, setRating] = useState(initialRating);
    const [review, setReview] = useState(initialReview);
    const [hover, setHover] = useState(-1);
    const theme = useTheme();
    const maxCharacters = 250;

    useEffect(() => {
        setRating(initialRating);
        setReview(initialReview);
    }, [initialRating, initialReview]);

    const handleSubmit = () => {
        onSubmit(rating, review);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    p: 4,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: 2,
                    maxWidth: 600,
                    margin: 'auto',
                    mt: '10%',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Rate and Review
                </Typography>
                {message && (
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        {message}
                    </Typography>
                )}
                <Rating
                    name="rating"
                    value={rating}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => setRating(newValue)}
                    onChangeActive={(event, newHover) => setHover(newHover)}
                    precision={0.5}
                />
                {rating !== null && (
                    <Box>{labels[hover !== -1 ? hover : rating]}</Box>
                )}
                <TextField
                    label="Review"
                    multiline
                    rows={4}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    fullWidth
                    sx={{ mt: 3, '& .MuiInputBase-root': { height: '100px' } }}
                    slotProps={{ input: { maxLength: maxCharacters } }}
                    helperText={`${review.length}/${maxCharacters} characters`}
                    variant="outlined"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Submit
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default RatingReviewModal;