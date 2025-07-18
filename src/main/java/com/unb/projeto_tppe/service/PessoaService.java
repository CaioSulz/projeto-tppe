package com.unb.projeto_tppe.service;

import java.util.List;
import java.util.Optional;

public interface PessoaService<T> {
    
    T salvar(T entidade);
    
    List<T> listarTodos();
    
    Optional<T> buscarPorId(Long id);
    
    void excluir(Long id);
}
