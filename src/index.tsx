import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import './i18n';
import reportWebVitals from './reportWebVitals';
// import { register as registerServiceWorker } from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// registerServiceWorker({
//   onUpdate: () => {
//     // You can show a toast/snackbar to the user here
//     console.log('New version available! Please refresh.');
//   },
//   onSuccess: () => {
//     console.log('App is ready for offline use!');
//   }
// });
