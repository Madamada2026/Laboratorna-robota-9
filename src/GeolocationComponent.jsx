import React from 'react';
import { useGeolocation } from './hooks/useGeolocation';

const GeolocationComponent = () => {
  const {
    loading,
    accuracy,
    latitude,
    longitude,
    speed,
    timestamp,
    error,
  } = useGeolocation({ enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Демонстрація хука useGeolocation</h2>
      
      {loading && <p>Отримання даних геолокації...</p>}
      {error && (
        <div style={{ padding: '10px', background: '#ffe6e6', borderRadius: '5px', color: 'red' }}>
          <p><strong>Помилка:</strong> {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div style={{ padding: '15px', background: '#f4f4f4', borderRadius: '5px', lineHeight: '1.6' }}>
          <p>Широта (Latitude): <strong>{latitude}</strong></p>
          <p>Довгота (Longitude): <strong>{longitude}</strong></p>
          <p>Точність (Accuracy): <strong>{accuracy} метрів</strong></p>
          <p>Швидкість (Speed): <strong>{speed !== null ? `${speed} м/с` : 'Невідомо'}</strong></p>
          <p>Час оновлення: <strong>{new Date(timestamp).toLocaleTimeString()}</strong></p>
        </div>
      )}

      <p style={{ color: 'gray', marginTop: '20px' }}>
        Дозвольте браузеру доступ до геопозиції у спливаючому вікні, щоб побачити координати.
      </p>
    </div>
  );
};

export default GeolocationComponent;
