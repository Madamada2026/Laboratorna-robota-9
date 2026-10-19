import React from 'react';
import { useWindowSize } from './hooks/useWindowSize';

const WindowSizeComponent = () => {
  const { width, height } = useWindowSize();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Демонстрація хука useWindowSize</h2>
      <p>Поточна ширина вікна: <strong>{width}px</strong></p>
      <p>Поточна висота вікна: <strong>{height}px</strong></p>
      <p style={{ color: 'gray' }}>Спробуй змінити розмір вікна браузера, щоб побачити оновлення в реальному часі.</p>
    </div>
  );
};

export default WindowSizeComponent;
