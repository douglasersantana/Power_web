package br.com.poker.player;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findAllByOwnerUsernameOrderByNicknameAsc(String username);
    Optional<Player> findByIdAndOwnerUsername(Long id, String username);
}
