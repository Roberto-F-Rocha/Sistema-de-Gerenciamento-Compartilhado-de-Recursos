// src/services/bloco.ts
import api from "./api";

export interface Bloco {
  id: number;
  nome: string;
  predio: number;
  predio_nome: string;
}

// GET /api/localizacoes/blocos/
export async function getBlocos(): Promise<Bloco[]> {
  const response = await api.get("localizacoes/blocos/");
  return response.data;
}
