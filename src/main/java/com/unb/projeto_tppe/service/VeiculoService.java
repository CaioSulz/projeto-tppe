package com.unb.projeto_tppe.service;

import com.unb.projeto_tppe.model.Veiculo;

import java.util.List;
import java.util.Optional;

/**
 * Interface genérica para serviços de veículos
 * @param <T> Tipo específico de veículo que estende Veiculo
 */
public interface VeiculoService<T extends Veiculo> {
    
    /**
     * Salva um veículo no sistema
     * @param veiculo Veículo a ser salvo
     * @return Veículo salvo com ID gerado
     */
    T salvar(T veiculo);
    
    /**
     * Busca todos os veículos cadastrados
     * @return Lista de veículos
     */
    List<T> buscarTodos();
    
    /**
     * Busca um veículo pelo seu ID
     * @param id ID do veículo
     * @return Optional com o veículo, se encontrado
     */
    Optional<T> buscarPorId(Long id);
    
    /**
     * Busca um veículo pela sua placa
     * @param placa Placa do veículo
     * @return Optional com o veículo, se encontrado
     */
    Optional<T> buscarPorPlaca(String placa);
    
    /**
     * Verifica se já existe um veículo com a placa informada
     * @param placa Placa a verificar
     * @return true se já existe, false caso contrário
     */
    boolean existePorPlaca(String placa);
    
    /**
     * Exclui um veículo pelo seu ID
     * @param id ID do veículo a excluir
     */
    void excluir(Long id);
}
