import React, { useState } from 'react';
import CadastroForm from './components/CadastroForm';
import CadastroVeiculoForm from './components/CadastroVeiculoForm';
import './index.css';

function App() {
  const [activeSection, setActiveSection] = useState('pessoas');

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-100 mb-2">
              Sistema de Locação de Veículos
            </h1>
            <p className="text-dark-300 mb-6">
              Gerenciamento de Pessoas e Veículos
            </p>
            
            {/* Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-dark-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveSection('pessoas')}
                  className={`px-6 py-2 rounded-md font-medium transition duration-200 ${
                    activeSection === 'pessoas'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-dark-300 hover:text-dark-100 hover:bg-dark-700'
                  }`}
                >
                  Cadastro de Pessoas
                </button>
                <button
                  onClick={() => setActiveSection('veiculos')}
                  className={`px-6 py-2 rounded-md font-medium transition duration-200 ${
                    activeSection === 'veiculos'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-dark-300 hover:text-dark-100 hover:bg-dark-700'
                  }`}
                >
                  Cadastro de Veículos
                </button>
              </div>
            </div>
          </div>
          
          {/* Content */}
          {activeSection === 'pessoas' ? <CadastroForm /> : <CadastroVeiculoForm />}
        </div>
      </div>
    </div>
  );
}

export default App;
