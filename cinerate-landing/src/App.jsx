import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';
import DetailsPage from './pages/DetalhesPage';
import Films from './pages/Films';
import LandingPage from './pages/LandingPage';
import PageLogin from './pages/PageLogin';
import { useScrollAnimations } from './hooks/useScrollAnimations';

const CATALOG_ROUTES = ['/filmes', '/series', '/livros'];

function AppShell() {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const isCatalogRoute = CATALOG_ROUTES.some((route) => location.pathname.startsWith(route));

  useScrollAnimations();

  return (
    <div className={`app-container ${isCatalogRoute ? 'catalog-route' : ''}`}>
      <Navbar searchValue={searchTerm} onSearch={setSearchTerm} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/filmes" element={<Films initialTheme="filmes" globalSearch={searchTerm} />} />
        <Route path="/series" element={<Films initialTheme="series" globalSearch={searchTerm} />} />
        <Route path="/livros" element={<Films initialTheme="livros" globalSearch={searchTerm} />} />
        <Route path="/detalhes/:contentType/:id" element={<DetailsPage />} />
        <Route path="/pagelogin" element={<PageLogin />} />
        <Route path="/login" element={<PageLogin />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
