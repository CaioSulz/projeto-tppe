package com.unb.projeto_tppe.repository;

import com.unb.projeto_tppe.model.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.Optional;

@NoRepositoryBean
public interface VeiculoRepository<T extends Veiculo> extends JpaRepository<T, Long> {
    
    Optional<T> findByPlaca(String placa);
    
    boolean existsByPlaca(String placa);
}
