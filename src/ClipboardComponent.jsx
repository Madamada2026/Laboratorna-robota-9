import React, { useState } from 'react';
import { useClipboard } from './hooks/useClipboard';

const ClipboardComponent = () => {
  const [inputVal, setInputVal] = useState('Привіт, це текст для буфера обміну!');
  const { copied, error, value, copy, paste } = useClipboard();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '500px' }}>
      <h2>Демонстрація хука useClipboard</h2>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Введіть текст для копіювання:</label>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={() => copy(inputVal)}
          style={{ padding: '8px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {copied ? 'Скопійовано!' : 'Копіювати текст'}
        </button>

        <button
          onClick={paste}
          style={{ padding: '8px 15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Вставити з буфера
        </button>
      </div>

      {error && (
        <div style={{ padding: '10px', background: '#ffe6e6', borderRadius: '5px', color: 'red', marginBottom: '15px' }}>
          <p><strong>Помилка:</strong> {error}</p>
        </div>
      )}

      <div style={{ padding: '15px', background: '#f4f4f4', borderRadius: '5px', lineHeight: '1.6' }}>
        <p>Поточне значення в буфері / збережене хуком: <strong>{value || 'Буфер порожній'}</strong></p>
        <p>Статус скопійовано (<code>copied</code>): <strong style={{ color: copied ? 'green' : 'gray' }}>{copied.toString()}</strong></p>
      </div>
    </div>
  );
};

export default ClipboardComponent;
