package com.unb.projeto_tppe.service;

import com.unb.projeto_tppe.model.Utilitario;
import com.unb.projeto_tppe.repository.UtilitarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UtilitarioServiceImpl implements VeiculoService<Utilitario> {

    private final UtilitarioRepository utilitarioRepository;

    @Autowired
    public UtilitarioServiceImpl(UtilitarioRepository utilitarioRepository) {
        this.utilitarioRepository = utilitarioRepository;
    }

    @Override
    @Transactional
    public Utilitario salvar(Utilitario utilitario) {
        return utilitarioRepository.save(utilitario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Utilitario> buscarTodos() {
        return utilitarioRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Utilitario> buscarPorId(Long id) {
        return utilitarioRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Utilitario> buscarPorPlaca(String placa) {
        return utilitarioRepository.findByPlaca(placa);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existePorPlaca(String placa) {
        return utilitarioRepository.existsByPlaca(placa);
    }

    @Override
    @Transactional
    public void excluir(Long id) {
        utilitarioRepository.deleteById(id);
    }
}
