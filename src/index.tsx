import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.scss';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);

serviceWorkerRegistration.register();
