// hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Replace with actual API call
      const response = await axios.get(url, options);
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// hooks/useDashboardData.js
export const useDashboardData = () => {
  const { data: userData, loading: userLoading, error: userError } = useApi('/api/user');
  const { data: quizData, loading: quizLoading, error: quizError } = useApi('/api/quizzes');

  return {
    user: userData,
    quizzes: Array.isArray(quizData) ? quizData : quizData?.quizzes || [],
    loading: userLoading || quizLoading,
    error: userError || quizError
  };
};
