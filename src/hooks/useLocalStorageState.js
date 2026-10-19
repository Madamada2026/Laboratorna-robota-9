import { useState, useEffect } from 'react';

export const useLocalStorageState = (key, initialValue, ttlInSeconds = null) => {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsedItem = JSON.parse(item);

      // Перевіряємо наявність TTL та часу створення (timestamp)
      if (parsedItem && parsedItem._ttl && parsedItem._timestamp) {
        const now = Date.now();
        const expiryTime = parsedItem._timestamp + parsedItem._ttl * 1000;

        // Якщо термін дії минув — видаляємо запис та повертаємо початкове значення
        if (now > expiryTime) {
          window.localStorage.removeItem(key);
          return initialValue;
        }

        return parsedItem.value;
      }

      return parsedItem.value !== undefined ? parsedItem.value : parsedItem;
    } catch (error) {
      console.error(`Помилка зчитування ключа "${key}" з localStorage:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (state === undefined) {
        window.localStorage.removeItem(key);
        return;
      }

      // Зберігаємо дані разом із міткою часу та TTL
      const dataToStore = {
        value: state,
        _timestamp: Date.now(),
        _ttl: ttlInSeconds,
      };

      window.localStorage.setItem(key, JSON.stringify(dataToStore));
    } catch (error) {
      console.error(`Помилка запису ключа "${key}" у localStorage:`, error);
    }
  }, [key, state, ttlInSeconds]);

  return [state, setState];
};
