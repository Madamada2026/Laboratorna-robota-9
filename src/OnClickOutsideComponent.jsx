import React, { useState, useRef } from 'react';
import { useOnClickOutside } from './hooks/useOnClickOutside';

const OnClickOutsideComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef();

  // Використовуємо кастомний хук: передаємо реф модалки та колбек для закриття
  useOnClickOutside(modalRef, () => {
    setIsOpen(false);
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Демонстрація хука useOnClickOutside</h2>

      <button
        onClick={() => setIsOpen(true)}
        style={{ padding: '8px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Відкрити модальне вікно
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            ref={modalRef}
            style={{
              background: '#fff',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              minWidth: '300px',
            }}
          >
            <h3>Модальне вікно</h3>
            <p>Клікніть будь-де <strong>поза цим білим блоком</strong>, щоб закрити його.</p>
            <button
              onClick={() => setIsOpen(false)}
              style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnClickOutsideComponent;
