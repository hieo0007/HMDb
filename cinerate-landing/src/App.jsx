import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';
import DetailsPage from './pages/DetalhesPage';
import Films from './pages/Films';
import LandingPage from './pages/LandingPage';
import PageLogin from './pages/PageLogin';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Router>
      <div className="app-container">
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
    </Router>
  );
}

export default App;
