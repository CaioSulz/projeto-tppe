package com.unb.projeto_tppe.service;

import com.unb.projeto_tppe.model.PessoaFisica;
import com.unb.projeto_tppe.repository.PessoaFisicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PessoaFisicaService implements PessoaService<PessoaFisica> {

    private final PessoaFisicaRepository pessoaFisicaRepository;

    @Autowired
    public PessoaFisicaService(PessoaFisicaRepository pessoaFisicaRepository) {
        this.pessoaFisicaRepository = pessoaFisicaRepository;
    }

    @Override
    public PessoaFisica salvar(PessoaFisica pessoaFisica) {
        return pessoaFisicaRepository.save(pessoaFisica);
    }

    @Override
    public List<PessoaFisica> listarTodos() {
        return pessoaFisicaRepository.findAll();
    }

    @Override
    public Optional<PessoaFisica> buscarPorId(Long id) {
        return pessoaFisicaRepository.findById(id);
    }

    @Override
    public void excluir(Long id) {
        pessoaFisicaRepository.deleteById(id);
    }

    public Optional<PessoaFisica> buscarPorCpf(String cpf) {
        return pessoaFisicaRepository.findByCpf(cpf);
    }

    public boolean existePorCpf(String cpf) {
        return pessoaFisicaRepository.existsByCpf(cpf);
    }
}
