import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player, PlayerRequest } from './player.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly apiUrl = 'http://localhost:8080/api/players';

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }

  get(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/${id}`);
  }

  create(player: PlayerRequest): Observable<Player> {
    return this.http.post<Player>(this.apiUrl, player);
  }

  update(id: number, player: PlayerRequest): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/${id}`, player);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
