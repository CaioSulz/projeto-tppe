package com.unb.projeto_tppe.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unb.projeto_tppe.dto.EnderecoDTO;
import com.unb.projeto_tppe.dto.PessoaFisicaDTO;
import com.unb.projeto_tppe.model.PessoaFisica;
import com.unb.projeto_tppe.repository.PessoaFisicaRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Testes de integração para o endpoint de Pessoa Física.
 * Estes testes verificam o comportamento real da API usando o banco de dados principal.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PessoaFisicaControllerTest {

    @LocalServerPort
    private int port;

    private String baseUrl;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private PessoaFisicaRepository pessoaFisicaRepository;

    private HttpHeaders headers;
    
    // Armazenar IDs criados para limpeza após testes
    private Long testPessoaId;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/api/pessoas-fisicas";
        headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
    }

    @AfterEach
    void tearDown() {
        // Limpar pessoas criadas durante os testes para não deixar lixo no banco
        if (testPessoaId != null) {
            Optional<PessoaFisica> pessoaOpt = pessoaFisicaRepository.findById(testPessoaId);
            if (pessoaOpt.isPresent()) {
                pessoaFisicaRepository.deleteById(testPessoaId);
            }
        }
    }

    /**
     * Cria um DTO de Pessoa Física para testes com CPF único
     * @return DTO de Pessoa Física
     */
    private PessoaFisicaDTO createPessoaFisicaDTO() {
        // Usar CPF fixo e válido para testes
        long timestamp = System.currentTimeMillis();
        String cpfFormatado = "999.999.999-99";  // CPF fixo e formatado
        
        PessoaFisicaDTO dto = new PessoaFisicaDTO();
        dto.setNome("Pessoa Teste " + timestamp);
        dto.setCpf(cpfFormatado);
        dto.setRg("123456");
        dto.setEmail("teste" + timestamp + "@example.com");
        dto.setTelefone("61999" + (timestamp % 100000));
        
        EnderecoDTO enderecoDTO = new EnderecoDTO();
        enderecoDTO.setRua("Rua de Teste");
        enderecoDTO.setNumero("100");
        enderecoDTO.setBairro("Bairro Teste");
        enderecoDTO.setCidade("Brasília");
        enderecoDTO.setEstado("DF");
        enderecoDTO.setCep("70000-000");
        enderecoDTO.setComplemento("Apto 101");
        
        dto.setEndereco(enderecoDTO);
        return dto;
    }

    /**
     * Cadastra uma pessoa física para uso em testes
     * @return Pessoa Física cadastrada
     */
    private PessoaFisica cadastrarPessoaFisica() {
        HttpEntity<PessoaFisicaDTO> request = new HttpEntity<>(createPessoaFisicaDTO(), headers);
        ResponseEntity<PessoaFisica> response = restTemplate.exchange(
                baseUrl, HttpMethod.POST, request, PessoaFisica.class);
        PessoaFisica pessoa = response.getBody();
        
        // Armazenar ID para limpeza após os testes
        if (pessoa != null) {
            testPessoaId = pessoa.getId();
        }
        
        return pessoa;
    }

    @Test
    @DisplayName("Deve cadastrar uma nova pessoa física com sucesso")
    void testCadastrarPessoaFisica() {
        // Arrange
        PessoaFisicaDTO pessoaFisicaDTO = createPessoaFisicaDTO();
        HttpEntity<PessoaFisicaDTO> request = new HttpEntity<>(pessoaFisicaDTO, headers);

        // Act
        ResponseEntity<PessoaFisica> response = restTemplate.exchange(
                baseUrl, HttpMethod.POST, request, PessoaFisica.class);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getId());
        assertEquals(pessoaFisicaDTO.getNome(), response.getBody().getNome());
        assertEquals(pessoaFisicaDTO.getCpf(), response.getBody().getCpf());
        assertEquals(pessoaFisicaDTO.getRg(), response.getBody().getRg());
        assertEquals(pessoaFisicaDTO.getEmail(), response.getBody().getEmail());
        assertEquals(pessoaFisicaDTO.getTelefone(), response.getBody().getTelefone());
        
        // Verificar endereço
        assertNotNull(response.getBody().getEndereco());
        assertEquals(pessoaFisicaDTO.getEndereco().getRua(), response.getBody().getEndereco().getRua());
        assertEquals(pessoaFisicaDTO.getEndereco().getNumero(), response.getBody().getEndereco().getNumero());
        
        // Salvar ID para limpeza
        testPessoaId = response.getBody().getId();
    }

    @Test
    @DisplayName("Deve retornar erro ao cadastrar pessoa com CPF duplicado")
    void testCadastrarPessoaFisicaCpfDuplicado() {
        // Arrange
        PessoaFisica pessoaSalva = cadastrarPessoaFisica();
        
        // Tenta cadastrar outra pessoa com mesmo CPF
        PessoaFisicaDTO duplicadaDTO = createPessoaFisicaDTO();
        duplicadaDTO.setCpf(pessoaSalva.getCpf()); // Mesmo CPF
        
        HttpEntity<PessoaFisicaDTO> request = new HttpEntity<>(duplicadaDTO, headers);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl, HttpMethod.POST, request, String.class);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("CPF já cadastrado"));
    }

    @Test
    @DisplayName("Deve listar pessoas físicas cadastradas")
    void testListarTodasPessoasFisicas() {
        // Arrange - Cadastrar pessoa para garantir que existe pelo menos uma
        cadastrarPessoaFisica();

        // Act
        ResponseEntity<List<PessoaFisica>> response = restTemplate.exchange(
                baseUrl, 
                HttpMethod.GET, 
                null, 
                new ParameterizedTypeReference<List<PessoaFisica>>() {});

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().size() > 0, "Deve haver pelo menos uma pessoa cadastrada");
        
        // Verificar se a pessoa recém criada está na lista
        boolean encontrado = response.getBody().stream()
            .anyMatch(p -> p.getId().equals(testPessoaId));
        assertTrue(encontrado, "A pessoa criada deve estar na lista de resultados");
    }

    @Test
    @DisplayName("Deve buscar pessoa física por ID")
    void testBuscarPorId() {
        // Arrange
        PessoaFisica pessoaSalva = cadastrarPessoaFisica();

        // Act
        ResponseEntity<PessoaFisica> response = restTemplate.getForEntity(
                baseUrl + "/" + pessoaSalva.getId(), PessoaFisica.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(pessoaSalva.getId(), response.getBody().getId());
        assertEquals(pessoaSalva.getNome(), response.getBody().getNome());
        assertEquals(pessoaSalva.getCpf(), response.getBody().getCpf());
    }

    @Test
    @DisplayName("Deve retornar 404 ao buscar ID inexistente")
    void testBuscarPorIdInexistente() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                baseUrl + "/999999999", String.class);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    @DisplayName("Deve buscar pessoa física por CPF")
    void testBuscarPorCpf() {
        // Arrange
        PessoaFisica pessoaSalva = cadastrarPessoaFisica();

        // Act
        ResponseEntity<PessoaFisica> response = restTemplate.getForEntity(
                baseUrl + "/cpf/" + pessoaSalva.getCpf(), PessoaFisica.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(pessoaSalva.getId(), response.getBody().getId());
        assertEquals(pessoaSalva.getNome(), response.getBody().getNome());
        assertEquals(pessoaSalva.getCpf(), response.getBody().getCpf());
    }

    @Test
    @DisplayName("Deve retornar 404 ao buscar CPF inexistente")
    void testBuscarPorCpfInexistente() {
        // Gerar um CPF que não deve existir
        String cpfInexistente = "99988877766";
        
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
                baseUrl + "/cpf/" + cpfInexistente, String.class);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    @DisplayName("Deve atualizar uma pessoa física")
    void testAtualizarPessoaFisica() {
        // Arrange
        PessoaFisica pessoaSalva = cadastrarPessoaFisica();
        
        PessoaFisicaDTO atualizacaoDTO = createPessoaFisicaDTO();
        atualizacaoDTO.setCpf(pessoaSalva.getCpf()); // Manter CPF original
        atualizacaoDTO.setNome("Nome Atualizado");
        atualizacaoDTO.setEmail("atualizado@example.com");
        
        HttpEntity<PessoaFisicaDTO> request = new HttpEntity<>(atualizacaoDTO, headers);

        // Act
        ResponseEntity<PessoaFisica> response = restTemplate.exchange(
                baseUrl + "/" + pessoaSalva.getId(), 
                HttpMethod.PUT, 
                request, 
                PessoaFisica.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(pessoaSalva.getId(), response.getBody().getId());
        assertEquals(atualizacaoDTO.getNome(), response.getBody().getNome());
        assertEquals(atualizacaoDTO.getEmail(), response.getBody().getEmail());
        assertEquals(pessoaSalva.getCpf(), response.getBody().getCpf());
    }

    @Test
    @DisplayName("Deve retornar 404 ao atualizar pessoa inexistente")
    void testAtualizarPessoaFisicaInexistente() {
        // Arrange
        PessoaFisicaDTO atualizacaoDTO = createPessoaFisicaDTO();
        HttpEntity<PessoaFisicaDTO> request = new HttpEntity<>(atualizacaoDTO, headers);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + "/999999999", 
                HttpMethod.PUT, 
                request, 
                String.class);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    @DisplayName("Deve excluir uma pessoa física")
    void testExcluirPessoaFisica() {
        // Arrange
        PessoaFisica pessoaSalva = cadastrarPessoaFisica();

        // Act
        ResponseEntity<Void> deleteResponse = restTemplate.exchange(
                baseUrl + "/" + pessoaSalva.getId(), 
                HttpMethod.DELETE, 
                null, 
                Void.class);

        // Verificar se foi excluído
        ResponseEntity<String> getResponse = restTemplate.getForEntity(
                baseUrl + "/" + pessoaSalva.getId(), 
                String.class);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, deleteResponse.getStatusCode());
        assertEquals(HttpStatus.NOT_FOUND, getResponse.getStatusCode());
        
        // Limpar o ID pois já foi excluído no teste
        testPessoaId = null;
    }

    @Test
    @DisplayName("Deve retornar 404 ao excluir pessoa inexistente")
    void testExcluirPessoaFisicaInexistente() {
        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + "/999999999", 
                HttpMethod.DELETE, 
                null, 
                String.class);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
