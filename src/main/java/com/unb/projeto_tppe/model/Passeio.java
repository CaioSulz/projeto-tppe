package com.unb.projeto_tppe.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@DiscriminatorValue("PASSEIO")
public class Passeio extends Veiculo {

    @NotNull(message = "Número de portas é obrigatório")
    @Positive(message = "Número de portas deve ser maior que zero")
    private Integer numeroPortas;
    
    @NotBlank(message = "Tipo de combustível é obrigatório")
    private String tipoCombustivel; // gasolina, flex, diesel, elétrico, etc.
    
    @NotNull(message = "Capacidade de passageiros é obrigatória")
    @Positive(message = "Capacidade de passageiros deve ser maior que zero")
    private Integer capacidadePassageiros;
    
    @NotNull(message = "Possui ar condicionado é obrigatório")
    private Boolean possuiArCondicionado;
    
    @NotNull(message = "Possui direção hidráulica é obrigatório")
    private Boolean possuiDirecaoHidraulica;
}
