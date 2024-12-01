import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import authService from '../services/AuthService';

const SearchAutocomplete = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    if (searchQuery.length > 2) {
      const fetchGames = async () => {
        setLoading(true);
        try {
          const response = await authService.getAxiosInstance().get('/igdb/games/search', {
            params: { query: searchQuery, limit: 10 }
          });
          const games = response.data;
          setOptions(games);
          setNoResults(games.length === 0);
        } catch (error) {
          console.error('Error fetching search results:', error);
          setNoResults(true);
        } finally {
          setLoading(false);
        }
      };

      fetchGames();
    } else {
      setOptions([]);
      setNoResults(false);
    }
  }, [searchQuery]);

  const handleInputChange = (event, value) => {
    setSearchQuery(value);
  };

  const handleOptionSelect = (event, value) => {
    if (value && value.id) {
      navigate(`/games/igdb/${value.id}`);
    }
  };

  return (
    <div>
      <Autocomplete
        freeSolo
        options={options}
        getOptionLabel={(option) => option.name || ''}
        onInputChange={handleInputChange}
        onChange={handleOptionSelect}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Games"
            variant="outlined"
            sx={{ width: '400px' }} // Adjust the width as needed
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        noOptionsText="No games found"
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.name}
          </li>
        )}
      />
      {noResults && !loading && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          No results found for "{searchQuery}"
        </Typography>
      )}
    </div>
  );
};

export default SearchAutocomplete;