package com.unb.projeto_tppe.controller;

import com.unb.projeto_tppe.dto.UtilitarioDTO;
import com.unb.projeto_tppe.model.Utilitario;
import com.unb.projeto_tppe.service.UtilitarioServiceImpl;

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
@RequestMapping("/api/veiculos/utilitarios")
@Tag(name = "Utilitários", description = "API para gerenciamento de veículos utilitários")
public class UtilitarioController {

    @Autowired
    private UtilitarioServiceImpl utilitarioService;

    @PostMapping
    @Operation(summary = "Cadastrar novo utilitário", 
               description = "Cadastra um novo veículo utilitário no sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Utilitário cadastrado com sucesso",
                     content = @Content(schema = @Schema(implementation = Utilitario.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
        @ApiResponse(responseCode = "409", description = "Veículo com placa já existente"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> cadastrar(@Valid @RequestBody UtilitarioDTO utilitarioDTO) {
        // Verifica se já existe um veículo com a mesma placa
        if (utilitarioService.existePorPlaca(utilitarioDTO.getPlaca())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Já existe um veículo cadastrado com a placa " + utilitarioDTO.getPlaca());
        }
        
        // Converte DTO para entidade
        Utilitario utilitario = new Utilitario();
        utilitario.setPlaca(utilitarioDTO.getPlaca());
        utilitario.setModelo(utilitarioDTO.getModelo());
        utilitario.setMarca(utilitarioDTO.getMarca());
        utilitario.setAnoFabricacao(utilitarioDTO.getAnoFabricacao());
        utilitario.setAnoModelo(utilitarioDTO.getAnoModelo());
        utilitario.setCor(utilitarioDTO.getCor());
        utilitario.setDataAquisicao(utilitarioDTO.getDataAquisicao());
        utilitario.setStatus(utilitarioDTO.getStatus());
        utilitario.setValor(utilitarioDTO.getValor());
        
        // Atributos específicos de Utilitario
        utilitario.setCapacidadeCarga(utilitarioDTO.getCapacidadeCarga());
        utilitario.setTipoCarroceria(utilitarioDTO.getTipoCarroceria());
        utilitario.setVolumeCarga(utilitarioDTO.getVolumeCarga());
        utilitario.setNumeroEixos(utilitarioDTO.getNumeroEixos());
        
        // Salva o utilitário
        Utilitario utilitarioSalvo = utilitarioService.salvar(utilitario);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(utilitarioSalvo);
    }

    @GetMapping
    @Operation(summary = "Listar todos os utilitários", 
               description = "Retorna uma lista com todos os utilitários cadastrados")
    public ResponseEntity<List<Utilitario>> listar() {
        return ResponseEntity.ok(utilitarioService.buscarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar utilitário por ID", 
               description = "Retorna um utilitário específico com base no ID fornecido")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return utilitarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/placa/{placa}")
    @Operation(summary = "Buscar utilitário por placa", 
               description = "Retorna um utilitário específico com base na placa fornecida")
    public ResponseEntity<?> buscarPorPlaca(@PathVariable String placa) {
        return utilitarioService.buscarPorPlaca(placa)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar utilitário", 
               description = "Atualiza os dados de um utilitário existente com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Utilitário atualizado com sucesso",
                     content = @Content(schema = @Schema(implementation = Utilitario.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
        @ApiResponse(responseCode = "404", description = "Utilitário não encontrado"),
        @ApiResponse(responseCode = "409", description = "Veículo com placa já existente"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody UtilitarioDTO utilitarioDTO) {
        Optional<Utilitario> utilitarioExistente = utilitarioService.buscarPorId(id);
        
        if (utilitarioExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Utilitario utilitario = utilitarioExistente.get();
        
        // Verifica se está tentando alterar a placa para uma que já existe
        if (!utilitario.getPlaca().equals(utilitarioDTO.getPlaca()) && 
            utilitarioService.existePorPlaca(utilitarioDTO.getPlaca())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Já existe um veículo cadastrado com a placa " + utilitarioDTO.getPlaca());
        }
        
        // Atualiza os dados básicos do veículo
        utilitario.setPlaca(utilitarioDTO.getPlaca());
        utilitario.setModelo(utilitarioDTO.getModelo());
        utilitario.setMarca(utilitarioDTO.getMarca());
        utilitario.setAnoFabricacao(utilitarioDTO.getAnoFabricacao());
        utilitario.setAnoModelo(utilitarioDTO.getAnoModelo());
        utilitario.setCor(utilitarioDTO.getCor());
        utilitario.setDataAquisicao(utilitarioDTO.getDataAquisicao());
        utilitario.setStatus(utilitarioDTO.getStatus());
        utilitario.setValor(utilitarioDTO.getValor());
        
        // Atualiza os dados específicos do utilitário
        utilitario.setCapacidadeCarga(utilitarioDTO.getCapacidadeCarga());
        utilitario.setTipoCarroceria(utilitarioDTO.getTipoCarroceria());
        utilitario.setVolumeCarga(utilitarioDTO.getVolumeCarga());
        utilitario.setNumeroEixos(utilitarioDTO.getNumeroEixos());
        
        // Salva o utilitário atualizado
        Utilitario utilitarioAtualizado = utilitarioService.salvar(utilitario);
        return ResponseEntity.ok(utilitarioAtualizado);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir utilitário", 
               description = "Remove um utilitário do sistema com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Utilitário excluído com sucesso"),
        @ApiResponse(responseCode = "404", description = "Utilitário não encontrado"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!utilitarioService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        utilitarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
