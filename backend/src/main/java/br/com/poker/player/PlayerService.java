package br.com.poker.player;

import br.com.poker.common.ResourceNotFoundException;
import br.com.poker.user.PokerUser;
import br.com.poker.user.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlayerService {
    private final PlayerRepository playerRepository;
    private final UserRepository userRepository;

    public PlayerService(PlayerRepository playerRepository, UserRepository userRepository) {
        this.playerRepository = playerRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<PlayerResponse> findAll(String username) {
        return playerRepository.findAllByOwnerUsernameOrderByNicknameAsc(username)
                .stream().map(PlayerResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public PlayerResponse findById(Long id, String username) {
        return PlayerResponse.from(findOwnedPlayer(id, username));
    }

    @Transactional
    public PlayerResponse create(PlayerRequest request, String username) {
        PokerUser owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        Player player = new Player(request.name().trim(), request.nickname().trim(),
                request.chips(), normalizeNotes(request.notes()), owner);
        return PlayerResponse.from(playerRepository.save(player));
    }

    @Transactional
    public PlayerResponse update(Long id, PlayerRequest request, String username) {
        Player player = findOwnedPlayer(id, username);
        player.update(request.name().trim(), request.nickname().trim(),
                request.chips(), normalizeNotes(request.notes()));
        return PlayerResponse.from(player);
    }

    @Transactional
    public void delete(Long id, String username) {
        playerRepository.delete(findOwnedPlayer(id, username));
    }

    private Player findOwnedPlayer(Long id, String username) {
        return playerRepository.findByIdAndOwnerUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Jogador não encontrado"));
    }

    private String normalizeNotes(String notes) {
        return notes == null || notes.isBlank() ? null : notes.trim();
    }
}
