package com.unb.projeto_tppe.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Data de início é obrigatória")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    @Column(name = "data_inicio", nullable = false)
    private LocalDateTime dataInicio;

    @NotNull(message = "Data de fim é obrigatória")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    @Column(name = "data_fim", nullable = false)
    private LocalDateTime dataFim;

    @NotNull(message = "Veículo é obrigatório")
    @ManyToOne
    @JoinColumn(name = "veiculo_id", nullable = false)
    private Veiculo veiculo;

    @ManyToOne
    @JoinColumn(name = "pessoa_fisica_id")
    private PessoaFisica pessoaFisica;

    @ManyToOne
    @JoinColumn(name = "pessoa_juridica_id")
    private PessoaJuridica pessoaJuridica;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataCriacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusReserva status;

    @Column(name = "valor_total", nullable = false)
    private Double valorTotal;

    @Column(name = "observacoes", length = 500)
    private String observacoes;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDate.now();
        if (status == null) {
            status = StatusReserva.PENDENTE;
        }
    }

    public enum StatusReserva {
        PENDENTE,
        CONFIRMADA,
        CANCELADA,
        CONCLUIDA
    }
}
