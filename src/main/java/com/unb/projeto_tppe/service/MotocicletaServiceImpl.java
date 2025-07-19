package com.unb.projeto_tppe.service;

import com.unb.projeto_tppe.model.Motocicleta;
import com.unb.projeto_tppe.repository.MotocicletaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MotocicletaServiceImpl implements VeiculoService<Motocicleta> {

    private final MotocicletaRepository motocicletaRepository;

    @Autowired
    public MotocicletaServiceImpl(MotocicletaRepository motocicletaRepository) {
        this.motocicletaRepository = motocicletaRepository;
    }

    @Override
    @Transactional
    public Motocicleta salvar(Motocicleta motocicleta) {
        return motocicletaRepository.save(motocicleta);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Motocicleta> buscarTodos() {
        return motocicletaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Motocicleta> buscarPorId(Long id) {
        return motocicletaRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Motocicleta> buscarPorPlaca(String placa) {
        return motocicletaRepository.findByPlaca(placa);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existePorPlaca(String placa) {
        return motocicletaRepository.existsByPlaca(placa);
    }

    @Override
    @Transactional
    public void excluir(Long id) {
        motocicletaRepository.deleteById(id);
    }
}
