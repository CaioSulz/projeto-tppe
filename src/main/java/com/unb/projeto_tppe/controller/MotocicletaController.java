package com.unb.projeto_tppe.controller;

import com.unb.projeto_tppe.dto.MotocicletaDTO;
import com.unb.projeto_tppe.model.Motocicleta;
import com.unb.projeto_tppe.service.MotocicletaServiceImpl;

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
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/veiculos/motocicletas")
@Tag(name = "Motocicletas", description = "API para gerenciamento de motocicletas")
public class MotocicletaController {

    @Autowired
    private MotocicletaServiceImpl motocicletaService;

    @PostMapping
    @Operation(summary = "Cadastrar nova motocicleta", 
               description = "Cadastra uma nova motocicleta no sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Motocicleta cadastrada com sucesso",
                     content = @Content(schema = @Schema(implementation = Motocicleta.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
        @ApiResponse(responseCode = "409", description = "Veículo com placa já existente"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> cadastrar(@Valid @RequestBody MotocicletaDTO motocicletaDTO) {
        // Verifica se já existe um veículo com a mesma placa
        if (motocicletaService.existePorPlaca(motocicletaDTO.getPlaca())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Já existe um veículo cadastrado com a placa " + motocicletaDTO.getPlaca());
        }
        
        // Converte DTO para entidade
        Motocicleta motocicleta = new Motocicleta();
        motocicleta.setPlaca(motocicletaDTO.getPlaca());
        motocicleta.setModelo(motocicletaDTO.getModelo());
        motocicleta.setMarca(motocicletaDTO.getMarca());
        motocicleta.setAnoFabricacao(motocicletaDTO.getAnoFabricacao());
        motocicleta.setAnoModelo(motocicletaDTO.getAnoModelo());
        motocicleta.setCor(motocicletaDTO.getCor());
        motocicleta.setDataAquisicao(motocicletaDTO.getDataAquisicao());
        motocicleta.setStatus(motocicletaDTO.getStatus());
        motocicleta.setValor(motocicletaDTO.getValor());
        
        // Atributos específicos de Motocicleta
        motocicleta.setCilindrada(motocicletaDTO.getCilindrada());
        motocicleta.setTipo(motocicletaDTO.getTipo());
        motocicleta.setPartidaEletrica(motocicletaDTO.getPartidaEletrica());
        motocicleta.setSistemaFreios(motocicletaDTO.getSistemaFreios());
        
        // Salva a motocicleta
        Motocicleta motocicletaSalva = motocicletaService.salvar(motocicleta);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(motocicletaSalva);
    }

    @GetMapping
    @Operation(summary = "Listar todas as motocicletas", 
               description = "Retorna uma lista com todas as motocicletas cadastradas")
    public ResponseEntity<List<Motocicleta>> listar() {
        return ResponseEntity.ok(motocicletaService.buscarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar motocicleta por ID", 
               description = "Retorna uma motocicleta específica com base no ID fornecido")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return motocicletaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/placa/{placa}")
    @Operation(summary = "Buscar motocicleta por placa", 
               description = "Retorna uma motocicleta específica com base na placa fornecida")
    public ResponseEntity<?> buscarPorPlaca(@PathVariable String placa) {
        return motocicletaService.buscarPorPlaca(placa)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar motocicleta", 
               description = "Atualiza os dados de uma motocicleta existente com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Motocicleta atualizada com sucesso",
                     content = @Content(schema = @Schema(implementation = Motocicleta.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
        @ApiResponse(responseCode = "404", description = "Motocicleta não encontrada"),
        @ApiResponse(responseCode = "409", description = "Veículo com placa já existente"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody MotocicletaDTO motocicletaDTO) {
        Optional<Motocicleta> motocicletaExistente = motocicletaService.buscarPorId(id);
        
        if (motocicletaExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Motocicleta motocicleta = motocicletaExistente.get();
        
        // Verifica se está tentando alterar a placa para uma que já existe
        if (!motocicleta.getPlaca().equals(motocicletaDTO.getPlaca()) && 
            motocicletaService.existePorPlaca(motocicletaDTO.getPlaca())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Já existe um veículo cadastrado com a placa " + motocicletaDTO.getPlaca());
        }
        
        // Atualiza os dados básicos do veículo
        motocicleta.setPlaca(motocicletaDTO.getPlaca());
        motocicleta.setModelo(motocicletaDTO.getModelo());
        motocicleta.setMarca(motocicletaDTO.getMarca());
        motocicleta.setAnoFabricacao(motocicletaDTO.getAnoFabricacao());
        motocicleta.setAnoModelo(motocicletaDTO.getAnoModelo());
        motocicleta.setCor(motocicletaDTO.getCor());
        motocicleta.setDataAquisicao(motocicletaDTO.getDataAquisicao());
        motocicleta.setStatus(motocicletaDTO.getStatus());
        motocicleta.setValor(motocicletaDTO.getValor());
        
        // Atualiza os dados específicos da motocicleta
        motocicleta.setCilindrada(motocicletaDTO.getCilindrada());
        motocicleta.setTipo(motocicletaDTO.getTipo());
        motocicleta.setPartidaEletrica(motocicletaDTO.getPartidaEletrica());
        motocicleta.setSistemaFreios(motocicletaDTO.getSistemaFreios());
        
        // Salva a motocicleta atualizada
        Motocicleta motocicletaAtualizada = motocicletaService.salvar(motocicleta);
        return ResponseEntity.ok(motocicletaAtualizada);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir motocicleta", 
               description = "Remove uma motocicleta do sistema com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Motocicleta excluída com sucesso"),
        @ApiResponse(responseCode = "404", description = "Motocicleta não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!motocicletaService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        motocicletaService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
