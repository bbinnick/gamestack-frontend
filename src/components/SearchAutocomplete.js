import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/AuthService';

const SearchAutocomplete = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.length > 2) {
      const fetchGames = async () => {
        try {
          const response = await authService.getAxiosInstance().get('/igdb/games/search', {
            params: { query: searchQuery, limit: 10 }
          });
          setOptions(response.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };

      fetchGames();
    }
  }, [searchQuery]);

  const handleInputChange = (event, value) => {
    setSearchQuery(value);
  };

  const handleOptionSelect = (event, value) => {
    if (value) {
      navigate(`/games/igdb/${value.id}`);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => option.name}
      onInputChange={handleInputChange}
      onChange={handleOptionSelect}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label="Search Games" 
          variant="outlined" 
          sx={{ width: '400px' }} // Adjust the width as needed
        />
      )}
    />
  );
};

export default SearchAutocomplete;