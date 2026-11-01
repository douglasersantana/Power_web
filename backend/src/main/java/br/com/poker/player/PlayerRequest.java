package br.com.poker.player;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record PlayerRequest(
        @NotBlank(message = "Informe o nome do jogador")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        String name,
        @NotBlank(message = "Informe o apelido do jogador")
        @Size(max = 40, message = "O apelido deve ter no máximo 40 caracteres")
        String nickname,
        @NotNull(message = "Informe a quantidade de fichas")
        @PositiveOrZero(message = "A quantidade de fichas não pode ser negativa")
        Long chips,
        @Size(max = 500, message = "As observações devem ter no máximo 500 caracteres")
        String notes) {
}
