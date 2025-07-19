package com.unb.projeto_tppe.service;

import com.unb.projeto_tppe.model.Reserva;
import com.unb.projeto_tppe.model.Veiculo;
import com.unb.projeto_tppe.model.PessoaFisica;
import com.unb.projeto_tppe.model.PessoaJuridica;
import com.unb.projeto_tppe.repository.ReservaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservaServiceImpl implements ReservaService {

    private final ReservaRepository reservaRepository;

    @Autowired
    public ReservaServiceImpl(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    @Override
    @Transactional
    public Reserva salvar(Reserva reserva) {
        return reservaRepository.save(reserva);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reserva> buscarTodas() {
        return reservaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Reserva> buscarPorId(Long id) {
        return reservaRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reserva> buscarPorVeiculo(Veiculo veiculo) {
        return reservaRepository.findByVeiculo(veiculo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reserva> buscarPorPessoaFisica(PessoaFisica pessoaFisica) {
        return reservaRepository.findByPessoaFisica(pessoaFisica);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reserva> buscarPorPessoaJuridica(PessoaJuridica pessoaJuridica) {
        return reservaRepository.findByPessoaJuridica(pessoaJuridica);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reserva> buscarPorStatus(Reserva.StatusReserva status) {
        return reservaRepository.findByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reserva> buscarPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return reservaRepository.findByPeriodo(inicio, fim);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existeConflito(LocalDateTime dataInicio, LocalDateTime dataFim, Long veiculoId) {
        List<Reserva> reservasConflitantes = reservaRepository.findReservasConflitantes(dataInicio, dataFim, veiculoId);
        return !reservasConflitantes.isEmpty();
    }

    @Override
    @Transactional
    public Reserva atualizarStatus(Long id, Reserva.StatusReserva status) {
        Optional<Reserva> reservaOpt = reservaRepository.findById(id);
        if (reservaOpt.isPresent()) {
            Reserva reserva = reservaOpt.get();
            reserva.setStatus(status);
            return reservaRepository.save(reserva);
        }
        throw new IllegalArgumentException("Reserva não encontrada com o ID: " + id);
    }

    @Override
    @Transactional
    public void excluir(Long id) {
        reservaRepository.deleteById(id);
    }
}
