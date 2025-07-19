package com.unb.projeto_tppe.repository;

import com.unb.projeto_tppe.model.Reserva;
import com.unb.projeto_tppe.model.Veiculo;
import com.unb.projeto_tppe.model.PessoaFisica;
import com.unb.projeto_tppe.model.PessoaJuridica;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    
    List<Reserva> findByVeiculo(Veiculo veiculo);
    
    List<Reserva> findByPessoaFisica(PessoaFisica pessoaFisica);
    
    List<Reserva> findByPessoaJuridica(PessoaJuridica pessoaJuridica);
    
    List<Reserva> findByStatus(Reserva.StatusReserva status);
    
    @Query("SELECT r FROM Reserva r WHERE r.dataInicio <= :dataFim AND r.dataFim >= :dataInicio AND r.veiculo.id = :veiculoId")
    List<Reserva> findReservasConflitantes(
        @Param("dataInicio") LocalDateTime dataInicio,
        @Param("dataFim") LocalDateTime dataFim,
        @Param("veiculoId") Long veiculoId
    );
    
    @Query("SELECT r FROM Reserva r WHERE r.dataInicio BETWEEN :inicio AND :fim OR r.dataFim BETWEEN :inicio AND :fim")
    List<Reserva> findByPeriodo(
        @Param("inicio") LocalDateTime inicio, 
        @Param("fim") LocalDateTime fim
    );
}
