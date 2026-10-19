import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
  const [state, setState] = useState({
    loading: true,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        loading: false,
        error: 'Геолокація не підтримується вашим браузером',
      }));
      return;
    }

    const onEvent = (position) => {
      setState({
        loading: false,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        speed: position.coords.speed,
        timestamp: position.timestamp,
        error: null,
      });
    };

    const onEventError = (error) => {
      setState((s) => ({
        ...s,
        loading: false,
        error: error.message,
      }));
    };

    const watcherId = navigator.geolocation.watchPosition(
      onEvent,
      onEventError,
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watcherId);
    };
  }, [options]);

  return state;
};
