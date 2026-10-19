import { useEffect } from 'react';

export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Якщо референс ще не прив'язаний або клік відбувся всередині елемента — нічого не робимо
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    // Додаємо слухачі подій на документ (mousedown та touchstart для мобільних)
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Cleanup-функція для видалення слухачів при розмонтуванні компонента
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
