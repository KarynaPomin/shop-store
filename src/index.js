import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { StoreProvider } from './context/StoreContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './styles/global.css';
import ScrollToTop from './components/common/ScrollToTop.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ScrollToTop />
    <ThemeProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </ThemeProvider>
  </BrowserRouter>
);

reportWebVitals();
