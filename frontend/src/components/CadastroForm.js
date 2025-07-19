import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import axios from 'axios';

const CadastroForm = () => {
  const [activeTab, setActiveTab] = useState('fisica');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [pessoaFisica, setPessoaFisica] = useState({
    nome: '',
    cpf: '',
    rg: '',
    email: '',
    telefone: '',
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  });

  const [pessoaJuridica, setPessoaJuridica] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  });

  const [errors, setErrors] = useState({});

  const validateForm = (data, type) => {
    const newErrors = {};

    if (type === 'fisica') {
      if (!data.nome.trim()) newErrors.nome = 'Nome é obrigatório';
      if (!data.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
      if (!data.email.trim()) newErrors.email = 'Email é obrigatório';
      if (!data.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    } else {
      if (!data.razaoSocial.trim()) newErrors.razaoSocial = 'Razão Social é obrigatória';
      if (!data.nomeFantasia.trim()) newErrors.nomeFantasia = 'Nome Fantasia é obrigatório';
      if (!data.cnpj.trim()) newErrors.cnpj = 'CNPJ é obrigatório';
      if (!data.email.trim()) newErrors.email = 'Email é obrigatório';
      if (!data.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    }

    // Validação de endereço
    if (!data.endereco.rua.trim()) newErrors['endereco.rua'] = 'Rua é obrigatória';
    if (!data.endereco.numero.trim()) newErrors['endereco.numero'] = 'Número é obrigatório';
    if (!data.endereco.bairro.trim()) newErrors['endereco.bairro'] = 'Bairro é obrigatório';
    if (!data.endereco.cidade.trim()) newErrors['endereco.cidade'] = 'Cidade é obrigatória';
    if (!data.endereco.estado.trim()) newErrors['endereco.estado'] = 'Estado é obrigatório';
    if (!data.endereco.cep.trim()) newErrors['endereco.cep'] = 'CEP é obrigatório';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const data = activeTab === 'fisica' ? pessoaFisica : pessoaJuridica;
    const validationErrors = validateForm(data, activeTab);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const endpoint = activeTab === 'fisica' 
        ? '/api/pessoas-fisicas'
        : '/api/pessoas-juridicas';

      const response = await axios.post(endpoint, data);
      
      setMessage({ 
        type: 'success', 
        text: `${activeTab === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'} cadastrada com sucesso!` 
      });

      // Limpar formulário
      if (activeTab === 'fisica') {
        setPessoaFisica({
          nome: '', cpf: '', rg: '', email: '', telefone: '',
          endereco: { rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' }
        });
      } else {
        setPessoaJuridica({
          razaoSocial: '', nomeFantasia: '', cnpj: '', email: '', telefone: '',
          endereco: { rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' }
        });
      }

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data || 'Erro ao cadastrar. Tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePessoaFisica = (field, value) => {
    if (field.includes('endereco.')) {
      const enderecoField = field.split('.')[1];
      setPessoaFisica(prev => ({
        ...prev,
        endereco: { ...prev.endereco, [enderecoField]: value }
      }));
    } else {
      setPessoaFisica(prev => ({ ...prev, [field]: value }));
    }
  };

  const updatePessoaJuridica = (field, value) => {
    if (field.includes('endereco.')) {
      const enderecoField = field.split('.')[1];
      setPessoaJuridica(prev => ({
        ...prev,
        endereco: { ...prev.endereco, [enderecoField]: value }
      }));
    } else {
      setPessoaJuridica(prev => ({ ...prev, [field]: value }));
    }
  };

  const renderInput = (field, label, type = 'text', mask = null, placeholder = '') => {
    const data = activeTab === 'fisica' ? pessoaFisica : pessoaJuridica;
    const updateFunction = activeTab === 'fisica' ? updatePessoaFisica : updatePessoaJuridica;
    
    let value;
    if (field.includes('endereco.')) {
      const enderecoField = field.split('.')[1];
      value = data.endereco[enderecoField];
    } else {
      value = data[field];
    }

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
            onChange={(e) => updateFunction(field, e.target.value)}
            className={inputClass}
            placeholder={placeholder}
          />
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
          onChange={(e) => updateFunction(field, e.target.value)}
          className={inputClass}
          placeholder={placeholder}
        />
        {hasError && <p className="mt-1 text-sm text-red-600">{hasError}</p>}
      </div>
    );
  };

  return (
    <div className="card-dark rounded-lg p-6">
      {/* Tabs */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('fisica')}
          className={`flex-1 py-2 px-4 rounded-l-md font-medium transition duration-200 ${
            activeTab === 'fisica' ? 'tab-active' : 'tab-inactive'
          }`}
        >
          Pessoa Física
        </button>
        <button
          onClick={() => setActiveTab('juridica')}
          className={`flex-1 py-2 px-4 rounded-r-md font-medium transition duration-200 ${
            activeTab === 'juridica' ? 'tab-active' : 'tab-inactive'
          }`}
        >
          Pessoa Jurídica
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
          {/* Dados Pessoais/Empresariais */}
          <div>
            <h3 className="text-lg font-semibold text-dark-100 mb-4">
              {activeTab === 'fisica' ? 'Dados Pessoais' : 'Dados Empresariais'}
            </h3>
            
            {activeTab === 'fisica' ? (
              <>
                {renderInput('nome', 'Nome Completo', 'text', null, 'Digite o nome completo')}
                {renderInput('cpf', 'CPF', 'text', '999.999.999-99', '000.000.000-00')}
                {renderInput('rg', 'RG', 'text', null, 'Digite o RG')}
              </>
            ) : (
              <>
                {renderInput('razaoSocial', 'Razão Social', 'text', null, 'Digite a razão social')}
                {renderInput('nomeFantasia', 'Nome Fantasia', 'text', null, 'Digite o nome fantasia')}
                {renderInput('cnpj', 'CNPJ', 'text', '99.999.999/9999-99', '00.000.000/0000-00')}
              </>
            )}
            
            {renderInput('email', 'Email', 'email', null, 'exemplo@email.com')}
            {renderInput('telefone', 'Telefone', 'text', '(99) 99999-9999', '(00) 00000-0000')}
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-semibold text-dark-100 mb-4">Endereço</h3>
            
            {renderInput('endereco.cep', 'CEP', 'text', '99999-999', '00000-000')}
            {renderInput('endereco.rua', 'Rua', 'text', null, 'Digite a rua')}
            
            <div className="grid grid-cols-2 gap-4">
              {renderInput('endereco.numero', 'Número', 'text', null, '123')}
              {renderInput('endereco.complemento', 'Complemento', 'text', null, 'Apto 101')}
            </div>
            
            {renderInput('endereco.bairro', 'Bairro', 'text', null, 'Digite o bairro')}
            {renderInput('endereco.cidade', 'Cidade', 'text', null, 'Digite a cidade')}
            {renderInput('endereco.estado', 'Estado', 'text', null, 'UF')}
          </div>
        </div>

        {/* Botões */}
        <div className="mt-6 flex gap-4">
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'fisica') {
                setPessoaFisica({
                  nome: '', cpf: '', rg: '', email: '', telefone: '',
                  endereco: { rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' }
                });
              } else {
                setPessoaJuridica({
                  razaoSocial: '', nomeFantasia: '', cnpj: '', email: '', telefone: '',
                  endereco: { rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' }
                });
              }
              setErrors({});
              setMessage({ type: '', text: '' });
            }}
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
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroForm;
