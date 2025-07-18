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
public class MotocicletaDTO extends VeiculoDTO {
    
    @NotNull(message = "Cilindrada é obrigatória")
    @Positive(message = "Cilindrada deve ser maior que zero")
    private Integer cilindrada; // em cm³
    
    @NotBlank(message = "Tipo é obrigatório")
    private String tipo; // ex: street, trail, custom, etc.
    
    @NotNull(message = "Partida elétrica é obrigatório")
    private Boolean partidaEletrica;
    
    @NotBlank(message = "Sistema de freios é obrigatório")
    private String sistemaFreios; // ex: tambor, disco, ABS, etc.
}
