import { useState, useCallback } from 'react';

export const useClipboard = (resetInterval = 2000) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState('');

  const copy = useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        setError('Clipboard API не підтримується вашим браузером');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);
        setValue(text);

        // Автоматичне скидання стану copied через заданий інтервал
        if (resetInterval) {
          setTimeout(() => {
            setCopied(false);
          }, resetInterval);
        }

        return true;
      } catch (err) {
        setError(err.message || 'Не вдалося скопіювати текст');
        setCopied(false);
        return false;
      }
    },
    [resetInterval]
  );

  const paste = useCallback(async () => {
    if (!navigator?.clipboard) {
      setError('Clipboard API не підтримується вашим браузером');
      return null;
    }

    try {
      const text = await navigator.clipboard.readText();
      setValue(text);
      setError(null);
      return text;
    } catch (err) {
      setError(err.message || 'Не вдалося прочитати з буфера обміну');
      return null;
    }
  }, []);

  return { copied, error, value, copy, paste };
};
