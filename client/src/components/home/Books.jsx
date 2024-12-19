import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import { Box } from '@mui/material';
import axios from 'axios';

const Books = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/book/books');
                setResults(response.data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box display="flex" flexWrap="wrap" gap={4} padding={2}>
            {results.map((result, index) => (
                <Box 
                    key={index}
                    sx={{
                        width: 300, // Increase card width
                        height: 400, // Increase card height
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <Card
                        bookId={result._id}
                        coverImage={result.coverImage.optimizedUrl}
                        categories={result.categories}
                        title={result.title}
                        author={result.author}
                    />
                </Box>
            ))}
        </Box>
        </Box>
    );
};

export default Books;
