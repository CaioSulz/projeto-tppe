import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CadastroReservaForm = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  // Estados para listas de seleção
  const [veiculos, setVeiculos] = useState([]);
  const [pessoasFisicas, setPessoasFisicas] = useState([]);
  const [pessoasJuridicas, setPessoasJuridicas] = useState([]);

  // Estado do formulário
  const [reserva, setReserva] = useState({
    dataInicio: '',
    dataFim: '',
    veiculoId: '',
    pessoaFisicaId: '',
    pessoaJuridicaId: '',
    tipoCliente: 'fisica', // 'fisica' ou 'juridica'
    valorTotal: '',
    observacoes: ''
  });

  // Carregar dados iniciais
  useEffect(() => {
    carregarVeiculos();
    carregarPessoasFisicas();
    carregarPessoasJuridicas();
  }, []);

  const carregarVeiculos = async () => {
    try {
      // Buscar todos os tipos de veículos
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

  const carregarPessoasFisicas = async () => {
    try {
      const response = await axios.get('/api/pessoas-fisicas');
      setPessoasFisicas(response.data);
    } catch (error) {
      console.error('Erro ao carregar pessoas físicas:', error);
    }
  };

  const carregarPessoasJuridicas = async () => {
    try {
      const response = await axios.get('/api/pessoas-juridicas');
      setPessoasJuridicas(response.data);
    } catch (error) {
      console.error('Erro ao carregar pessoas jurídicas:', error);
    }
  };

  const calcularValorTotal = () => {
    if (!reserva.dataInicio || !reserva.dataFim || !reserva.veiculoId) return;

    const inicio = new Date(reserva.dataInicio);
    const fim = new Date(reserva.dataFim);
    const diffTime = Math.abs(fim - inicio);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const veiculo = veiculos.find(v => v.id === parseInt(reserva.veiculoId));
    if (veiculo && veiculo.valor) {
      const valorTotal = diffDays * veiculo.valor;
      setReserva(prev => ({ ...prev, valorTotal: valorTotal.toFixed(2) }));
    }
  };

  // Recalcular valor quando mudar datas ou veículo
  useEffect(() => {
    calcularValorTotal();
  }, [reserva.dataInicio, reserva.dataFim, reserva.veiculoId, veiculos]);

  const validateForm = () => {
    const newErrors = {};

    if (!reserva.dataInicio) newErrors.dataInicio = 'Data de início é obrigatória';
    if (!reserva.dataFim) newErrors.dataFim = 'Data de fim é obrigatória';
    if (!reserva.veiculoId) newErrors.veiculoId = 'Veículo é obrigatório';
    if (!reserva.valorTotal) newErrors.valorTotal = 'Valor total é obrigatório';

    // Validar se pelo menos um tipo de cliente foi selecionado
    if (reserva.tipoCliente === 'fisica' && !reserva.pessoaFisicaId) {
      newErrors.pessoaFisicaId = 'Pessoa física é obrigatória';
    }
    if (reserva.tipoCliente === 'juridica' && !reserva.pessoaJuridicaId) {
      newErrors.pessoaJuridicaId = 'Pessoa jurídica é obrigatória';
    }

    // Validar se data fim é posterior à data início
    if (reserva.dataInicio && reserva.dataFim) {
      const inicio = new Date(reserva.dataInicio);
      const fim = new Date(reserva.dataFim);
      if (fim <= inicio) {
        newErrors.dataFim = 'Data de fim deve ser posterior à data de início';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      // Converter datas para formato dd/MM/yyyy HH:mm
      const formatarDataHora = (dataHora) => {
        const date = new Date(dataHora);
        return date.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(',', '');
      };

      const dataToSend = {
        dataInicio: formatarDataHora(reserva.dataInicio),
        dataFim: formatarDataHora(reserva.dataFim),
        veiculoId: parseInt(reserva.veiculoId),
        valorTotal: parseFloat(reserva.valorTotal),
        observacoes: reserva.observacoes || null
      };

      // Adicionar ID do cliente baseado no tipo selecionado
      if (reserva.tipoCliente === 'fisica') {
        dataToSend.pessoaFisicaId = parseInt(reserva.pessoaFisicaId);
      } else {
        dataToSend.pessoaJuridicaId = parseInt(reserva.pessoaJuridicaId);
      }

      const response = await axios.post('/api/reservas', dataToSend);

      setMessage({ 
        type: 'success', 
        text: 'Reserva criada com sucesso!' 
      });

      // Limpar formulário
      setReserva({
        dataInicio: '',
        dataFim: '',
        veiculoId: '',
        pessoaFisicaId: '',
        pessoaJuridicaId: '',
        tipoCliente: 'fisica',
        valorTotal: '',
        observacoes: ''
      });

    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data || 'Erro ao criar reserva. Tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setReserva(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Nova Reserva</h2>

        {message.text && (
          <div className={`mb-4 p-3 rounded ${
            message.type === 'success' 
              ? 'bg-green-700 text-green-100' 
              : 'bg-red-700 text-red-100'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção de Veículo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Veículo</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Selecionar Veículo
              </label>
              <select
                value={reserva.veiculoId}
                onChange={(e) => handleInputChange('veiculoId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um veículo</option>
                {veiculos.map(veiculo => (
                  <option key={veiculo.id} value={veiculo.id}>
                    {veiculo.placa} - {veiculo.marca} {veiculo.modelo} ({veiculo.tipo}) - R$ {veiculo.valor}/dia
                  </option>
                ))}
              </select>
              {errors.veiculoId && <p className="mt-1 text-sm text-red-400">{errors.veiculoId}</p>}
            </div>
          </div>

          {/* Seleção de Cliente */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Cliente</h3>
            
            {/* Tipo de Cliente */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tipo de Cliente
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="fisica"
                    checked={reserva.tipoCliente === 'fisica'}
                    onChange={(e) => handleInputChange('tipoCliente', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Pessoa Física</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="juridica"
                    checked={reserva.tipoCliente === 'juridica'}
                    onChange={(e) => handleInputChange('tipoCliente', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Pessoa Jurídica</span>
                </label>
              </div>
            </div>

            {/* Seleção de Pessoa Física */}
            {reserva.tipoCliente === 'fisica' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Pessoa Física
                </label>
                <select
                  value={reserva.pessoaFisicaId}
                  onChange={(e) => handleInputChange('pessoaFisicaId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione uma pessoa física</option>
                  {pessoasFisicas.map(pessoa => (
                    <option key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome} - {pessoa.cpf}
                    </option>
                  ))}
                </select>
                {errors.pessoaFisicaId && <p className="mt-1 text-sm text-red-400">{errors.pessoaFisicaId}</p>}
              </div>
            )}

            {/* Seleção de Pessoa Jurídica */}
            {reserva.tipoCliente === 'juridica' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Pessoa Jurídica
                </label>
                <select
                  value={reserva.pessoaJuridicaId}
                  onChange={(e) => handleInputChange('pessoaJuridicaId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione uma pessoa jurídica</option>
                  {pessoasJuridicas.map(pessoa => (
                    <option key={pessoa.id} value={pessoa.id}>
                      {pessoa.razaoSocial} - {pessoa.cnpj}
                    </option>
                  ))}
                </select>
                {errors.pessoaJuridicaId && <p className="mt-1 text-sm text-red-400">{errors.pessoaJuridicaId}</p>}
              </div>
            )}
          </div>

          {/* Período da Reserva */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Período da Reserva</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Data e Hora de Início
                </label>
                <input
                  type="datetime-local"
                  value={reserva.dataInicio}
                  onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.dataInicio && <p className="mt-1 text-sm text-red-400">{errors.dataInicio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Data e Hora de Fim
                </label>
                <input
                  type="datetime-local"
                  value={reserva.dataFim}
                  onChange={(e) => handleInputChange('dataFim', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.dataFim && <p className="mt-1 text-sm text-red-400">{errors.dataFim}</p>}
              </div>
            </div>
          </div>

          {/* Valor e Observações */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Detalhes da Reserva</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Valor Total (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={reserva.valorTotal}
                  onChange={(e) => handleInputChange('valorTotal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  readOnly
                />
                {errors.valorTotal && <p className="mt-1 text-sm text-red-400">{errors.valorTotal}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Observações
                </label>
                <textarea
                  value={reserva.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  maxLength="500"
                  placeholder="Observações adicionais (opcional)"
                />
              </div>
            </div>
          </div>

          {/* Botão de Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Criar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroReservaForm;
