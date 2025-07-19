import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { EditModal, DeleteModal } from './GerenciamentoReservasModals';

const GerenciamentoReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [filteredReservas, setFilteredReservas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingReserva, setEditingReserva] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservaToDelete, setReservaToDelete] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const [pessoasFisicas, setPessoasFisicas] = useState([]);
  const [pessoasJuridicas, setPessoasJuridicas] = useState([]);

  useEffect(() => {
    loadReservas();
    loadVeiculos();
    loadPessoas();
  }, []);

  useEffect(() => {
    filterReservas();
  }, [searchTerm, reservas]);

  const loadReservas = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/reservas');
      setReservas(response.data);
      setMessage({ type: '', text: '' });
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
      setMessage({ 
        type: 'error', 
        text: 'Erro ao carregar reservas. Tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const loadVeiculos = async () => {
    try {
      const [utilitarios, passeios, motocicletas] = await Promise.all([
        axios.get('/api/veiculos/utilitarios'),
        axios.get('/api/veiculos/passeios'),
        axios.get('/api/veiculos/motocicletas')
      ]);
      
      const todosVeiculos = [
        ...utilitarios.data.map(v => ({ ...v, tipo: 'Utilitário' })),
        ...passeios.data.map(v => ({ ...v, tipo: 'Passeio' })),
        ...motocicletas.data.map(v => ({ ...v, tipo: 'Motocicleta' }))
      ];
      
      setVeiculos(todosVeiculos);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
    }
  };

  const loadPessoas = async () => {
    try {
      const [fisicas, juridicas] = await Promise.all([
        axios.get('/api/pessoas-fisicas'),
        axios.get('/api/pessoas-juridicas')
      ]);
      
      setPessoasFisicas(fisicas.data);
      setPessoasJuridicas(juridicas.data);
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
    }
  };

  const filterReservas = () => {
    if (!searchTerm.trim()) {
      setFilteredReservas(reservas);
      return;
    }

    const filtered = reservas.filter(reserva => {
      const nomeCliente = getNomeCliente(reserva);
      const placaVeiculo = getPlacaVeiculo(reserva);
      
      return nomeCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             placaVeiculo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             reserva.status?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    setFilteredReservas(filtered);
  };

  const getNomeCliente = (reserva) => {
    if (reserva.pessoaFisica) {
      return reserva.pessoaFisica.nome;
    } else if (reserva.pessoaJuridica) {
      return reserva.pessoaJuridica.razaoSocial;
    }
    return 'Cliente não identificado';
  };

  const getPlacaVeiculo = (reserva) => {
    return reserva.veiculo?.placa || 'Placa não identificada';
  };

  const getVeiculoInfo = (reserva) => {
    if (reserva.veiculo) {
      return `${reserva.veiculo.marca} ${reserva.veiculo.modelo} (${reserva.veiculo.placa})`;
    }
    return 'Veículo não identificado';
  };

  const handleEdit = (reserva) => {
    setEditingReserva({ 
      ...reserva,
      dataInicio: convertDateForInput(reserva.dataInicio),
      dataFim: convertDateForInput(reserva.dataFim)
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingReserva(null);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      // Converter datas para formato dd/MM/yyyy HH:mm antes de enviar
      const reservaToSave = { ...editingReserva };
      
      if (reservaToSave.dataInicio && reservaToSave.dataInicio.includes('T')) {
        const [date, time] = reservaToSave.dataInicio.split('T');
        const [year, month, day] = date.split('-');
        reservaToSave.dataInicio = `${day}/${month}/${year} ${time}`;
      }
      
      if (reservaToSave.dataFim && reservaToSave.dataFim.includes('T')) {
        const [date, time] = reservaToSave.dataFim.split('T');
        const [year, month, day] = date.split('-');
        reservaToSave.dataFim = `${day}/${month}/${year} ${time}`;
      }

      await axios.put(`/api/reservas/${editingReserva.id}`, reservaToSave);
      
      setMessage({ 
        type: 'success', 
        text: 'Reserva atualizada com sucesso!' 
      });
      
      handleCloseEditModal();
      loadReservas();
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      
      let errorMessage = 'Erro ao atualizar reserva. Tente novamente.';
      if (error.response?.status === 404) {
        errorMessage = 'Reserva não encontrada.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Conflito de horário com outra reserva.';
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

  const handleDeleteClick = (reserva) => {
    setReservaToDelete(reserva);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setReservaToDelete(null);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/reservas/${reservaToDelete.id}`);
      
      setMessage({ 
        type: 'success', 
        text: 'Reserva excluída com sucesso!' 
      });
      
      handleCloseDeleteModal();
      loadReservas();

    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
      
      let errorMessage = 'Erro ao excluir reserva. Tente novamente.';
      if (error.response?.status === 404) {
        errorMessage = 'Reserva não encontrada.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Não é possível excluir esta reserva.';
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
    setEditingReserva(prev => ({
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

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    try {
      // Se já está no formato brasileiro, retorna como está
      if (dateTimeString.includes('/')) {
        return dateTimeString;
      }
      
      // Se está no formato ISO, converte
      const date = new Date(dateTimeString);
      return date.toLocaleString('pt-BR');
    } catch (error) {
      return dateTimeString;
    }
  };

  const convertDateForInput = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    try {
      // Se está no formato brasileiro dd/MM/yyyy HH:mm, converte para datetime-local
      if (dateTimeString.includes('/')) {
        const [datePart, timePart] = dateTimeString.split(' ');
        const [day, month, year] = datePart.split('/');
        const time = timePart || '00:00';
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}`;
      }
      
      // Se está no formato ISO, converte para datetime-local
      const date = new Date(dateTimeString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      return '';
    }
  };

  const calculateDuration = (dataInicio, dataFim) => {
    try {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      const diffTime = Math.abs(fim - inicio);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Gerenciamento de Reservas</h1>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar por nome do cliente, placa do veículo ou status..."
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

        {/* Reservation List */}
        {!loading && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Veículo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data Início</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data Fim</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Valor Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredReservas.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                        {searchTerm ? 'Nenhuma reserva encontrada com os critérios de busca.' : 'Nenhuma reserva cadastrada.'}
                      </td>
                    </tr>
                  ) : (
                    filteredReservas.map((reserva) => (
                      <tr key={reserva.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium">{getNomeCliente(reserva)}</div>
                            <div className="text-sm text-gray-400">
                              {reserva.pessoaFisica ? 'Pessoa Física' : 'Pessoa Jurídica'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{getVeiculoInfo(reserva)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDateTime(reserva.dataInicio)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDateTime(reserva.dataFim)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {formatCurrency(reserva.valorTotal)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            reserva.status === 'CONFIRMADA' ? 'bg-green-900 text-green-100' :
                            reserva.status === 'PENDENTE' ? 'bg-yellow-900 text-yellow-100' :
                            reserva.status === 'CANCELADA' ? 'bg-red-900 text-red-100' :
                            'bg-gray-900 text-gray-100'
                          }`}>
                            {reserva.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(reserva)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteClick(reserva)}
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
          editingReserva={editingReserva}
          loading={loading}
          handleCloseEditModal={handleCloseEditModal}
          handleSaveEdit={handleSaveEdit}
          handleInputChange={handleInputChange}
          veiculos={veiculos}
          pessoasFisicas={pessoasFisicas}
          pessoasJuridicas={pessoasJuridicas}
          formatCurrency={formatCurrency}
        />

        {/* Delete Modal */}
        <DeleteModal
          showDeleteModal={showDeleteModal}
          reservaToDelete={reservaToDelete}
          loading={loading}
          handleCloseDeleteModal={handleCloseDeleteModal}
          handleConfirmDelete={handleConfirmDelete}
          getNomeCliente={getNomeCliente}
          getVeiculoInfo={getVeiculoInfo}
          formatDateTime={formatDateTime}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
};

export default GerenciamentoReservas;
