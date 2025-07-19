package com.unb.projeto_tppe.service;

import com.unb.projeto_tppe.model.Veiculo;
import com.unb.projeto_tppe.repository.VeiculoBaseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class GenericVeiculoServiceImpl implements VeiculoService<Veiculo> {

    private final VeiculoBaseRepository veiculoRepository;

    @Autowired
    public GenericVeiculoServiceImpl(VeiculoBaseRepository veiculoRepository) {
        this.veiculoRepository = veiculoRepository;
    }

    @Override
    @Transactional
    public Veiculo salvar(Veiculo veiculo) {
        return veiculoRepository.save(veiculo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Veiculo> buscarTodos() {
        return veiculoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Veiculo> buscarPorId(Long id) {
        return veiculoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Veiculo> buscarPorPlaca(String placa) {
        return veiculoRepository.findByPlaca(placa);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existePorPlaca(String placa) {
        return veiculoRepository.existsByPlaca(placa);
    }

    @Override
    @Transactional
    public void excluir(Long id) {
        veiculoRepository.deleteById(id);
    }
}
