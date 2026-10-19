import React, { useState, useEffect, useCallback, useRef } from 'react';

function TextEditorWithShortcuts() {
  const [text, setText] = useState('Введіть ваш текст сюди або скористайтеся гарячими клавішами...');
  
  // Поточні стани форматування
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // Історія для Undo / Redo (зберігає до 50 станів тексту та стилів)
  const [history, setHistory] = useState([
    { text: 'Введіть ваш текст сюди або скористайтеся гарячими клавішами...', isBold: false, isItalic: false, isUnderline: false }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const textareaRef = useRef(null);

  // Функція для збереження нового стану в історію
  const pushToHistory = useCallback((newText, newBold, newItalic, newUnderline) => {
    setHistory(prev => {
      const sliced = prev.slice(0, historyIndex + 1);
      // Обмежуємо історію максимум 50 останніми операціями
      if (sliced.length >= 50) {
        sliced.shift();
      }
      return [...sliced, { text: newText, isBold: newBold, isItalic: newItalic, isUnderline: newUnderline }];
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Обробка клавіатурних комбінацій
  const handleKeyDown = useCallback((event) => {
    // Перевіряємо, чи фокус знаходиться в textarea або це глобальне натискання
    if (document.activeElement !== textareaRef.current) return;

    const isCtrlOrMeta = event.ctrlKey || event.metaKey;

    if (isCtrlOrMeta) {
      const key = event.key.toLowerCase();

      if (key === 'b') {
        event.preventDefault();
        const nextBold = !isBold;
        setIsBold(nextBold);
        pushToHistory(text, nextBold, isItalic, isUnderline);
      } else if (key === 'i') {
        event.preventDefault();
        const nextItalic = !isItalic;
        setIsItalic(nextItalic);
        pushToHistory(text, isBold, nextItalic, isUnderline);
      } else if (key === 'u') {
        event.preventDefault();
        const nextUnderline = !isUnderline;
        setIsUnderline(nextUnderline);
        pushToHistory(text, isBold, isItalic, nextUnderline);
      } else if (key === 'z') {
        event.preventDefault();
        // Undo
        if (historyIndex > 0) {
          const prevStep = history[historyIndex - 1];
          setText(prevStep.text);
          setIsBold(prevStep.isBold);
          setIsItalic(prevStep.isItalic);
          setIsUnderline(prevStep.isUnderline);
          setHistoryIndex(historyIndex - 1);
        }
      } else if (key === 'y') {
        event.preventDefault();
        // Redo
        if (historyIndex < history.length - 1) {
          const nextStep = history[historyIndex + 1];
          setText(nextStep.text);
          setIsBold(nextStep.isBold);
          setIsItalic(nextStep.isItalic);
          setIsUnderline(nextStep.isUnderline);
          setHistoryIndex(historyIndex + 1);
        }
      }
    }
  }, [isBold, isItalic, isUnderline, text, history, historyIndex, pushToHistory]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    pushToHistory(newText, isBold, isItalic, isUnderline);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h3>Завдання 1: Текстовий редактор з гарячими клавішами</h3>
      
      {/* Панель індикаторів форматування та історії */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '15px', 
        alignItems: 'center',
        flexWrap: 'wrap' 
      }}>
        <span style={{ padding: '6px 12px', background: isBold ? '#1976d2' : '#e0e0e0', color: isBold ? '#fff' : '#333', borderRadius: '4px', fontWeight: 'bold' }}>
          Ctrl+B (Bold)
        </span>
        <span style={{ padding: '6px 12px', background: isItalic ? '#1976d2' : '#e0e0e0', color: isItalic ? '#fff' : '#333', borderRadius: '4px', fontStyle: 'italic' }}>
          Ctrl+I (Italic)
        </span>
        <span style={{ padding: '6px 12px', background: isUnderline ? '#1976d2' : '#e0e0e0', color: isUnderline ? '#fff' : '#333', borderRadius: '4px', textDecoration: 'underline' }}>
          Ctrl+U (Underline)
        </span>
        
        <div style={{ marginLeft: 'auto', fontSize: '14px', color: '#666' }}>
          Крок історії: {historyIndex + 1} / {history.length} (макс. 50)
        </div>
      </div>

      {/* Текстове поле з динамічними стилями */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        rows={8}
        style={{
          width: '100%',
          padding: '15px',
          fontSize: '18px',
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          textDecoration: isUnderline ? 'underline' : 'none',
          border: '2px solid #ccc',
          borderRadius: '8px',
          outline: 'none',
          resize: 'vertical',
          boxSizing: 'border-box'
        }}
        placeholder="Клацніть сюди та спробуйте Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y..."
      />

      <div style={{ marginTop: '15px', background: '#f5f5f5', padding: '12px', borderRadius: '6px', fontSize: '14px', color: '#555' }}>
        <strong>Підказки:</strong>
        <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
          <li><code>Ctrl + B</code> — увімкнути/вимкнути напівжирний шрифт.</li>
          <li><code>Ctrl + I</code> — увімкнути/вимкнути курсив.</li>
          <li><code>Ctrl + U</code> — увімкнути/вимкнути підкреслення.</li>
          <li><code>Ctrl + Z</code> / <code>Ctrl + Y</code> — скасування (Undo) та повторення (Redo) дій.</li>
        </ul>
      </div>
    </div>
  );
}

export default TextEditorWithShortcuts;
