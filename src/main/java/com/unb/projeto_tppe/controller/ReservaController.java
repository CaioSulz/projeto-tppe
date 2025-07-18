package com.unb.projeto_tppe.controller;

import com.unb.projeto_tppe.dto.ReservaDTO;
import com.unb.projeto_tppe.model.Reserva;
import com.unb.projeto_tppe.model.Veiculo;
import com.unb.projeto_tppe.model.PessoaFisica;
import com.unb.projeto_tppe.model.PessoaJuridica;
import com.unb.projeto_tppe.service.ReservaService;
import com.unb.projeto_tppe.service.VeiculoService;
import com.unb.projeto_tppe.service.GenericVeiculoServiceImpl;
import com.unb.projeto_tppe.service.PessoaFisicaService;
import com.unb.projeto_tppe.service.PessoaJuridicaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservas")
@Tag(name = "Reservas", description = "API para gerenciamento de reservas de veículos")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @Autowired
    private PessoaFisicaService pessoaFisicaService;

    @Autowired
    private PessoaJuridicaService pessoaJuridicaService;

    @Autowired
    private GenericVeiculoServiceImpl veiculoService;

    @PostMapping
    @Operation(summary = "Criar nova reserva", 
               description = "Cadastra uma nova reserva de veículo no sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Reserva criada com sucesso",
                     content = @Content(schema = @Schema(implementation = Reserva.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
        @ApiResponse(responseCode = "404", description = "Veículo ou cliente não encontrado"),
        @ApiResponse(responseCode = "409", description = "Conflito de horário para o veículo"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> criar(@Valid @RequestBody ReservaDTO reservaDTO) {
        // Verificar se existe conflito de horário
        if (reservaService.existeConflito(
                reservaDTO.getDataInicio(), 
                reservaDTO.getDataFim(), 
                reservaDTO.getVeiculoId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Já existe uma reserva para este veículo no período solicitado");
        }
        
        // Verificar se o veículo existe
        Optional<Veiculo> veiculoOpt = veiculoService.buscarPorId(reservaDTO.getVeiculoId());
        if (veiculoOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Veículo não encontrado com o ID: " + reservaDTO.getVeiculoId());
        }
        
        // Criar objeto Reserva
        Reserva reserva = new Reserva();
        reserva.setDataInicio(reservaDTO.getDataInicio());
        reserva.setDataFim(reservaDTO.getDataFim());
        reserva.setVeiculo(veiculoOpt.get());
        reserva.setValorTotal(reservaDTO.getValorTotal());
        reserva.setObservacoes(reservaDTO.getObservacoes());
        
        if (reservaDTO.getStatus() != null) {
            reserva.setStatus(reservaDTO.getStatus());
        } else {
            reserva.setStatus(Reserva.StatusReserva.PENDENTE);
        }
        
        // Verificar se foi fornecido ID de pessoa física ou jurídica
        if (reservaDTO.getPessoaFisicaId() != null) {
            Optional<PessoaFisica> pessoaFisicaOpt = pessoaFisicaService.buscarPorId(reservaDTO.getPessoaFisicaId());
            if (pessoaFisicaOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Pessoa física não encontrada com o ID: " + reservaDTO.getPessoaFisicaId());
            }
            reserva.setPessoaFisica(pessoaFisicaOpt.get());
            
        } else if (reservaDTO.getPessoaJuridicaId() != null) {
            Optional<PessoaJuridica> pessoaJuridicaOpt = pessoaJuridicaService.buscarPorId(reservaDTO.getPessoaJuridicaId());
            if (pessoaJuridicaOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Pessoa jurídica não encontrada com o ID: " + reservaDTO.getPessoaJuridicaId());
            }
            reserva.setPessoaJuridica(pessoaJuridicaOpt.get());
            
        } else {
            return ResponseEntity.badRequest()
                .body("É necessário fornecer o ID de uma pessoa física ou jurídica para a reserva");
        }
        
        // Salvar a reserva
        Reserva reservaSalva = reservaService.salvar(reserva);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(reservaSalva);
    }

    @GetMapping
    @Operation(summary = "Listar todas as reservas", 
               description = "Retorna uma lista com todas as reservas cadastradas")
    public ResponseEntity<List<Reserva>> listar() {
        return ResponseEntity.ok(reservaService.buscarTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar reserva por ID", 
               description = "Retorna uma reserva específica com base no ID fornecido")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return reservaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/veiculo/{veiculoId}")
    @Operation(summary = "Buscar reservas por veículo", 
               description = "Retorna todas as reservas de um veículo específico")
    public ResponseEntity<?> buscarPorVeiculo(@PathVariable Long veiculoId) {
        Optional<Veiculo> veiculoOpt = veiculoService.buscarPorId(veiculoId);
        if (veiculoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Reserva> reservas = reservaService.buscarPorVeiculo(veiculoOpt.get());
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/pessoa-fisica/{pessoaFisicaId}")
    @Operation(summary = "Buscar reservas por pessoa física", 
               description = "Retorna todas as reservas de uma pessoa física específica")
    public ResponseEntity<?> buscarPorPessoaFisica(@PathVariable Long pessoaFisicaId) {
        Optional<PessoaFisica> pessoaFisicaOpt = pessoaFisicaService.buscarPorId(pessoaFisicaId);
        if (pessoaFisicaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Reserva> reservas = reservaService.buscarPorPessoaFisica(pessoaFisicaOpt.get());
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/pessoa-juridica/{pessoaJuridicaId}")
    @Operation(summary = "Buscar reservas por pessoa jurídica", 
               description = "Retorna todas as reservas de uma pessoa jurídica específica")
    public ResponseEntity<?> buscarPorPessoaJuridica(@PathVariable Long pessoaJuridicaId) {
        Optional<PessoaJuridica> pessoaJuridicaOpt = pessoaJuridicaService.buscarPorId(pessoaJuridicaId);
        if (pessoaJuridicaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Reserva> reservas = reservaService.buscarPorPessoaJuridica(pessoaJuridicaOpt.get());
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Buscar reservas por status", 
               description = "Retorna todas as reservas com um determinado status")
    public ResponseEntity<List<Reserva>> buscarPorStatus(@PathVariable Reserva.StatusReserva status) {
        List<Reserva> reservas = reservaService.buscarPorStatus(status);
        return ResponseEntity.ok(reservas);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar reserva", 
               description = "Atualiza os dados de uma reserva existente com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reserva atualizada com sucesso",
                     content = @Content(schema = @Schema(implementation = Reserva.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
        @ApiResponse(responseCode = "404", description = "Reserva, veículo ou cliente não encontrado"),
        @ApiResponse(responseCode = "409", description = "Conflito de horário para o veículo"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody ReservaDTO reservaDTO) {
        Optional<Reserva> reservaExistente = reservaService.buscarPorId(id);
        
        if (reservaExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Reserva reserva = reservaExistente.get();
        
        // Verificar se existe conflito de horário (excluindo a reserva atual)
        if (!reserva.getVeiculo().getId().equals(reservaDTO.getVeiculoId()) ||
            !reserva.getDataInicio().equals(reservaDTO.getDataInicio()) ||
            !reserva.getDataFim().equals(reservaDTO.getDataFim())) {
            
            if (reservaService.existeConflito(
                    reservaDTO.getDataInicio(), 
                    reservaDTO.getDataFim(), 
                    reservaDTO.getVeiculoId())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Já existe uma reserva para este veículo no período solicitado");
            }
        }
        
        // Verificar se o veículo existe
        Optional<Veiculo> veiculoOpt = veiculoService.buscarPorId(reservaDTO.getVeiculoId());
        if (veiculoOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Veículo não encontrado com o ID: " + reservaDTO.getVeiculoId());
        }
        
        // Atualizar os dados da reserva
        reserva.setDataInicio(reservaDTO.getDataInicio());
        reserva.setDataFim(reservaDTO.getDataFim());
        reserva.setVeiculo(veiculoOpt.get());
        reserva.setValorTotal(reservaDTO.getValorTotal());
        reserva.setObservacoes(reservaDTO.getObservacoes());
        
        if (reservaDTO.getStatus() != null) {
            reserva.setStatus(reservaDTO.getStatus());
        }
        
        // Atualizar pessoa física ou jurídica, se fornecida
        if (reservaDTO.getPessoaFisicaId() != null) {
            Optional<PessoaFisica> pessoaFisicaOpt = pessoaFisicaService.buscarPorId(reservaDTO.getPessoaFisicaId());
            if (pessoaFisicaOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Pessoa física não encontrada com o ID: " + reservaDTO.getPessoaFisicaId());
            }
            reserva.setPessoaFisica(pessoaFisicaOpt.get());
            reserva.setPessoaJuridica(null);
            
        } else if (reservaDTO.getPessoaJuridicaId() != null) {
            Optional<PessoaJuridica> pessoaJuridicaOpt = pessoaJuridicaService.buscarPorId(reservaDTO.getPessoaJuridicaId());
            if (pessoaJuridicaOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Pessoa jurídica não encontrada com o ID: " + reservaDTO.getPessoaJuridicaId());
            }
            reserva.setPessoaJuridica(pessoaJuridicaOpt.get());
            reserva.setPessoaFisica(null);
        }
        
        // Salvar a reserva atualizada
        Reserva reservaAtualizada = reservaService.salvar(reserva);
        return ResponseEntity.ok(reservaAtualizada);
    }
    
    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualizar status da reserva", 
               description = "Atualiza apenas o status de uma reserva existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Status da reserva atualizado com sucesso",
                     content = @Content(schema = @Schema(implementation = Reserva.class))),
        @ApiResponse(responseCode = "404", description = "Reserva não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> atualizarStatus(@PathVariable Long id, @RequestParam Reserva.StatusReserva status) {
        try {
            Reserva reserva = reservaService.atualizarStatus(id, status);
            return ResponseEntity.ok(reserva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir reserva", 
               description = "Remove uma reserva do sistema com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Reserva excluída com sucesso"),
        @ApiResponse(responseCode = "404", description = "Reserva não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!reservaService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        reservaService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
