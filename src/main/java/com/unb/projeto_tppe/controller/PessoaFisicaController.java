package com.unb.projeto_tppe.controller;

import com.unb.projeto_tppe.dto.PessoaFisicaDTO;
import com.unb.projeto_tppe.model.Endereco;
import com.unb.projeto_tppe.model.PessoaFisica;
import com.unb.projeto_tppe.service.PessoaFisicaService;

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
@RequestMapping("/api/pessoas-fisicas")
@Tag(name = "Pessoa Física", description = "API para gerenciamento de pessoas físicas")
public class PessoaFisicaController {

    private final PessoaFisicaService pessoaFisicaService;

    @Autowired
    public PessoaFisicaController(PessoaFisicaService pessoaFisicaService) {
        this.pessoaFisicaService = pessoaFisicaService;
    }

    @PostMapping
    @Operation(summary = "Cadastrar uma nova pessoa física", 
               description = "Cadastra uma nova pessoa física com seus dados pessoais e de endereço")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Pessoa física cadastrada com sucesso",
                     content = @Content(schema = @Schema(implementation = PessoaFisica.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou CPF já cadastrado"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> cadastrar(@Valid @RequestBody PessoaFisicaDTO pessoaFisicaDTO) {
        // Verifica se já existe pessoa com o mesmo CPF
        if (pessoaFisicaService.existePorCpf(pessoaFisicaDTO.getCpf())) {
            return ResponseEntity.badRequest().body("CPF já cadastrado no sistema");
        }
        
        // Converte DTO para entidade
        PessoaFisica pessoaFisica = new PessoaFisica();
        pessoaFisica.setNome(pessoaFisicaDTO.getNome());
        pessoaFisica.setCpf(pessoaFisicaDTO.getCpf());
        pessoaFisica.setRg(pessoaFisicaDTO.getRg());
        pessoaFisica.setEmail(pessoaFisicaDTO.getEmail());
        pessoaFisica.setTelefone(pessoaFisicaDTO.getTelefone());
        
        // Converte e configura o endereço
        Endereco endereco = new Endereco();
        endereco.setRua(pessoaFisicaDTO.getEndereco().getRua());
        endereco.setNumero(pessoaFisicaDTO.getEndereco().getNumero());
        endereco.setComplemento(pessoaFisicaDTO.getEndereco().getComplemento());
        endereco.setBairro(pessoaFisicaDTO.getEndereco().getBairro());
        endereco.setCidade(pessoaFisicaDTO.getEndereco().getCidade());
        endereco.setEstado(pessoaFisicaDTO.getEndereco().getEstado());
        endereco.setCep(pessoaFisicaDTO.getEndereco().getCep());
        
        pessoaFisica.setEndereco(endereco);
        
        PessoaFisica pessoaSalva = pessoaFisicaService.salvar(pessoaFisica);
        return new ResponseEntity<>(pessoaSalva, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Listar todas as pessoas físicas", 
               description = "Retorna uma lista com todas as pessoas físicas cadastradas no sistema")
    public ResponseEntity<List<PessoaFisica>> listarTodos() {
        return ResponseEntity.ok(pessoaFisicaService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar pessoa física por ID", 
               description = "Retorna uma pessoa física específica com base no ID fornecido")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return pessoaFisicaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cpf/{cpf}")
    @Operation(summary = "Buscar pessoa física por CPF", 
               description = "Retorna uma pessoa física específica com base no CPF fornecido")
    public ResponseEntity<?> buscarPorCpf(@PathVariable String cpf) {
        return pessoaFisicaService.buscarPorCpf(cpf)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar pessoa física", 
               description = "Atualiza os dados de uma pessoa física existente com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pessoa física atualizada com sucesso",
                     content = @Content(schema = @Schema(implementation = PessoaFisica.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
        @ApiResponse(responseCode = "404", description = "Pessoa física não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody PessoaFisicaDTO pessoaFisicaDTO) {
        Optional<PessoaFisica> pessoaExistente = pessoaFisicaService.buscarPorId(id);
        
        if (pessoaExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        PessoaFisica pessoaFisica = pessoaExistente.get();
        
        // Verifica se está tentando alterar o CPF para um que já existe
        if (!pessoaFisica.getCpf().equals(pessoaFisicaDTO.getCpf()) && 
            pessoaFisicaService.existePorCpf(pessoaFisicaDTO.getCpf())) {
            return ResponseEntity.badRequest().body("CPF já cadastrado para outra pessoa");
        }
        
        // Atualiza os dados da pessoa física
        pessoaFisica.setNome(pessoaFisicaDTO.getNome());
        pessoaFisica.setCpf(pessoaFisicaDTO.getCpf());
        pessoaFisica.setRg(pessoaFisicaDTO.getRg());
        pessoaFisica.setEmail(pessoaFisicaDTO.getEmail());
        pessoaFisica.setTelefone(pessoaFisicaDTO.getTelefone());
        
        // Atualiza o endereço
        Endereco endereco = pessoaFisica.getEndereco();
        if (endereco == null) {
            endereco = new Endereco();
        }
        endereco.setRua(pessoaFisicaDTO.getEndereco().getRua());
        endereco.setNumero(pessoaFisicaDTO.getEndereco().getNumero());
        endereco.setComplemento(pessoaFisicaDTO.getEndereco().getComplemento());
        endereco.setBairro(pessoaFisicaDTO.getEndereco().getBairro());
        endereco.setCidade(pessoaFisicaDTO.getEndereco().getCidade());
        endereco.setEstado(pessoaFisicaDTO.getEndereco().getEstado());
        endereco.setCep(pessoaFisicaDTO.getEndereco().getCep());
        pessoaFisica.setEndereco(endereco);
        
        PessoaFisica pessoaAtualizada = pessoaFisicaService.salvar(pessoaFisica);
        return ResponseEntity.ok(pessoaAtualizada);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir pessoa física", 
               description = "Remove uma pessoa física do sistema com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Pessoa física excluída com sucesso"),
        @ApiResponse(responseCode = "404", description = "Pessoa física não encontrada"),
        @ApiResponse(responseCode = "409", description = "Pessoa possui reservas associadas"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!pessoaFisicaService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            pessoaFisicaService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Não é possível excluir esta pessoa pois ela possui reservas associadas");
        }
    }
}
