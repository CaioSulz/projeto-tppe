package com.unb.projeto_tppe.repository;

import com.unb.projeto_tppe.model.Passeio;
import org.springframework.stereotype.Repository;

@Repository
public interface PasseioRepository extends VeiculoRepository<Passeio> {
    // Métodos específicos para Passeio, se necessário
}
