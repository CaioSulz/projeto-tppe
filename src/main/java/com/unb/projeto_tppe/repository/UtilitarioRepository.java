package com.unb.projeto_tppe.repository;

import com.unb.projeto_tppe.model.Utilitario;
import org.springframework.stereotype.Repository;

@Repository
public interface UtilitarioRepository extends VeiculoRepository<Utilitario> {
    // Métodos específicos para Utilitario, se necessário
}
