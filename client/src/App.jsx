import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import Orders from './pages/Orders';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
