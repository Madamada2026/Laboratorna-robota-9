import { useState, useCallback } from 'react';

export const useAsync = (asyncFunction, immediate = false) => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'pending' | 'fulfilled' | 'rejected'
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setStatus('pending');
      setValue(null);
      setError(null);

      try {
        const response = await asyncFunction(...args);
        setValue(response);
        setStatus('fulfilled');
        return response;
      } catch (err) {
        setError(err.message || 'Сталася помилка');
        setStatus('rejected');
        throw err;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setValue(null);
    setError(null);
  }, []);

  return { execute, status, value, error };
};
