package br.com.poker.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<PokerUser, Long> {
    Optional<PokerUser> findByUsername(String username);
    boolean existsByUsername(String username);
}
