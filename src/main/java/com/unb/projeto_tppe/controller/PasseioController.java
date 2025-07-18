package com.unb.projeto_tppe.controller;

import com.unb.projeto_tppe.dto.PasseioDTO;
import com.unb.projeto_tppe.model.Passeio;
import com.unb.projeto_tppe.service.PasseioServiceImpl;

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
@RequestMapping("/api/veiculos/passeios")
@Tag(name = "Veículos de Passeio", description = "API para gerenciamento de veículos de passeio")
public class PasseioController {

    @Autowired
    private PasseioServiceImpl passeioService;

    @PostMapping
    @Operation(summary = "Cadastrar novo veículo de passeio", 
               description = "Cadastra um novo veículo de passeio no sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Veículo de passeio cadastrado com sucesso",
                     content = @Content(schema = @Schema(implementation = Passeio.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
        @ApiResponse(responseCode = "409", description = "Veículo com placa já existente"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> cadastrar(@Valid @RequestBody PasseioDTO passeioDTO) {
        // Verifica se já existe um veículo com a mesma placa
        if (passeioService.existePorPlaca(passeioDTO.getPlaca())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Já existe um veículo cadastrado com a placa " + passeioDTO.getPlaca());
        }
        
        // Converte DTO para entidade
        Passeio passeio = new Passeio();
        passeio.setPlaca(passeioDTO.getPlaca());
        passeio.setModelo(passeioDTO.getModelo());
        passeio.setMarca(passeioDTO.getMarca());
        passeio.setAnoFabricacao(passeioDTO.getAnoFabricacao());
        passeio.setAnoModelo(passeioDTO.getAnoModelo());
        passeio.setCor(passeioDTO.getCor());
        passeio.setDataAquisicao(passeioDTO.getDataAquisicao());
        passeio.setStatus(passeioDTO.getStatus());
        passeio.setValor(passeioDTO.getValor());
        
        // Atributos específicos de Passeio
        passeio.setNumeroPortas(passeioDTO.getNumeroPortas());
        passeio.setTipoCombustivel(passeioDTO.getTipoCombustivel());
        passeio.setCapacidadePassageiros(passeioDTO.getCapacidadePassageiros());
        passeio.setPossuiArCondicionado(passeioDTO.getPossuiArCondicionado());
        passeio.setPossuiDirecaoHidraulica(passeioDTO.getPossuiDirecaoHidraulica());
        
        // Salva o veículo de passeio
        Passeio passeioSalvo = passeioService.salvar(passeio);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(passeioSalvo);
    }

    @GetMapping
    @Operation(summary = "Listar todos os veículos de passeio", 
               description = "Retorna uma lista com todos os veículos de passeio cadastrados")
    public ResponseEntity<List<Passeio>> listar() {
        return ResponseEntity.ok(passeioService.buscarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar veículo de passeio por ID", 
               description = "Retorna um veículo de passeio específico com base no ID fornecido")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return passeioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/placa/{placa}")
    @Operation(summary = "Buscar veículo de passeio por placa", 
               description = "Retorna um veículo de passeio específico com base na placa fornecida")
    public ResponseEntity<?> buscarPorPlaca(@PathVariable String placa) {
        return passeioService.buscarPorPlaca(placa)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar veículo de passeio", 
               description = "Atualiza os dados de um veículo de passeio existente com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Veículo de passeio atualizado com sucesso",
                     content = @Content(schema = @Schema(implementation = Passeio.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
        @ApiResponse(responseCode = "404", description = "Veículo de passeio não encontrado"),
        @ApiResponse(responseCode = "409", description = "Veículo com placa já existente"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody PasseioDTO passeioDTO) {
        Optional<Passeio> passeioExistente = passeioService.buscarPorId(id);
        
        if (passeioExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Passeio passeio = passeioExistente.get();
        
        // Verifica se está tentando alterar a placa para uma que já existe
        if (!passeio.getPlaca().equals(passeioDTO.getPlaca()) && 
            passeioService.existePorPlaca(passeioDTO.getPlaca())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Já existe um veículo cadastrado com a placa " + passeioDTO.getPlaca());
        }
        
        // Atualiza os dados básicos do veículo
        passeio.setPlaca(passeioDTO.getPlaca());
        passeio.setModelo(passeioDTO.getModelo());
        passeio.setMarca(passeioDTO.getMarca());
        passeio.setAnoFabricacao(passeioDTO.getAnoFabricacao());
        passeio.setAnoModelo(passeioDTO.getAnoModelo());
        passeio.setCor(passeioDTO.getCor());
        passeio.setDataAquisicao(passeioDTO.getDataAquisicao());
        passeio.setStatus(passeioDTO.getStatus());
        passeio.setValor(passeioDTO.getValor());
        
        // Atualiza os dados específicos do veículo de passeio
        passeio.setNumeroPortas(passeioDTO.getNumeroPortas());
        passeio.setTipoCombustivel(passeioDTO.getTipoCombustivel());
        passeio.setCapacidadePassageiros(passeioDTO.getCapacidadePassageiros());
        passeio.setPossuiArCondicionado(passeioDTO.getPossuiArCondicionado());
        passeio.setPossuiDirecaoHidraulica(passeioDTO.getPossuiDirecaoHidraulica());
        
        // Salva o veículo de passeio atualizado
        Passeio passeioAtualizado = passeioService.salvar(passeio);
        return ResponseEntity.ok(passeioAtualizado);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir veículo de passeio", 
               description = "Remove um veículo de passeio do sistema com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Veículo de passeio excluído com sucesso"),
        @ApiResponse(responseCode = "404", description = "Veículo de passeio não encontrado"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!passeioService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        passeioService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
