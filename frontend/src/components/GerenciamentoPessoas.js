import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import axios from 'axios';

const GerenciamentoPessoas = () => {
  const [activeTab, setActiveTab] = useState('fisica');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para listas
  const [pessoasFisicas, setPessoasFisicas] = useState([]);
  const [pessoasJuridicas, setPessoasJuridicas] = useState([]);
  
  // Estados para edição
  const [editingPerson, setEditingPerson] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [errors, setErrors] = useState({});

  // Carregar dados iniciais
  useEffect(() => {
    carregarPessoasFisicas();
    carregarPessoasJuridicas();
  }, []);

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

  // Filtrar pessoas baseado na pesquisa
  const pessoasFisicasFiltradas = pessoasFisicas.filter(pessoa =>
    pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pessoa.cpf.includes(searchTerm) ||
    pessoa.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pessoasJuridicasFiltradas = pessoasJuridicas.filter(pessoa =>
    pessoa.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pessoa.nomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pessoa.cnpj.includes(searchTerm) ||
    pessoa.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para iniciar edição
  const iniciarEdicao = (pessoa, tipo) => {
    setEditingPerson({ ...pessoa, tipo });
    setEditForm({
      ...pessoa,
      endereco: { ...pessoa.endereco }
    });
    setShowEditModal(true);
    setErrors({});
  };

  // Função para cancelar edição
  const cancelarEdicao = () => {
    setEditingPerson(null);
    setEditForm({});
    setShowEditModal(false);
    setErrors({});
  };

  // Validação do formulário de edição
  const validateEditForm = () => {
    const newErrors = {};
    
    if (editingPerson.tipo === 'fisica') {
      if (!editForm.nome?.trim()) newErrors.nome = 'Nome é obrigatório';
      if (!editForm.cpf?.trim()) newErrors.cpf = 'CPF é obrigatório';
      if (!editForm.rg?.trim()) newErrors.rg = 'RG é obrigatório';
    } else {
      if (!editForm.razaoSocial?.trim()) newErrors.razaoSocial = 'Razão Social é obrigatória';
      if (!editForm.cnpj?.trim()) newErrors.cnpj = 'CNPJ é obrigatório';
    }
    
    if (!editForm.email?.trim()) newErrors.email = 'Email é obrigatório';
    if (!editForm.telefone?.trim()) newErrors.telefone = 'Telefone é obrigatório';
    
    // Validações de endereço
    if (!editForm.endereco?.rua?.trim()) newErrors['endereco.rua'] = 'Rua é obrigatória';
    if (!editForm.endereco?.numero?.trim()) newErrors['endereco.numero'] = 'Número é obrigatório';
    if (!editForm.endereco?.bairro?.trim()) newErrors['endereco.bairro'] = 'Bairro é obrigatório';
    if (!editForm.endereco?.cidade?.trim()) newErrors['endereco.cidade'] = 'Cidade é obrigatória';
    if (!editForm.endereco?.estado?.trim()) newErrors['endereco.estado'] = 'Estado é obrigatório';
    if (!editForm.endereco?.cep?.trim()) newErrors['endereco.cep'] = 'CEP é obrigatório';

    return newErrors;
  };

  // Função para salvar edição
  const salvarEdicao = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    const validationErrors = validateEditForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const endpoint = editingPerson.tipo === 'fisica' 
        ? `/api/pessoas-fisicas/${editingPerson.id}`
        : `/api/pessoas-juridicas/${editingPerson.id}`;

      await axios.put(endpoint, editForm);

      setMessage({ 
        type: 'success', 
        text: `${editingPerson.tipo === 'fisica' ? 'Pessoa física' : 'Pessoa jurídica'} atualizada com sucesso!` 
      });

      // Recarregar listas
      if (editingPerson.tipo === 'fisica') {
        carregarPessoasFisicas();
      } else {
        carregarPessoasJuridicas();
      }

      cancelarEdicao();

    } catch (error) {
      console.error('Erro ao atualizar pessoa:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data || 'Erro ao atualizar pessoa. Tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir pessoa
  const excluirPessoa = async (pessoa, tipo) => {
    if (!window.confirm(`Tem certeza que deseja excluir ${tipo === 'fisica' ? pessoa.nome : pessoa.razaoSocial}?`)) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const endpoint = tipo === 'fisica' 
        ? `/api/pessoas-fisicas/${pessoa.id}`
        : `/api/pessoas-juridicas/${pessoa.id}`;

      console.log('Tentando excluir:', endpoint);
      const response = await axios.delete(endpoint);
      console.log('Resposta da exclusão:', response.status);

      setMessage({ 
        type: 'success', 
        text: `${tipo === 'fisica' ? 'Pessoa física' : 'Pessoa jurídica'} excluída com sucesso!` 
      });

      // Recarregar listas
      console.log('Recarregando listas...');
      if (tipo === 'fisica') {
        await carregarPessoasFisicas();
      } else {
        await carregarPessoasJuridicas();
      }
      console.log('Listas recarregadas com sucesso');

    } catch (error) {
      console.error('Erro ao excluir pessoa:', error);
      console.error('Status do erro:', error.response?.status);
      console.error('Dados do erro:', error.response?.data);
      
      let errorMessage = 'Erro ao excluir pessoa. Tente novamente.';
      if (error.response?.status === 404) {
        errorMessage = 'Pessoa não encontrada.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Não é possível excluir esta pessoa pois ela possui reservas associadas.';
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

  // Função para atualizar campo do formulário de edição
  const updateEditForm = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditForm(prev => ({ ...prev, [field]: value }));
    }
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Gerenciamento de Pessoas</h2>

        {message.text && (
          <div className={`mb-4 p-3 rounded ${
            message.type === 'success' 
              ? 'bg-green-700 text-green-100' 
              : 'bg-red-700 text-red-100'
          }`}>
            {message.text}
          </div>
        )}

        {/* Abas */}
        <div className="flex mb-6 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('fisica')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'fisica'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            Pessoas Físicas
          </button>
          <button
            onClick={() => setActiveTab('juridica')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'juridica'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            Pessoas Jurídicas
          </button>
        </div>

        {/* Campo de pesquisa */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={`Pesquisar por nome, ${activeTab === 'fisica' ? 'CPF' : 'CNPJ'} ou email...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Lista de Pessoas Físicas */}
        {activeTab === 'fisica' && (
          <div className="space-y-4">
            {pessoasFisicasFiltradas.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                {searchTerm ? 'Nenhuma pessoa física encontrada.' : 'Nenhuma pessoa física cadastrada.'}
              </p>
            ) : (
              pessoasFisicasFiltradas.map(pessoa => (
                <div key={pessoa.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{pessoa.nome}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-300">
                        <p><span className="font-medium">CPF:</span> {pessoa.cpf}</p>
                        <p><span className="font-medium">RG:</span> {pessoa.rg}</p>
                        <p><span className="font-medium">Email:</span> {pessoa.email}</p>
                        <p><span className="font-medium">Telefone:</span> {pessoa.telefone}</p>
                        <p><span className="font-medium">Endereço:</span> {pessoa.endereco.rua}, {pessoa.endereco.numero} - {pessoa.endereco.bairro}</p>
                        <p><span className="font-medium">Cidade:</span> {pessoa.endereco.cidade}/{pessoa.endereco.estado} - {pessoa.endereco.cep}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => iniciarEdicao(pessoa, 'fisica')}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        disabled={loading}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirPessoa(pessoa, 'fisica')}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        disabled={loading}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Lista de Pessoas Jurídicas */}
        {activeTab === 'juridica' && (
          <div className="space-y-4">
            {pessoasJuridicasFiltradas.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                {searchTerm ? 'Nenhuma pessoa jurídica encontrada.' : 'Nenhuma pessoa jurídica cadastrada.'}
              </p>
            ) : (
              pessoasJuridicasFiltradas.map(pessoa => (
                <div key={pessoa.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{pessoa.razaoSocial}</h3>
                      {pessoa.nomeFantasia && (
                        <p className="text-gray-300 text-sm">Nome Fantasia: {pessoa.nomeFantasia}</p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-300">
                        <p><span className="font-medium">CNPJ:</span> {pessoa.cnpj}</p>
                        <p><span className="font-medium">Email:</span> {pessoa.email}</p>
                        <p><span className="font-medium">Telefone:</span> {pessoa.telefone}</p>
                        <p><span className="font-medium">Endereço:</span> {pessoa.endereco.rua}, {pessoa.endereco.numero} - {pessoa.endereco.bairro}</p>
                        <p><span className="font-medium">Cidade:</span> {pessoa.endereco.cidade}/{pessoa.endereco.estado} - {pessoa.endereco.cep}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => iniciarEdicao(pessoa, 'juridica')}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        disabled={loading}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirPessoa(pessoa, 'juridica')}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        disabled={loading}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {showEditModal && editingPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              Editar {editingPerson.tipo === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
            </h3>

            <div className="space-y-4">
              {/* Campos específicos por tipo */}
              {editingPerson.tipo === 'fisica' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                    <input
                      type="text"
                      value={editForm.nome || ''}
                      onChange={(e) => updateEditForm('nome', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.nome && <p className="mt-1 text-sm text-red-400">{errors.nome}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">CPF</label>
                      <InputMask
                        mask="999.999.999-99"
                        value={editForm.cpf || ''}
                        onChange={(e) => updateEditForm('cpf', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.cpf && <p className="mt-1 text-sm text-red-400">{errors.cpf}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">RG</label>
                      <input
                        type="text"
                        value={editForm.rg || ''}
                        onChange={(e) => updateEditForm('rg', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.rg && <p className="mt-1 text-sm text-red-400">{errors.rg}</p>}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Razão Social</label>
                    <input
                      type="text"
                      value={editForm.razaoSocial || ''}
                      onChange={(e) => updateEditForm('razaoSocial', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.razaoSocial && <p className="mt-1 text-sm text-red-400">{errors.razaoSocial}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Nome Fantasia</label>
                      <input
                        type="text"
                        value={editForm.nomeFantasia || ''}
                        onChange={(e) => updateEditForm('nomeFantasia', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">CNPJ</label>
                      <InputMask
                        mask="99.999.999/9999-99"
                        value={editForm.cnpj || ''}
                        onChange={(e) => updateEditForm('cnpj', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.cnpj && <p className="mt-1 text-sm text-red-400">{errors.cnpj}</p>}
                    </div>
                  </div>
                </>
              )}

              {/* Campos comuns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => updateEditForm('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Telefone</label>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={editForm.telefone || ''}
                    onChange={(e) => updateEditForm('telefone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.telefone && <p className="mt-1 text-sm text-red-400">{errors.telefone}</p>}
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h4 className="text-lg font-semibold text-gray-200 mb-3">Endereço</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Rua</label>
                    <input
                      type="text"
                      value={editForm.endereco?.rua || ''}
                      onChange={(e) => updateEditForm('endereco.rua', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors['endereco.rua'] && <p className="mt-1 text-sm text-red-400">{errors['endereco.rua']}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Número</label>
                    <input
                      type="text"
                      value={editForm.endereco?.numero || ''}
                      onChange={(e) => updateEditForm('endereco.numero', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors['endereco.numero'] && <p className="mt-1 text-sm text-red-400">{errors['endereco.numero']}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Complemento</label>
                    <input
                      type="text"
                      value={editForm.endereco?.complemento || ''}
                      onChange={(e) => updateEditForm('endereco.complemento', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Bairro</label>
                    <input
                      type="text"
                      value={editForm.endereco?.bairro || ''}
                      onChange={(e) => updateEditForm('endereco.bairro', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors['endereco.bairro'] && <p className="mt-1 text-sm text-red-400">{errors['endereco.bairro']}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Cidade</label>
                    <input
                      type="text"
                      value={editForm.endereco?.cidade || ''}
                      onChange={(e) => updateEditForm('endereco.cidade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors['endereco.cidade'] && <p className="mt-1 text-sm text-red-400">{errors['endereco.cidade']}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
                    <input
                      type="text"
                      value={editForm.endereco?.estado || ''}
                      onChange={(e) => updateEditForm('endereco.estado', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength="2"
                    />
                    {errors['endereco.estado'] && <p className="mt-1 text-sm text-red-400">{errors['endereco.estado']}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">CEP</label>
                    <InputMask
                      mask="99999-999"
                      value={editForm.endereco?.cep || ''}
                      onChange={(e) => updateEditForm('endereco.cep', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors['endereco.cep'] && <p className="mt-1 text-sm text-red-400">{errors['endereco.cep']}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Botões do modal */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelarEdicao}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={salvarEdicao}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciamentoPessoas;
