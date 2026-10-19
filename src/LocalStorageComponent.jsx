import React, { useState } from 'react';
import { useLocalStorageState } from './hooks/useLocalStorageState';

const LocalStorageComponent = () => {
  // Кешуємо дані на 10 секунд (TTL = 10)
  const [cachedData, setCachedData] = useLocalStorageState('cached_item', 'Початкові дані кешу', 10);
  const [inputVal, setInputVal] = useState('');

  const handleSave = () => {
    if (inputVal.trim()) {
      setCachedData(inputVal);
      setInputVal('');
    }
  };

  const handleReset = () => {
    setCachedData('Початкові дані кешу');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '550px' }}>
      <h2>Демонстрація хука useLocalStorageState (з TTL)</h2>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Введіть дані для збереження у кеш (TTL = 10 сек):</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Введіть текст..."
            style={{ flex: '1', padding: '8px' }}
          />
          <button
            onClick={handleSave}
            style={{ padding: '8px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Зберегти
          </button>
          <button
            onClick={handleReset}
            style={{ padding: '8px 15px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Скинути
          </button>
        </div>
      </div>

      <div style={{ padding: '15px', background: '#f4f4f4', borderRadius: '5px', lineHeight: '1.6' }}>
        <p>Поточне значення з кешу: <strong>{cachedData}</strong></p>
        <p style={{ fontSize: '13px', color: '#666' }}>
          * Спробуй зберегти текст, перезавантажити сторінку раніше ніж за 10 секунд (дані збережуться), або почекати понад 10 секунд (дані автоматично очистяться і повернуться до початкових).
        </p>
      </div>
    </div>
  );
};

export default LocalStorageComponent;
