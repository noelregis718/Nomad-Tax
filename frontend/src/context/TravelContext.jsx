import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  const { token } = useAuth();
  const [stays, setStays] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const fetchTravelData = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [staysRes, summaryRes] = await Promise.all([
        axios.get('http://localhost:5000/api/stays', config),
        axios.get('http://localhost:5000/api/summary/all', config)
      ]);
      
      setStays(staysRes.data);
      setSummaries(Array.isArray(summaryRes.data) ? summaryRes.data : []);
      setInitialLoaded(true);
    } catch (error) {
      console.error('Error fetching travel data:', error);
      setSummaries([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchTravelData();
    } else {
      setStays([]);
      setSummaries([]);
      setInitialLoaded(false);
    }
  }, [token, fetchTravelData]);

  const refreshData = async () => {
    await fetchTravelData();
  };

  return (
    <TravelContext.Provider value={{ 
      stays, 
      summaries, 
      loading, 
      initialLoaded, 
      refreshData 
    }}>
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => useContext(TravelContext);
