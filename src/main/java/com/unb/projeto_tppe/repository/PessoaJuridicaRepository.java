package com.unb.projeto_tppe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.unb.projeto_tppe.model.PessoaJuridica;

import java.util.Optional;

@Repository
public interface PessoaJuridicaRepository extends JpaRepository<PessoaJuridica, Long> {
    
    Optional<PessoaJuridica> findByCnpj(String cnpj);
    
    boolean existsByCnpj(String cnpj);
}
