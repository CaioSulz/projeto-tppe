package com.unb.projeto_tppe.service;

import com.unb.projeto_tppe.model.PessoaJuridica;
import com.unb.projeto_tppe.repository.PessoaJuridicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PessoaJuridicaService implements PessoaService<PessoaJuridica> {

    private final PessoaJuridicaRepository pessoaJuridicaRepository;

    @Autowired
    public PessoaJuridicaService(PessoaJuridicaRepository pessoaJuridicaRepository) {
        this.pessoaJuridicaRepository = pessoaJuridicaRepository;
    }

    @Override
    public PessoaJuridica salvar(PessoaJuridica pessoaJuridica) {
        return pessoaJuridicaRepository.save(pessoaJuridica);
    }

    @Override
    public List<PessoaJuridica> listarTodos() {
        return pessoaJuridicaRepository.findAll();
    }

    @Override
    public Optional<PessoaJuridica> buscarPorId(Long id) {
        return pessoaJuridicaRepository.findById(id);
    }

    @Override
    public void excluir(Long id) {
        pessoaJuridicaRepository.deleteById(id);
    }

    public Optional<PessoaJuridica> buscarPorCnpj(String cnpj) {
        return pessoaJuridicaRepository.findByCnpj(cnpj);
    }

    public boolean existePorCnpj(String cnpj) {
        return pessoaJuridicaRepository.existsByCnpj(cnpj);
    }
}
