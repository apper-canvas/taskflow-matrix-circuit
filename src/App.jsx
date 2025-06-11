import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import Home from './pages/Home';
import Archive from './pages/Archive';
import NotFound from './pages/NotFound';
import { routes } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col overflow-hidden bg-app">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path={routes.home.path} element={<Home />} />
            <Route path={routes.archive.path} element={<Archive />} />
            <Route path="*" element={<NotFound />} />
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