import React from 'react';
import { useAsync } from './hooks/useAsync';

// Імітація асинхронного запиту (наприклад, до сервера)
const fetchUserData = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve({ id: 1, name: 'Семеніхін Руслан', role: 'Розробник' });
      } else {
        reject(new Error('Не вдалося завантажити дані користувача'));
      }
    }, 1500);
  });
};

const AsyncComponent = () => {
  const { execute, status, value, error } = useAsync(fetchUserData);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '500px' }}>
      <h2>Демонстрація хука useAsync</h2>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={execute}
          disabled={status === 'pending'}
          style={{ padding: '8px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {status === 'pending' ? 'Завантаження...' : 'Виконати запит'}
        </button>
      </div>

      <div style={{ padding: '15px', background: '#f4f4f4', borderRadius: '5px', lineHeight: '1.6' }}>
        <p>Статус (<code>status</code>): <strong>{status}</strong></p>
        
        {status === 'pending' && <p style={{ color: 'orange' }}>Виконується асинхронна операція...</p>}
        
        {status === 'fulfilled' && (
          <div style={{ color: 'green' }}>
            <p><strong>Дані успішно отримано:</strong></p>
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </div>
        )}

        {status === 'rejected' && (
          <div style={{ color: 'red' }}>
            <p><strong>Помилка:</strong> {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AsyncComponent;
