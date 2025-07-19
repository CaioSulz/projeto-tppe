package com.unb.projeto_tppe.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unb.projeto_tppe.dto.EnderecoDTO;
import com.unb.projeto_tppe.dto.PessoaJuridicaDTO;
import com.unb.projeto_tppe.model.PessoaJuridica;
import com.unb.projeto_tppe.repository.PessoaJuridicaRepository;
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

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Testes de integração para o endpoint de Pessoa Jurídica.
 * Estes testes verificam o comportamento real da API usando o banco de dados principal.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PessoaJuridicaControllerTest {

    @LocalServerPort
    private int port;

    private String baseUrl;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private PessoaJuridicaRepository pessoaJuridicaRepository;

    private HttpHeaders headers;
    
    // Armazenar IDs criados para limpeza após testes
    private Long testPessoaJuridicaId;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/api/pessoas-juridicas";
        headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
    }

    @AfterEach
    void tearDown() {
        // Limpar pessoas criadas durante os testes para não deixar lixo no banco
        if (testPessoaJuridicaId != null) {
            Optional<PessoaJuridica> pessoaOpt = pessoaJuridicaRepository.findById(testPessoaJuridicaId);
            if (pessoaOpt.isPresent()) {
                pessoaJuridicaRepository.deleteById(testPessoaJuridicaId);
            }
        }
    }

    /**
     * Cria um DTO de Pessoa Jurídica para testes com CNPJ único
     * @return DTO de Pessoa Jurídica
     */
    private PessoaJuridicaDTO createPessoaJuridicaDTO() {
        // Gerando CNPJ único para testes usando timestamp atual
        String uniqueCnpj = "999" + System.currentTimeMillis() % 100000000000L;
        uniqueCnpj = uniqueCnpj.substring(0, 14); // Garantir 14 dígitos
        
        PessoaJuridicaDTO dto = new PessoaJuridicaDTO();
        dto.setRazaoSocial("Empresa Teste " + uniqueCnpj);
        dto.setNomeFantasia("Nome Fantasia Teste");
        dto.setCnpj(uniqueCnpj);
        dto.setEmail("empresa" + uniqueCnpj.substring(0, 5) + "@example.com");
        dto.setTelefone("61" + uniqueCnpj.substring(0, 8));
        
        EnderecoDTO enderecoDTO = new EnderecoDTO();
        enderecoDTO.setRua("Rua de Teste");
        enderecoDTO.setNumero("100");
        enderecoDTO.setBairro("Bairro Teste");
        enderecoDTO.setCidade("Brasília");
        enderecoDTO.setEstado("DF");
        enderecoDTO.setCep("70000-000");
        enderecoDTO.setComplemento("Sala 101");
        
        dto.setEndereco(enderecoDTO);
        return dto;
    }

    /**
     * Cadastra uma pessoa jurídica para uso em testes
     * @return Pessoa Jurídica cadastrada
     */
    private PessoaJuridica cadastrarPessoaJuridica() {
        HttpEntity<PessoaJuridicaDTO> request = new HttpEntity<>(createPessoaJuridicaDTO(), headers);
        ResponseEntity<PessoaJuridica> response = restTemplate.exchange(
                baseUrl, HttpMethod.POST, request, PessoaJuridica.class);
        PessoaJuridica pessoa = response.getBody();
        
        // Armazenar ID para limpeza após os testes
        if (pessoa != null) {
            testPessoaJuridicaId = pessoa.getId();
        }
        
        return pessoa;
    }

    @Test
    @DisplayName("Deve cadastrar uma nova pessoa jurídica com sucesso")
    void testCadastrarPessoaJuridica() {
        // Arrange
        PessoaJuridicaDTO pessoaJuridicaDTO = createPessoaJuridicaDTO();
        HttpEntity<PessoaJuridicaDTO> request = new HttpEntity<>(pessoaJuridicaDTO, headers);

        // Act
        ResponseEntity<PessoaJuridica> response = restTemplate.exchange(
                baseUrl, HttpMethod.POST, request, PessoaJuridica.class);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getId());
        assertEquals(pessoaJuridicaDTO.getRazaoSocial(), response.getBody().getRazaoSocial());
        assertEquals(pessoaJuridicaDTO.getNomeFantasia(), response.getBody().getNomeFantasia());
        assertEquals(pessoaJuridicaDTO.getCnpj(), response.getBody().getCnpj());
        assertEquals(pessoaJuridicaDTO.getEmail(), response.getBody().getEmail());
        
        // Verificar endereço
        assertNotNull(response.getBody().getEndereco());
        assertEquals(pessoaJuridicaDTO.getEndereco().getRua(), response.getBody().getEndereco().getRua());
        assertEquals(pessoaJuridicaDTO.getEndereco().getCidade(), response.getBody().getEndereco().getCidade());
        
        // Salvar ID para limpeza
        testPessoaJuridicaId = response.getBody().getId();
    }

    @Test
    @DisplayName("Deve retornar erro ao cadastrar pessoa jurídica com CNPJ duplicado")
    void testCadastrarPessoaJuridicaCnpjDuplicado() {
        // Arrange
        PessoaJuridica pessoaSalva = cadastrarPessoaJuridica();
        
        // Tenta cadastrar outra pessoa com mesmo CNPJ
        PessoaJuridicaDTO duplicadaDTO = createPessoaJuridicaDTO();
        duplicadaDTO.setCnpj(pessoaSalva.getCnpj()); // Mesmo CNPJ
        
        HttpEntity<PessoaJuridicaDTO> request = new HttpEntity<>(duplicadaDTO, headers);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl, HttpMethod.POST, request, String.class);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("CNPJ já cadastrado"));
    }

    @Test
    @DisplayName("Deve buscar pessoa jurídica por ID")
    void testBuscarPorId() {
        // Arrange
        PessoaJuridica pessoaSalva = cadastrarPessoaJuridica();

        // Act
        ResponseEntity<PessoaJuridica> response = restTemplate.getForEntity(
                baseUrl + "/" + pessoaSalva.getId(), PessoaJuridica.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(pessoaSalva.getId(), response.getBody().getId());
        assertEquals(pessoaSalva.getRazaoSocial(), response.getBody().getRazaoSocial());
        assertEquals(pessoaSalva.getCnpj(), response.getBody().getCnpj());
    }

    @Test
    @DisplayName("Deve buscar pessoa jurídica por CNPJ")
    void testBuscarPorCnpj() {
        // Arrange
        PessoaJuridica pessoaSalva = cadastrarPessoaJuridica();

        // Act
        ResponseEntity<PessoaJuridica> response = restTemplate.getForEntity(
                baseUrl + "/cnpj/" + pessoaSalva.getCnpj(), PessoaJuridica.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(pessoaSalva.getId(), response.getBody().getId());
        assertEquals(pessoaSalva.getRazaoSocial(), response.getBody().getRazaoSocial());
        assertEquals(pessoaSalva.getCnpj(), response.getBody().getCnpj());
    }

    @Test
    @DisplayName("Deve excluir uma pessoa jurídica")
    void testExcluirPessoaJuridica() {
        // Arrange
        PessoaJuridica pessoaSalva = cadastrarPessoaJuridica();

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
        testPessoaJuridicaId = null;
    }
}
