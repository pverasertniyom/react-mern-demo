import { useCallback, useEffect, useRef, useState } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequsers = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      try {
        setIsLoading(true);

        const HttpAbortCtrl = new AbortController();
        activeHttpRequsers.current.push(HttpAbortCtrl);

        const response = await fetch(url, {
          method: method,
          headers: headers,
          body: body,
          signal: activeHttpRequsers.signal,
        });

        const responseData = await response.json();

        activeHttpRequsers.current = activeHttpRequsers.current.filter(
          (reqCtrl) => reqCtrl !== HttpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        return responseData;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      activeHttpRequsers.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
