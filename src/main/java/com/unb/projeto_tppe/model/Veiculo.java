package com.unb.projeto_tppe.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_veiculo")
public abstract class Veiculo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Placa é obrigatória")
    @Size(min = 7, max = 8, message = "Placa deve ter entre 7 e 8 caracteres")
    @Column(unique = true)
    private String placa;
    
    @NotBlank(message = "Modelo é obrigatório")
    private String modelo;
    
    @NotBlank(message = "Marca é obrigatória")
    private String marca;
    
    @NotNull(message = "Ano de fabricação é obrigatório")
    private Integer anoFabricacao;
    
    @NotNull(message = "Ano do modelo é obrigatório")
    private Integer anoModelo;
    
    @NotBlank(message = "Cor é obrigatória")
    private String cor;
    
    @NotNull(message = "Data de aquisição é obrigatória")
    private LocalDate dataAquisicao;
    
    @NotNull(message = "Status do veículo é obrigatório")
    @Enumerated(EnumType.STRING)
    private StatusVeiculo status;
    
    @NotNull(message = "Valor é obrigatório")
    private Double valor;
    
    // Enum para status do veículo
    public enum StatusVeiculo {
        DISPONIVEL, ALUGADO, MANUTENCAO, VENDIDO
    }
}
