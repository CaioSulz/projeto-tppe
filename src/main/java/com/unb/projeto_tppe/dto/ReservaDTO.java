package com.unb.projeto_tppe.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.unb.projeto_tppe.model.Reserva.StatusReserva;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaDTO {

    @NotNull(message = "Data de início é obrigatória")
    @Future(message = "Data de início deve ser no futuro")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime dataInicio;

    @NotNull(message = "Data de fim é obrigatória")
    @Future(message = "Data de fim deve ser no futuro")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime dataFim;

    @NotNull(message = "ID do veículo é obrigatório")
    @Positive(message = "ID do veículo deve ser um número positivo")
    private Long veiculoId;

    // Apenas um dos campos abaixo deve ser preenchido (pessoa física ou jurídica)
    private Long pessoaFisicaId;
    
    private Long pessoaJuridicaId;
    
    private StatusReserva status;
    
    @NotNull(message = "Valor total é obrigatório")
    @Positive(message = "Valor total deve ser maior que zero")
    private Double valorTotal;
    
    @Size(max = 500, message = "Observações não podem exceder 500 caracteres")
    private String observacoes;
}
