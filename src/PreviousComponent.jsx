import React, { useState } from 'react';
import { usePrevious } from './hooks/usePrevious';

const PreviousComponent = () => {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '400px' }}>
      <h2>Демонстрація хука usePrevious</h2>

      <div style={{ padding: '15px', background: '#f4f4f4', borderRadius: '5px', marginBottom: '15px', lineHeight: '1.6' }}>
        <p>Поточне значення (Count): <strong>{count}</strong></p>
        <p>Попереднє значення (Previous): <strong>{previousCount !== undefined ? previousCount : 'немає'}</strong></p>
      </div>

      <button
        onClick={() => setCount(count + 1)}
        style={{ padding: '8px 15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Збільшити лічильник
      </button>
    </div>
  );
};

export default PreviousComponent;
