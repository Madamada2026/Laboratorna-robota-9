import React from 'react';
import { useMediaQuery } from './hooks/useMediaQuery';

const MediaQueryComponent = () => {
  // Перевіряємо, чи ширина вікна менша або дорівнює 768px
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Перевіряємо системну темну тему
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Демонстрація хука useMediaQuery</h2>
      
      <div style={{ marginBottom: '15px', padding: '10px', background: '#f4f4f4', borderRadius: '5px' }}>
        <p>Мобільний екран (<code>max-width: 768px</code>):</p>
        <strong style={{ color: isMobile ? 'green' : 'red', fontSize: '18px' }}>
          {isMobile ? 'TRUE (Мобільний режим)' : 'FALSE (Десктопний режим)'}
        </strong>
      </div>

      <div style={{ padding: '10px', background: '#f4f4f4', borderRadius: '5px' }}>
        <p>Системна темна тема (<code>prefers-color-scheme: dark</code>):</p>
        <strong style={{ fontSize: '18px' }}>
          {isDarkMode ? 'Увімкнено (Dark)' : 'Вимкнено (Light)'}
        </strong>
      </div>

      <p style={{ color: 'gray', marginTop: '20px' }}>
        Змінюй ширину вікна браузера, щоб побачити, як значення оновлюється в реальному часі без перезавантаження сторінки.
      </p>
    </div>
  );
};

export default MediaQueryComponent;
