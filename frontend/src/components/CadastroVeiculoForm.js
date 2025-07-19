import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import axios from 'axios';

const CadastroVeiculoForm = () => {
  const [activeTab, setActiveTab] = useState('utilitario');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [utilitario, setUtilitario] = useState({
    placa: '',
    modelo: '',
    marca: '',
    anoFabricacao: '',
    anoModelo: '',
    cor: '',
    dataAquisicao: '',
    valor: '',
    status: 'DISPONIVEL',
    capacidadeCarga: '',
    tipoCarroceria: '',
    volumeCarga: '',
    numeroEixos: ''
  });

  const [passeio, setPasseio] = useState({
    placa: '',
    modelo: '',
    marca: '',
    anoFabricacao: '',
    anoModelo: '',
    cor: '',
    dataAquisicao: '',
    valor: '',
    status: 'DISPONIVEL',
    numeroPortas: '',
    tipoCombustivel: '',
    capacidadePassageiros: '',
    possuiArCondicionado: false,
    possuiDirecaoHidraulica: false
  });

  const [motocicleta, setMotocicleta] = useState({
    placa: '',
    modelo: '',
    marca: '',
    anoFabricacao: '',
    anoModelo: '',
    cor: '',
    dataAquisicao: '',
    valor: '',
    status: 'DISPONIVEL',
    cilindrada: '',
    tipo: '',
    partidaEletrica: false,
    sistemaFreios: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = (data, type) => {
    const newErrors = {};

    // Validações comuns para todos os tipos
    if (!data.placa.trim()) {
      newErrors.placa = 'Placa é obrigatória';
    } else {
      // Validar formato da placa (Mercosul AAA9A99 ou antigo AAA9999)
      const placaRegex = /^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/;
      if (!placaRegex.test(data.placa.replace(/[^A-Z0-9]/g, ''))) {
        newErrors.placa = 'Placa deve estar no formato Mercosul (AAA9A99) ou antigo (AAA9999)';
      }
    }
    if (!data.modelo.trim()) newErrors.modelo = 'Modelo é obrigatório';
    if (!data.marca.trim()) newErrors.marca = 'Marca é obrigatória';
    if (!data.anoFabricacao) newErrors.anoFabricacao = 'Ano de fabricação é obrigatório';
    if (!data.anoModelo) newErrors.anoModelo = 'Ano do modelo é obrigatório';
    if (!data.cor.trim()) newErrors.cor = 'Cor é obrigatória';
    if (!data.dataAquisicao) newErrors.dataAquisicao = 'Data de aquisição é obrigatória';
    if (!data.valor) newErrors.valor = 'Valor é obrigatório';

    // Validações específicas por tipo
    if (type === 'utilitario') {
      if (!data.capacidadeCarga) newErrors.capacidadeCarga = 'Capacidade de carga é obrigatória';
      if (!data.tipoCarroceria.trim()) newErrors.tipoCarroceria = 'Tipo de carroceria é obrigatório';
      if (!data.volumeCarga) newErrors.volumeCarga = 'Volume de carga é obrigatório';
      if (!data.numeroEixos) newErrors.numeroEixos = 'Número de eixos é obrigatório';
    } else if (type === 'passeio') {
      if (!data.numeroPortas) newErrors.numeroPortas = 'Número de portas é obrigatório';
      if (!data.tipoCombustivel.trim()) newErrors.tipoCombustivel = 'Tipo de combustível é obrigatório';
      if (!data.capacidadePassageiros) newErrors.capacidadePassageiros = 'Capacidade de passageiros é obrigatória';
    } else if (type === 'motocicleta') {
      if (!data.cilindrada) newErrors.cilindrada = 'Cilindrada é obrigatória';
      if (!data.tipo.trim()) newErrors.tipo = 'Tipo é obrigatório';
      if (!data.sistemaFreios.trim()) newErrors.sistemaFreios = 'Sistema de freios é obrigatório';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const data = activeTab === 'utilitario' ? utilitario : 
                 activeTab === 'passeio' ? passeio : motocicleta;
    
    const validationErrors = validateForm(data, activeTab);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const endpoint = `/api/veiculos/${activeTab === 'utilitario' ? 'utilitarios' : 
                                      activeTab === 'passeio' ? 'passeios' : 'motocicletas'}`;

      // Converter data para formato dd/MM/yyyy
      const dataToSend = {
        ...data,
        dataAquisicao: data.dataAquisicao ? 
          new Date(data.dataAquisicao).toLocaleDateString('pt-BR') : ''
      };

      const response = await axios.post(endpoint, dataToSend);
      
      setMessage({ 
        type: 'success', 
        text: `${activeTab === 'utilitario' ? 'Utilitário' : 
               activeTab === 'passeio' ? 'Veículo de Passeio' : 'Motocicleta'} cadastrado com sucesso!` 
      });

      // Limpar formulário
      if (activeTab === 'utilitario') {
        setUtilitario({
          placa: '', modelo: '', marca: '', anoFabricacao: '', anoModelo: '', cor: '',
          dataAquisicao: '', valor: '', status: 'DISPONIVEL', capacidadeCarga: '', tipoCarroceria: '',
          volumeCarga: '', numeroEixos: ''
        });
      } else if (activeTab === 'passeio') {
        setPasseio({
          placa: '', modelo: '', marca: '', anoFabricacao: '', anoModelo: '', cor: '',
          dataAquisicao: '', valor: '', status: 'DISPONIVEL', numeroPortas: '', tipoCombustivel: '',
          capacidadePassageiros: '', possuiArCondicionado: false, possuiDirecaoHidraulica: false
        });
      } else {
        setMotocicleta({
          placa: '', modelo: '', marca: '', anoFabricacao: '', anoModelo: '', cor: '',
          dataAquisicao: '', valor: '', status: 'DISPONIVEL', cilindrada: '', tipo: '',
          partidaEletrica: false, sistemaFreios: ''
        });
      }

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data || 'Erro ao cadastrar veículo. Tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const updateVehicle = (field, value) => {
    if (activeTab === 'utilitario') {
      setUtilitario(prev => ({ ...prev, [field]: value }));
    } else if (activeTab === 'passeio') {
      setPasseio(prev => ({ ...prev, [field]: value }));
    } else {
      setMotocicleta(prev => ({ ...prev, [field]: value }));
    }
  };

  const renderInput = (field, label, type = 'text', mask = null, placeholder = '') => {
    const data = activeTab === 'utilitario' ? utilitario : 
                 activeTab === 'passeio' ? passeio : motocicleta;
    
    const value = data[field];
    const hasError = errors[field];
    const inputClass = `input-field ${hasError ? 'input-error' : ''}`;

    if (mask) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-dark-200 mb-1">
            {label}
          </label>
          <InputMask
            mask={mask}
            value={value}
            onChange={(e) => updateVehicle(field, e.target.value)}
            className={inputClass}
            placeholder={placeholder}
          />
          {hasError && <p className="mt-1 text-sm text-red-400">{hasError}</p>}
        </div>
      );
    }

    if (type === 'checkbox') {
      return (
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => updateVehicle(field, e.target.checked)}
              className="mr-2 rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-dark-200">{label}</span>
          </label>
          {hasError && <p className="mt-1 text-sm text-red-400">{hasError}</p>}
        </div>
      );
    }

    if (type === 'select') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-dark-200 mb-1">
            {label}
          </label>
          <select
            value={value}
            onChange={(e) => updateVehicle(field, e.target.value)}
            className={inputClass}
          >
            <option value="">Selecione...</option>
            {placeholder.split(',').map(option => (
              <option key={option.trim()} value={option.trim()}>
                {option.trim()}
              </option>
            ))}
          </select>
          {hasError && <p className="mt-1 text-sm text-red-400">{hasError}</p>}
        </div>
      );
    }

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-dark-200 mb-1">
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => updateVehicle(field, e.target.value)}
          className={inputClass}
          placeholder={placeholder}
        />
        {hasError && <p className="mt-1 text-sm text-red-400">{hasError}</p>}
      </div>
    );
  };

  const clearForm = () => {
    if (activeTab === 'utilitario') {
      setUtilitario({
        placa: '', modelo: '', marca: '', anoFabricacao: '', anoModelo: '', cor: '',
        dataAquisicao: '', valor: '', status: 'DISPONIVEL', capacidadeCarga: '', tipoCarroceria: '',
        volumeCarga: '', numeroEixos: ''
      });
    } else if (activeTab === 'passeio') {
      setPasseio({
        placa: '', modelo: '', marca: '', anoFabricacao: '', anoModelo: '', cor: '',
        dataAquisicao: '', valor: '', status: 'DISPONIVEL', numeroPortas: '', tipoCombustivel: '',
        capacidadePassageiros: '', possuiArCondicionado: false, possuiDirecaoHidraulica: false
      });
    } else {
      setMotocicleta({
        placa: '', modelo: '', marca: '', anoFabricacao: '', anoModelo: '', cor: '',
        dataAquisicao: '', valor: '', status: 'DISPONIVEL', cilindrada: '', tipo: '',
        partidaEletrica: false, sistemaFreios: ''
      });
    }
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="card-dark rounded-lg p-6">
      {/* Tabs */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('utilitario')}
          className={`flex-1 py-2 px-4 rounded-l-md font-medium transition duration-200 ${
            activeTab === 'utilitario' ? 'tab-active' : 'tab-inactive'
          }`}
        >
          Utilitário
        </button>
        <button
          onClick={() => setActiveTab('passeio')}
          className={`flex-1 py-2 px-4 font-medium transition duration-200 ${
            activeTab === 'passeio' ? 'tab-active' : 'tab-inactive'
          }`}
        >
          Passeio
        </button>
        <button
          onClick={() => setActiveTab('motocicleta')}
          className={`flex-1 py-2 px-4 rounded-r-md font-medium transition duration-200 ${
            activeTab === 'motocicleta' ? 'tab-active' : 'tab-inactive'
          }`}
        >
          Motocicleta
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-900 text-green-300 border border-green-700' 
            : 'bg-red-900 text-red-300 border border-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dados Básicos */}
          <div>
            <h3 className="text-lg font-semibold text-dark-100 mb-4">
              Dados Básicos do Veículo
            </h3>
            
            {renderInput('placa', 'Placa', 'text', 'AAA9A99', 'ABC1D23')}
            {renderInput('modelo', 'Modelo', 'text', null, 'Digite o modelo')}
            {renderInput('marca', 'Marca', 'text', null, 'Digite a marca')}
            
            <div className="grid grid-cols-2 gap-4">
              {renderInput('anoFabricacao', 'Ano Fabricação', 'number', null, '2020')}
              {renderInput('anoModelo', 'Ano Modelo', 'number', null, '2021')}
            </div>
            
            {renderInput('cor', 'Cor', 'text', null, 'Digite a cor')}
            {renderInput('dataAquisicao', 'Data de Aquisição', 'date')}
            {renderInput('valor', 'Valor (R$)', 'number', null, '100.00')}
          </div>

          {/* Dados Específicos */}
          <div>
            <h3 className="text-lg font-semibold text-dark-100 mb-4">
              {activeTab === 'utilitario' ? 'Dados do Utilitário' :
               activeTab === 'passeio' ? 'Dados do Passeio' : 'Dados da Motocicleta'}
            </h3>
            
            {activeTab === 'utilitario' && (
              <>
                {renderInput('capacidadeCarga', 'Capacidade de Carga (kg)', 'number', null, '1000')}
                {renderInput('tipoCarroceria', 'Tipo de Carroceria', 'select', null, 'Baú,Carroceria Aberta,Refrigerada,Tanque')}
                {renderInput('volumeCarga', 'Volume de Carga (m³)', 'number', null, '10.5')}
                {renderInput('numeroEixos', 'Número de Eixos', 'number', null, '2')}
              </>
            )}

            {activeTab === 'passeio' && (
              <>
                {renderInput('numeroPortas', 'Número de Portas', 'select', null, '2,3,4,5')}
                {renderInput('tipoCombustivel', 'Tipo de Combustível', 'select', null, 'Gasolina,Flex,Diesel,Elétrico,Híbrido')}
                {renderInput('capacidadePassageiros', 'Capacidade de Passageiros', 'number', null, '5')}
                {renderInput('possuiArCondicionado', 'Possui Ar Condicionado', 'checkbox')}
                {renderInput('possuiDirecaoHidraulica', 'Possui Direção Hidráulica', 'checkbox')}
              </>
            )}

            {activeTab === 'motocicleta' && (
              <>
                {renderInput('cilindrada', 'Cilindrada (cm³)', 'number', null, '150')}
                {renderInput('tipo', 'Tipo', 'select', null, 'Street,Trail,Custom,Sport,Touring,Scooter')}
                {renderInput('partidaEletrica', 'Partida Elétrica', 'checkbox')}
                {renderInput('sistemaFreios', 'Sistema de Freios', 'select', null, 'Tambor,Disco,ABS,CBS')}
              </>
            )}
          </div>
        </div>

        {/* Botões */}
        <div className="mt-6 flex gap-4">
          <button
            type="button"
            onClick={clearForm}
            className="btn-secondary"
            disabled={loading}
          >
            Limpar
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Veículo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroVeiculoForm;
