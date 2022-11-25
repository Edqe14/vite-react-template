import { createEmotionCache, MantineProvider } from '@mantine/core';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const cache = createEmotionCache({
  key: 'mantine',
  prepend: false,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <MantineProvider
    emotionCache={cache}
    withCSSVariables
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MantineProvider>
);
