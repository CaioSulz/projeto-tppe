package com.unb.projeto_tppe.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.unb.projeto_tppe.model.Veiculo.StatusVeiculo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class VeiculoDTO {
    
    @NotBlank(message = "Placa é obrigatória")
    @Size(min = 7, max = 8, message = "Placa deve ter entre 7 e 8 caracteres")
    @Pattern(regexp = "^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$", message = "Placa deve estar no formato Mercosul (AAA0A00) ou formato antigo (AAA0000)")
    private String placa;
    
    @NotBlank(message = "Modelo é obrigatório")
    private String modelo;
    
    @NotBlank(message = "Marca é obrigatória")
    private String marca;
    
    @NotNull(message = "Ano de fabricação é obrigatório")
    @Positive(message = "Ano de fabricação deve ser um número positivo")
    private Integer anoFabricacao;
    
    @NotNull(message = "Ano do modelo é obrigatório")
    @Positive(message = "Ano do modelo deve ser um número positivo")
    private Integer anoModelo;
    
    @NotBlank(message = "Cor é obrigatória")
    private String cor;
    
    @NotNull(message = "Data de aquisição é obrigatória")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataAquisicao;
    
    @NotNull(message = "Status do veículo é obrigatório")
    private StatusVeiculo status;
    
    @NotNull(message = "Valor é obrigatório")
    @Positive(message = "Valor deve ser maior que zero")
    private Double valor;
}
