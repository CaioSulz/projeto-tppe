import React from 'react';
import CadastroForm from './components/CadastroForm';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-100 mb-2">
              Sistema de Locação de Veículos
            </h1>
            <p className="text-dark-300">
              Cadastro de Pessoas Físicas e Jurídicas
            </p>
          </div>
          <CadastroForm />
        </div>
      </div>
    </div>
  );
}

export default App;
