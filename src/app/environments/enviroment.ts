const isProduction =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1';

export const environment = {
  production: isProduction,
  apiUrl: isProduction
    ? 'https://invoices-angular-backend.onrender.com/api' // ← Změníte po Render deploymentu
    : 'http://localhost:5100/api',
};
