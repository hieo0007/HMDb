import { useState } from 'react'; // 1. Importe o useState
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Films from './pages/Films'; 
import DetalhesPage from './pages/DetalhesPage';
import './App.css';

function App() {
  // 2. Crie o estado da busca aqui no pai
  const [termoBusca, setTermoBusca] = useState("");

  return (
    <Router>
      <div className="app-container">
        {/* 3. Passe a função de setar a busca para a Navbar */}
        <Navbar onSearch={setTermoBusca} /> 

        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* 4. Passe o termo da busca para o componente de Films filtrar os resultados */}
          <Route path="/filmes" element={<Films temaInicial="filmes" buscaGlobal={termoBusca} />} />
          <Route path="/series" element={<Films temaInicial="series" buscaGlobal={termoBusca} />} />
          <Route path="/livros" element={<Films temaInicial="livros" buscaGlobal={termoBusca} />} />

          <Route path="/detalhes/:tipo/:id" element={<DetalhesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;