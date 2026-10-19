import React, { useState } from 'react';
import HandwritingRecognizer from './HandwritingRecognizer';

export default function App() {
  // Стани для додаткових параметрів коригування алгоритму
  const [tolerance, setTolerance] = useState(0.2);
  const [minPoints, setMinPoints] = useState(15);

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: '"Segoe UI", Roboto, sans-serif',
      color: '#333'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', color: '#1a1a1a', marginBottom: '5px' }}>
          Вебдизайн — Індивідуальне завдання №1
        </h1>
        <p style={{ color: '#666', margin: 0 }}>
          Компонент розпізнавання жестів та фігур на touch-пристроях
        </p>
      </header>

      {/* Панель налаштування параметрів алгоритму */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '25px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>
          ⚙️ Параметри коригування розпізнавання
        </h4>
        
        {/* Налаштування толерантності похибки */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            <span>Толерантність до похибок (Tolerance):</span>
            <span style={{ color: '#007bff', fontWeight: 'bold' }}>{tolerance}</span>
          </label>
          <input 
            type="range" 
            min="0.05" 
            max="0.4" 
            step="0.01" 
            value={tolerance} 
            onChange={(e) => setTolerance(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <small style={{ color: '#6c757d', display: 'block', marginTop: '2px' }}>
            {tolerance <= 0.12 ? '🔴 Суворий режим: фігура має бути ідеально рівною.' : 
             tolerance >= 0.28 ? '🟢 М’який режим: розпізнає навіть дуже криві лінії.' : 
             '🟡 Збалансований режим розпізнавання.'}
          </small>
        </div>

        {/* Налаштування мінімальної кількості точок */}
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            <span>Мінімальна довжина штриха (Points):</span>
            <span style={{ color: '#007bff', fontWeight: 'bold' }}>{minPoints} точок</span>
          </label>
          <input 
            type="range" 
            min="5" 
            max="40" 
            step="1" 
            value={minPoints} 
            onChange={(e) => setMinPoints(parseInt(e.target.value, 10))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <small style={{ color: '#6c757d', display: 'block', marginTop: '2px' }}>
            Захищає від випадкових кліків та надто коротких доторків до екрана.
          </small>
        </div>
      </div>

      {/* Інтерактивна зона малювання та тач-панель */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <HandwritingRecognizer tolerance={tolerance} minPoints={minPoints} />
      </div>

      <footer style={{ textAlign: 'center', marginTop: '30px', color: '#999', fontSize: '12px' }}>
        Розроблено як індивідуальний компонент для Лабораторної роботи №9
      </footer>
    </div>
  );
}
