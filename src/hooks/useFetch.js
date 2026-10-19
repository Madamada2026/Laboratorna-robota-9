import { useState, useEffect, useCallback } from 'react';

/**
 * Універсальний кастомний хук для виконання HTTP-запитів
 */
export function useApi(url, method = 'GET', body = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setError(null);

    const upperMethod = method.toUpperCase();
    const options = {
      method: upperMethod,
      signal,
      headers: {},
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(upperMethod)) {
      options.headers['Content-Type'] = 'application/json';
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP помилка! Статус: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Сталася помилка під час виконання запиту');
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [url, method, body]);

  useEffect(() => {
    const cleanup = fetchData();
    return cleanup;
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
