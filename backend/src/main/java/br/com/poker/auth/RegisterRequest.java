package br.com.poker.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Informe o usuário")
        @Size(min = 3, max = 50, message = "O usuário deve ter entre 3 e 50 caracteres")
        @Pattern(regexp = "^[A-Za-z0-9._-]*$", message = "Use apenas letras, números, ponto, hífen ou sublinhado")
        String username,
        @NotBlank(message = "Informe a senha")
        @Size(min = 8, max = 72, message = "A senha deve ter entre 8 e 72 caracteres")
        String password) {
}
