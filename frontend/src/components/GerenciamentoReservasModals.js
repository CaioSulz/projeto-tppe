import React from 'react';

const EditModal = ({ 
  showEditModal, 
  editingReserva, 
  loading, 
  handleCloseEditModal, 
  handleSaveEdit, 
  handleInputChange,
  veiculos,
  pessoasFisicas,
  pessoasJuridicas,
  formatCurrency
}) => {
  if (!showEditModal || !editingReserva) return null;

  const calculateTotal = () => {
    if (!editingReserva.dataInicio || !editingReserva.dataFim || !editingReserva.veiculoId) {
      return 0;
    }

    try {
      const inicio = new Date(editingReserva.dataInicio);
      const fim = new Date(editingReserva.dataFim);
      const diffTime = Math.abs(fim - inicio);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const veiculo = veiculos.find(v => v.id === parseInt(editingReserva.veiculoId));
      const valorDiario = veiculo?.valor || 0;
      
      return diffDays * valorDiario;
    } catch (error) {
      return 0;
    }
  };

  const totalCalculado = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Editar Reserva</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dados da Reserva */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Dados da Reserva</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Veículo *</label>
            <select
              value={editingReserva.veiculoId || ''}
              onChange={(e) => handleInputChange('veiculoId', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione um veículo...</option>
              {veiculos.map((veiculo) => (
                <option key={veiculo.id} value={veiculo.id}>
                  {veiculo.marca} {veiculo.modelo} - {veiculo.placa} ({veiculo.tipo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status *</label>
            <select
              value={editingReserva.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione...</option>
              <option value="PENDENTE">Pendente</option>
              <option value="CONFIRMADA">Confirmada</option>
              <option value="CANCELADA">Cancelada</option>
              <option value="FINALIZADA">Finalizada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Data e Hora Início *</label>
            <input
              type="datetime-local"
              value={editingReserva.dataInicio || ''}
              onChange={(e) => handleInputChange('dataInicio', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Data e Hora Fim *</label>
            <input
              type="datetime-local"
              value={editingReserva.dataFim || ''}
              onChange={(e) => handleInputChange('dataFim', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Cliente */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Cliente</h3>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pessoa Física</label>
            <select
              value={editingReserva.pessoaFisicaId || ''}
              onChange={(e) => {
                handleInputChange('pessoaFisicaId', e.target.value ? parseInt(e.target.value) : null);
                if (e.target.value) {
                  handleInputChange('pessoaJuridicaId', null);
                }
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione uma pessoa física...</option>
              {pessoasFisicas.map((pessoa) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome} - {pessoa.cpf}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pessoa Jurídica</label>
            <select
              value={editingReserva.pessoaJuridicaId || ''}
              onChange={(e) => {
                handleInputChange('pessoaJuridicaId', e.target.value ? parseInt(e.target.value) : null);
                if (e.target.value) {
                  handleInputChange('pessoaFisicaId', null);
                }
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione uma pessoa jurídica...</option>
              {pessoasJuridicas.map((pessoa) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.razaoSocial} - {pessoa.cnpj}
                </option>
              ))}
            </select>
          </div>

          {/* Valor */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Valor</h3>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Valor Total Calculado</label>
            <div className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-green-400 font-bold">
              {formatCurrency(totalCalculado)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Valor Total Manual (R$)</label>
            <input
              type="number"
              step="0.01"
              value={editingReserva.valorTotal || ''}
              onChange={(e) => handleInputChange('valorTotal', parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Sugerido: ${formatCurrency(totalCalculado)}`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Observações</label>
            <textarea
              value={editingReserva.observacoes || ''}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Observações adicionais sobre a reserva..."
            />
          </div>
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
  reservaToDelete, 
  loading, 
  handleCloseDeleteModal, 
  handleConfirmDelete,
  getNomeCliente,
  getVeiculoInfo,
  formatDateTime,
  formatCurrency
}) => {
  if (!showDeleteModal || !reservaToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
        
        <div className="mb-6">
          <p className="mb-4">Tem certeza que deseja excluir esta reserva?</p>
          
          <div className="bg-gray-700 p-4 rounded-lg space-y-2 text-sm">
            <div><strong>Cliente:</strong> {getNomeCliente(reservaToDelete)}</div>
            <div><strong>Veículo:</strong> {getVeiculoInfo(reservaToDelete)}</div>
            <div><strong>Período:</strong> {formatDateTime(reservaToDelete.dataInicio)} até {formatDateTime(reservaToDelete.dataFim)}</div>
            <div><strong>Valor:</strong> {formatCurrency(reservaToDelete.valorTotal)}</div>
            <div><strong>Status:</strong> {reservaToDelete.status}</div>
          </div>
          
          <p className="mt-4 text-red-400 text-sm">Esta ação não pode ser desfeita.</p>
        </div>
        
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
