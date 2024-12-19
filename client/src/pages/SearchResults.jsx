import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import Card from '../components/common/Card';
import axios from 'axios';


const API_BASE_URL = 'http://localhost:3000';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_BASE_URL}/api/book/books`, {
          params: { searchTerm: query },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        console.log('Search results:', response.data);

        const books = response.data.data || [];
        setResults(Array.isArray(books) ? books : []);
      } catch (err) {
        console.error('Search error:', err);
        setError(err.response?.data?.message || 'An error occurred while searching');
      } finally {
        setLoading(false);
      }
    };

    if (!query?.trim()) {
      navigate('/home', { replace: true });
      return;
    }

    fetchSearchResults();
  }, [query, navigate]);


  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
          <Typography sx={{ marginLeft: 2 }}>Loading...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ margin: '16px 0' }}>
          {error}
        </Alert>
      );
    }

    if (!Array.isArray(results)) {
      return (
        <Alert severity="error" sx={{ margin: '16px 0' }}>
          Invalid data format received from server
        </Alert>
      );
    }

    if (results.length === 0) {
      return (
        <Alert severity="info" sx={{ margin: '16px 0' }}>
          No results found for "{query}". Try adjusting your search terms.
        </Alert>
      );
    }

    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Search Results for "{query}"
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {results.map((result, index) => (
            <Card
              key={index}
              bookId={result._id}
              coverImage={result.coverImage.optimizedUrl}
              categories={result.categories}
              title={result.title}
              author={result.author}
            />
          ))}
        </Box>
      </Box>
    );
  };

  return <Box padding={3}>{renderContent()}</Box>;
};

export default SearchResults;
