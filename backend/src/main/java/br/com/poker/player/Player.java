package br.com.poker.player;

import br.com.poker.user.PokerUser;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 40)
    private String nickname;

    @Column(nullable = false)
    private long chips;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private PokerUser owner;

    protected Player() {
    }

    public Player(String name, String nickname, long chips, String notes, PokerUser owner) {
        this.name = name;
        this.nickname = nickname;
        this.chips = chips;
        this.notes = notes;
        this.owner = owner;
        this.updatedAt = Instant.now();
    }

    public void update(String name, String nickname, long chips, String notes) {
        this.name = name;
        this.nickname = nickname;
        this.chips = chips;
        this.notes = notes;
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getNickname() {
        return nickname;
    }

    public long getChips() {
        return chips;
    }

    public String getNotes() {
        return notes;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
