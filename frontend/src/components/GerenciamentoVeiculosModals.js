import React from 'react';
import InputMask from 'react-input-mask';

const EditModal = ({ 
  showEditModal, 
  editingVeiculo, 
  activeTab, 
  loading, 
  handleCloseEditModal, 
  handleSaveEdit, 
  handleInputChange, 
  convertDateForInput 
}) => {
  if (!showEditModal || !editingVeiculo) return null;

  const tabLabels = {
    'utilitarios': 'Utilitário',
    'passeios': 'Passeio', 
    'motocicletas': 'Motocicleta'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Editar {tabLabels[activeTab]}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dados Básicos */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Dados Básicos</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Placa *</label>
            <InputMask
              mask="aaa-9a99"
              value={editingVeiculo.placa || ''}
              onChange={(e) => handleInputChange('placa', e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ABC-1D23"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Modelo *</label>
            <input
              type="text"
              value={editingVeiculo.modelo || ''}
              onChange={(e) => handleInputChange('modelo', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Marca *</label>
            <input
              type="text"
              value={editingVeiculo.marca || ''}
              onChange={(e) => handleInputChange('marca', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cor *</label>
            <input
              type="text"
              value={editingVeiculo.cor || ''}
              onChange={(e) => handleInputChange('cor', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ano Fabricação *</label>
            <input
              type="number"
              value={editingVeiculo.anoFabricacao || ''}
              onChange={(e) => handleInputChange('anoFabricacao', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1900"
              max="2030"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ano Modelo *</label>
            <input
              type="number"
              value={editingVeiculo.anoModelo || ''}
              onChange={(e) => handleInputChange('anoModelo', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1900"
              max="2030"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Data Aquisição *</label>
            <input
              type="date"
              value={convertDateForInput(editingVeiculo.dataAquisicao)}
              onChange={(e) => handleInputChange('dataAquisicao', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Valor (R$) *</label>
            <input
              type="number"
              step="0.01"
              value={editingVeiculo.valor || ''}
              onChange={(e) => handleInputChange('valor', parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status *</label>
            <select
              value={editingVeiculo.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione...</option>
              <option value="DISPONIVEL">Disponível</option>
              <option value="MANUTENCAO">Manutenção</option>
              <option value="INDISPONIVEL">Indisponível</option>
            </select>
          </div>

          {/* Campos específicos por tipo */}
          {activeTab === 'utilitarios' && (
            <>
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Dados Específicos - Utilitário</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Capacidade Carga (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingVeiculo.capacidadeCarga || ''}
                  onChange={(e) => handleInputChange('capacidadeCarga', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo Carroceria</label>
                <input
                  type="text"
                  value={editingVeiculo.tipoCarroceria || ''}
                  onChange={(e) => handleInputChange('tipoCarroceria', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Volume Carga (m³)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingVeiculo.volumeCarga || ''}
                  onChange={(e) => handleInputChange('volumeCarga', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Número de Eixos</label>
                <input
                  type="number"
                  value={editingVeiculo.numeroEixos || ''}
                  onChange={(e) => handleInputChange('numeroEixos', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {activeTab === 'passeios' && (
            <>
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Dados Específicos - Passeio</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Número de Portas</label>
                <input
                  type="number"
                  value={editingVeiculo.numeroPortas || ''}
                  onChange={(e) => handleInputChange('numeroPortas', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Capacidade Passageiros</label>
                <input
                  type="number"
                  value={editingVeiculo.capacidadePassageiros || ''}
                  onChange={(e) => handleInputChange('capacidadePassageiros', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo Combustível</label>
                <input
                  type="text"
                  value={editingVeiculo.tipoCombustivel || ''}
                  onChange={(e) => handleInputChange('tipoCombustivel', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ar Condicionado</label>
                <select
                  value={editingVeiculo.possuiArCondicionado || ''}
                  onChange={(e) => handleInputChange('possuiArCondicionado', e.target.value === 'true')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Direção Hidráulica</label>
                <select
                  value={editingVeiculo.possuiDirecaoHidraulica || ''}
                  onChange={(e) => handleInputChange('possuiDirecaoHidraulica', e.target.value === 'true')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'motocicletas' && (
            <>
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Dados Específicos - Motocicleta</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Cilindrada (cc)</label>
                <input
                  type="number"
                  value={editingVeiculo.cilindrada || ''}
                  onChange={(e) => handleInputChange('cilindrada', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo Freio</label>
                <input
                  type="text"
                  value={editingVeiculo.tipoFreio || ''}
                  onChange={(e) => handleInputChange('tipoFreio', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleCloseEditModal}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ 
  showDeleteModal, 
  veiculoToDelete, 
  loading, 
  handleCloseDeleteModal, 
  handleConfirmDelete 
}) => {
  if (!showDeleteModal || !veiculoToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
        <p className="mb-6">
          Tem certeza que deseja excluir o veículo <strong>{veiculoToDelete.placa}</strong> ({veiculoToDelete.modelo})?
          Esta ação não pode ser desfeita.
        </p>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCloseDeleteModal}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export { EditModal, DeleteModal };
