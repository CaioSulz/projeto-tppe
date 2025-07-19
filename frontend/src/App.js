import React, { useState } from 'react';
import CadastroForm from './components/CadastroForm';
import CadastroVeiculoForm from './components/CadastroVeiculoForm';
import CadastroReservaForm from './components/CadastroReservaForm';
import GerenciamentoPessoas from './components/GerenciamentoPessoas';
import GerenciamentoVeiculos from './components/GerenciamentoVeiculos';
import GerenciamentoReservas from './components/GerenciamentoReservas';
import './index.css';

function App() {
  const [activeSection, setActiveSection] = useState('pessoas');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header com navegação */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-white">Sistema de Gestão</h1>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveSection('pessoas')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeSection === 'pessoas'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Cadastro de Pessoas
              </button>
              <button
                onClick={() => setActiveSection('gerenciar-pessoas')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeSection === 'gerenciar-pessoas'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Gerenciar Pessoas
              </button>
              <button
                onClick={() => setActiveSection('veiculos')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeSection === 'veiculos'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Cadastro de Veículos
              </button>
              <button
                onClick={() => setActiveSection('gerenciar-veiculos')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeSection === 'gerenciar-veiculos'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Gerenciar Veículos
              </button>
              <button
                onClick={() => setActiveSection('reservas')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeSection === 'reservas'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Nova Reserva
              </button>
              <button
                onClick={() => setActiveSection('gerenciar-reservas')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeSection === 'gerenciar-reservas'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Gerenciar Reservas
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeSection === 'pessoas' && <CadastroForm />}
        {activeSection === 'gerenciar-pessoas' && <GerenciamentoPessoas />}
        {activeSection === 'veiculos' && <CadastroVeiculoForm />}
        {activeSection === 'gerenciar-veiculos' && <GerenciamentoVeiculos />}
        {activeSection === 'reservas' && <CadastroReservaForm />}
        {activeSection === 'gerenciar-reservas' && <GerenciamentoReservas />}
      </main>
    </div>
  );
}

export default App;
