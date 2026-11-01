package br.com.poker.player;

import java.time.Instant;

public record PlayerResponse(Long id, String name, String nickname, long chips, String notes, Instant updatedAt) {
    public static PlayerResponse from(Player player) {
        return new PlayerResponse(player.getId(), player.getName(), player.getNickname(),
                player.getChips(), player.getNotes(), player.getUpdatedAt());
    }
}
