import { LocaleProvider } from '@douyinfe/semi-ui-19';
import vi_VN from '@douyinfe/semi-ui-19/lib/es/locale/source/vi_VN';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import './index.css';
import router from './routes';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  rootEl.classList.add('text-slate-900');
  root.render(
      <LocaleProvider locale={vi_VN}>
        <RouterProvider router={router} />
      </LocaleProvider>
  );
}
