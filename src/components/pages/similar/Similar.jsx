import React, { useState, useEffect,useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ApiContext } from '../../../ApiContext';
import { Card } from '../../exports';
import axios from 'axios';


const Similar = () => {
  const { id } = useParams();
  const API_KEY = useContext(ApiContext).API_KEY;

  const [similar, setSimilar] = useState([]);

  const fetchSimilar = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/similar`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          page: 1,
        },
      });
      setSimilar(response.data.results);
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      setSimilar([]);
    }
  };

  useEffect(() => {
    fetchSimilar();
  }, []);

  return ( 
    <div>
      <h1>Similar</h1>
      <Card Data={similar} mediaType="movie"  classul="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" />
    </div>
  );
};

export default Similar;
