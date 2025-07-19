package com.unb.projeto_tppe.controller;

import com.unb.projeto_tppe.dto.PessoaJuridicaDTO;
import com.unb.projeto_tppe.model.Endereco;
import com.unb.projeto_tppe.model.PessoaJuridica;
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
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pessoas-juridicas")
@Tag(name = "Pessoa Jurídica", description = "API para gerenciamento de pessoas jurídicas")
public class PessoaJuridicaController {

    private final PessoaJuridicaService pessoaJuridicaService;

    @Autowired
    public PessoaJuridicaController(PessoaJuridicaService pessoaJuridicaService) {
        this.pessoaJuridicaService = pessoaJuridicaService;
    }

    @PostMapping
    @Operation(summary = "Cadastrar uma nova pessoa jurídica", 
               description = "Cadastra uma nova pessoa jurídica com seus dados e endereço")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Pessoa jurídica cadastrada com sucesso",
                     content = @Content(schema = @Schema(implementation = PessoaJuridica.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou CNPJ já cadastrado"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> cadastrar(@Valid @RequestBody PessoaJuridicaDTO pessoaJuridicaDTO) {
        // Verifica se já existe pessoa jurídica com o mesmo CNPJ
        if (pessoaJuridicaService.existePorCnpj(pessoaJuridicaDTO.getCnpj())) {
            return ResponseEntity.badRequest().body("CNPJ já cadastrado no sistema");
        }
        
        // Converte DTO para entidade
        PessoaJuridica pessoaJuridica = new PessoaJuridica();
        pessoaJuridica.setRazaoSocial(pessoaJuridicaDTO.getRazaoSocial());
        pessoaJuridica.setNomeFantasia(pessoaJuridicaDTO.getNomeFantasia());
        pessoaJuridica.setCnpj(pessoaJuridicaDTO.getCnpj());
        pessoaJuridica.setEmail(pessoaJuridicaDTO.getEmail());
        pessoaJuridica.setTelefone(pessoaJuridicaDTO.getTelefone());
        
        // Converte e configura o endereço
        Endereco endereco = new Endereco();
        endereco.setRua(pessoaJuridicaDTO.getEndereco().getRua());
        endereco.setNumero(pessoaJuridicaDTO.getEndereco().getNumero());
        endereco.setComplemento(pessoaJuridicaDTO.getEndereco().getComplemento());
        endereco.setBairro(pessoaJuridicaDTO.getEndereco().getBairro());
        endereco.setCidade(pessoaJuridicaDTO.getEndereco().getCidade());
        endereco.setEstado(pessoaJuridicaDTO.getEndereco().getEstado());
        endereco.setCep(pessoaJuridicaDTO.getEndereco().getCep());
        
        pessoaJuridica.setEndereco(endereco);
        
        PessoaJuridica pessoaSalva = pessoaJuridicaService.salvar(pessoaJuridica);
        return new ResponseEntity<>(pessoaSalva, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Listar todas as pessoas jurídicas", 
               description = "Retorna uma lista com todas as pessoas jurídicas cadastradas no sistema")
    public ResponseEntity<List<PessoaJuridica>> listarTodos() {
        return ResponseEntity.ok(pessoaJuridicaService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar pessoa jurídica por ID", 
               description = "Retorna uma pessoa jurídica específica com base no ID fornecido")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return pessoaJuridicaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cnpj/{cnpj}")
    @Operation(summary = "Buscar pessoa jurídica por CNPJ", 
               description = "Retorna uma pessoa jurídica específica com base no CNPJ fornecido")
    public ResponseEntity<?> buscarPorCnpj(@PathVariable String cnpj) {
        return pessoaJuridicaService.buscarPorCnpj(cnpj)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar pessoa jurídica", 
               description = "Atualiza os dados de uma pessoa jurídica existente com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pessoa jurídica atualizada com sucesso",
                     content = @Content(schema = @Schema(implementation = PessoaJuridica.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
        @ApiResponse(responseCode = "404", description = "Pessoa jurídica não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody PessoaJuridicaDTO pessoaJuridicaDTO) {
        Optional<PessoaJuridica> pessoaExistente = pessoaJuridicaService.buscarPorId(id);
        
        if (pessoaExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        PessoaJuridica pessoaJuridica = pessoaExistente.get();
        
        // Verifica se está tentando alterar o CNPJ para um que já existe
        if (!pessoaJuridica.getCnpj().equals(pessoaJuridicaDTO.getCnpj()) && 
            pessoaJuridicaService.existePorCnpj(pessoaJuridicaDTO.getCnpj())) {
            return ResponseEntity.badRequest().body("CNPJ já cadastrado para outra empresa");
        }
        
        // Atualiza os dados da pessoa jurídica
        pessoaJuridica.setRazaoSocial(pessoaJuridicaDTO.getRazaoSocial());
        pessoaJuridica.setNomeFantasia(pessoaJuridicaDTO.getNomeFantasia());
        pessoaJuridica.setCnpj(pessoaJuridicaDTO.getCnpj());
        pessoaJuridica.setEmail(pessoaJuridicaDTO.getEmail());
        pessoaJuridica.setTelefone(pessoaJuridicaDTO.getTelefone());
        
        // Atualiza o endereço
        Endereco endereco = pessoaJuridica.getEndereco();
        if (endereco == null) {
            endereco = new Endereco();
        }
        endereco.setRua(pessoaJuridicaDTO.getEndereco().getRua());
        endereco.setNumero(pessoaJuridicaDTO.getEndereco().getNumero());
        endereco.setComplemento(pessoaJuridicaDTO.getEndereco().getComplemento());
        endereco.setBairro(pessoaJuridicaDTO.getEndereco().getBairro());
        endereco.setCidade(pessoaJuridicaDTO.getEndereco().getCidade());
        endereco.setEstado(pessoaJuridicaDTO.getEndereco().getEstado());
        endereco.setCep(pessoaJuridicaDTO.getEndereco().getCep());
        pessoaJuridica.setEndereco(endereco);
        
        PessoaJuridica pessoaAtualizada = pessoaJuridicaService.salvar(pessoaJuridica);
        return ResponseEntity.ok(pessoaAtualizada);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir pessoa jurídica", 
               description = "Remove uma pessoa jurídica do sistema com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Pessoa jurídica excluída com sucesso"),
        @ApiResponse(responseCode = "404", description = "Pessoa jurídica não encontrada"),
        @ApiResponse(responseCode = "409", description = "Pessoa possui reservas associadas"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!pessoaJuridicaService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            pessoaJuridicaService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Não é possível excluir esta pessoa pois ela possui reservas associadas");
        }
    }
}
