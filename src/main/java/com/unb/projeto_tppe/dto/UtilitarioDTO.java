package com.unb.projeto_tppe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class UtilitarioDTO extends VeiculoDTO {
    
    @NotNull(message = "Capacidade de carga é obrigatória")
    @Positive(message = "Capacidade de carga deve ser maior que zero")
    private Double capacidadeCarga; // em kg
    
    @NotBlank(message = "Tipo de carroceria é obrigatório")
    private String tipoCarroceria; // ex: baú, carroceria aberta, etc.
    
    @NotNull(message = "Volume de carga é obrigatório")
    @Positive(message = "Volume de carga deve ser maior que zero")
    private Double volumeCarga; // em m³
    
    @NotNull(message = "Número de eixos é obrigatório")
    @Positive(message = "Número de eixos deve ser maior que zero")
    private Integer numeroEixos;
}
