package com.unb.projeto_tppe.service;

import com.unb.projeto_tppe.model.Reserva;
import com.unb.projeto_tppe.model.Veiculo;
import com.unb.projeto_tppe.model.PessoaFisica;
import com.unb.projeto_tppe.model.PessoaJuridica;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservaService {
    
    /**
     * Salva uma reserva no sistema
     * @param reserva Reserva a ser salva
     * @return Reserva salva com ID gerado
     */
    Reserva salvar(Reserva reserva);
    
    /**
     * Busca todas as reservas cadastradas
     * @return Lista de reservas
     */
    List<Reserva> buscarTodas();
    
    /**
     * Busca uma reserva pelo seu ID
     * @param id ID da reserva
     * @return Optional com a reserva, se encontrada
     */
    Optional<Reserva> buscarPorId(Long id);
    
    /**
     * Busca todas as reservas de um veículo
     * @param veiculo Veículo
     * @return Lista de reservas do veículo
     */
    List<Reserva> buscarPorVeiculo(Veiculo veiculo);
    
    /**
     * Busca todas as reservas de uma pessoa física
     * @param pessoaFisica Pessoa física
     * @return Lista de reservas da pessoa física
     */
    List<Reserva> buscarPorPessoaFisica(PessoaFisica pessoaFisica);
    
    /**
     * Busca todas as reservas de uma pessoa jurídica
     * @param pessoaJuridica Pessoa jurídica
     * @return Lista de reservas da pessoa jurídica
     */
    List<Reserva> buscarPorPessoaJuridica(PessoaJuridica pessoaJuridica);
    
    /**
     * Busca todas as reservas com um determinado status
     * @param status Status da reserva
     * @return Lista de reservas com o status especificado
     */
    List<Reserva> buscarPorStatus(Reserva.StatusReserva status);
    
    /**
     * Busca todas as reservas em um período
     * @param inicio Data de início
     * @param fim Data de fim
     * @return Lista de reservas no período
     */
    List<Reserva> buscarPorPeriodo(LocalDateTime inicio, LocalDateTime fim);
    
    /**
     * Verifica se existe conflito de horário para uma reserva
     * @param dataInicio Data de início da reserva
     * @param dataFim Data de fim da reserva
     * @param veiculoId ID do veículo
     * @return true se existir conflito, false caso contrário
     */
    boolean existeConflito(LocalDateTime dataInicio, LocalDateTime dataFim, Long veiculoId);
    
    /**
     * Atualiza o status de uma reserva
     * @param id ID da reserva
     * @param status Novo status
     * @return Reserva atualizada
     */
    Reserva atualizarStatus(Long id, Reserva.StatusReserva status);
    
    /**
     * Exclui uma reserva pelo seu ID
     * @param id ID da reserva a excluir
     */
    void excluir(Long id);
}
