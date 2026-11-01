export interface Player {
  id: number;
  name: string;
  nickname: string;
  chips: number;
  notes: string | null;
  updatedAt: string;
}

export interface PlayerRequest {
  name: string;
  nickname: string;
  chips: number;
  notes: string;
}
