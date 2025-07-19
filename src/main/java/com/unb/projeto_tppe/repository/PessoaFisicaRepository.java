package com.unb.projeto_tppe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.unb.projeto_tppe.model.PessoaFisica;

import java.util.Optional;

@Repository
public interface PessoaFisicaRepository extends JpaRepository<PessoaFisica, Long> {
    
    Optional<PessoaFisica> findByCpf(String cpf);
    
    boolean existsByCpf(String cpf);
}
