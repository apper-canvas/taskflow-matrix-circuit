import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import HomePage from '@/components/pages/HomePage';
import ArchivePage from '@/components/pages/ArchivePage';
import NotFoundPage from '@/components/pages/NotFoundPage';
import { routes } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col overflow-hidden bg-app">
        <Routes>
          <Route path="/" element={<Layout />}>
<Route index element={<HomePage />} />
            <Route path={routes.home.path} element={<HomePage />} />
            <Route path={routes.archive.path} element={<ArchivePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="z-[9999]"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  )
}

export default App