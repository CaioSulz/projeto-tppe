package com.unb.projeto_tppe.repository;

import com.unb.projeto_tppe.model.Motocicleta;
import org.springframework.stereotype.Repository;

@Repository
public interface MotocicletaRepository extends VeiculoRepository<Motocicleta> {
    // Métodos específicos para Motocicleta, se necessário
}
