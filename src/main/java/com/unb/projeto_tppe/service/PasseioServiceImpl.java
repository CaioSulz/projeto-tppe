package com.unb.projeto_tppe.service;

import com.unb.projeto_tppe.model.Passeio;
import com.unb.projeto_tppe.repository.PasseioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PasseioServiceImpl implements VeiculoService<Passeio> {

    private final PasseioRepository passeioRepository;

    @Autowired
    public PasseioServiceImpl(PasseioRepository passeioRepository) {
        this.passeioRepository = passeioRepository;
    }

    @Override
    @Transactional
    public Passeio salvar(Passeio passeio) {
        return passeioRepository.save(passeio);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Passeio> buscarTodos() {
        return passeioRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Passeio> buscarPorId(Long id) {
        return passeioRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Passeio> buscarPorPlaca(String placa) {
        return passeioRepository.findByPlaca(placa);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existePorPlaca(String placa) {
        return passeioRepository.existsByPlaca(placa);
    }

    @Override
    @Transactional
    public void excluir(Long id) {
        passeioRepository.deleteById(id);
    }
}
