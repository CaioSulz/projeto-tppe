import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { EditModal, DeleteModal } from './GerenciamentoVeiculosModals';

const GerenciamentoVeiculos = () => {
  const [activeTab, setActiveTab] = useState('utilitarios');
  const [veiculos, setVeiculos] = useState([]);
  const [filteredVeiculos, setFilteredVeiculos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingVeiculo, setEditingVeiculo] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [veiculoToDelete, setVeiculoToDelete] = useState(null);

  const tabs = [
    { id: 'utilitarios', label: 'Utilitários', endpoint: '/api/veiculos/utilitarios' },
    { id: 'passeios', label: 'Passeios', endpoint: '/api/veiculos/passeios' },
    { id: 'motocicletas', label: 'Motocicletas', endpoint: '/api/veiculos/motocicletas' }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  useEffect(() => {
    loadVeiculos();
  }, [activeTab]);

  useEffect(() => {
    filterVeiculos();
  }, [searchTerm, veiculos]);

  const loadVeiculos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(currentTab.endpoint);
      setVeiculos(response.data);
      setMessage({ type: '', text: '' });
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      setMessage({ 
        type: 'error', 
        text: 'Erro ao carregar veículos. Tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const filterVeiculos = () => {
    if (!searchTerm.trim()) {
      setFilteredVeiculos(veiculos);
      return;
    }

    const filtered = veiculos.filter(veiculo => 
      veiculo.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.cor?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVeiculos(filtered);
  };

  const handleEdit = (veiculo) => {
    setEditingVeiculo({ ...veiculo });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingVeiculo(null);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      // Converter data para formato dd/MM/yyyy antes de enviar
      const veiculoToSave = { ...editingVeiculo };
      if (veiculoToSave.dataAquisicao && veiculoToSave.dataAquisicao.includes('-')) {
        const [year, month, day] = veiculoToSave.dataAquisicao.split('-');
        veiculoToSave.dataAquisicao = `${day}/${month}/${year}`;
      }

      await axios.put(`${currentTab.endpoint}/${editingVeiculo.id}`, veiculoToSave);
      
      setMessage({ 
        type: 'success', 
        text: 'Veículo atualizado com sucesso!' 
      });
      
      handleCloseEditModal();
      loadVeiculos();
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      
      let errorMessage = 'Erro ao atualizar veículo. Tente novamente.';
      if (error.response?.status === 404) {
        errorMessage = 'Veículo não encontrado.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Já existe um veículo cadastrado com esta placa.';
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (veiculo) => {
    setVeiculoToDelete(veiculo);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setVeiculoToDelete(null);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${currentTab.endpoint}/${veiculoToDelete.id}`);
      
      setMessage({ 
        type: 'success', 
        text: 'Veículo excluído com sucesso!' 
      });
      
      handleCloseDeleteModal();
      loadVeiculos();

    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      
      let errorMessage = 'Erro ao excluir veículo. Tente novamente.';
      if (error.response?.status === 404) {
        errorMessage = 'Veículo não encontrado.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Não é possível excluir este veículo pois ele possui reservas associadas.';
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditingVeiculo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const convertDateForInput = (dateString) => {
    if (!dateString) return '';
    
    // Se está no formato dd/MM/yyyy, converte para yyyy-MM-dd para o input
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Se já está no formato yyyy-MM-dd, retorna como está
    return dateString;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Gerenciamento de Veículos</h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-800 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar por placa, modelo, marca ou cor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'
          }`}>
            {message.text}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2">Carregando...</p>
          </div>
        )}

        {/* Vehicle List */}
        {!loading && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Placa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Modelo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Marca</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ano</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredVeiculos.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-400">
                        {searchTerm ? 'Nenhum veículo encontrado com os critérios de busca.' : 'Nenhum veículo cadastrado.'}
                      </td>
                    </tr>
                  ) : (
                    filteredVeiculos.map((veiculo) => (
                      <tr key={veiculo.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap font-mono">{veiculo.placa}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{veiculo.modelo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{veiculo.marca}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{veiculo.anoFabricacao}/{veiculo.anoModelo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{veiculo.cor}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(veiculo.valor)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            veiculo.status === 'DISPONIVEL' ? 'bg-green-900 text-green-100' :
                            veiculo.status === 'MANUTENCAO' ? 'bg-yellow-900 text-yellow-100' :
                            'bg-red-900 text-red-100'
                          }`}>
                            {veiculo.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(veiculo)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteClick(veiculo)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        <EditModal
          showEditModal={showEditModal}
          editingVeiculo={editingVeiculo}
          activeTab={activeTab}
          loading={loading}
          handleCloseEditModal={handleCloseEditModal}
          handleSaveEdit={handleSaveEdit}
          handleInputChange={handleInputChange}
          convertDateForInput={convertDateForInput}
        />

        {/* Delete Modal */}
        <DeleteModal
          showDeleteModal={showDeleteModal}
          veiculoToDelete={veiculoToDelete}
          loading={loading}
          handleCloseDeleteModal={handleCloseDeleteModal}
          handleConfirmDelete={handleConfirmDelete}
        />
      </div>
    </div>
  );
};

export default GerenciamentoVeiculos;
