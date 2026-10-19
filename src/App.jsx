import React from 'react';
import DrawingCanvas from './DrawingCanvas';

function App() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '20px', boxSizing: 'border-box', background: '#f0f2f5' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Лабораторна робота: Інтерактивний Canvas</h2>
      <DrawingCanvas />
    </div>
  );
}

export default App;
