// src/services/espaco.ts
import api from "./api";

// Tipos
export interface Sala {
  id: number;
  nome: string;
  bloco?: { id: number; nome: string };
  predio?: { id: number; nome: string };
}

export interface Bloco {
  id: number;
  nome: string;
  salas?: Sala[];
}

export interface Predio {
  id: number;
  nome: string;
  blocos?: Bloco[];
}

// Buscar todos os prédios com blocos e salas
export async function getPredios(): Promise<Predio[]> {
  const response = await api.get("/localizacoes/predios/");
  const predios: Predio[] = response.data;

  predios.sort((a, b) => a.nome.localeCompare(b.nome));
  predios.forEach(predio => {
    if (predio.blocos) {
      predio.blocos.sort((a, b) => a.nome.localeCompare(b.nome));
      predio.blocos.forEach(bloco => {
        if (bloco.salas) {
          bloco.salas.sort((a, b) => a.nome.localeCompare(b.nome));
        }
      });
    }
  });

  return predios;
}

// Buscar todos os blocos (opcional)
export async function getBlocos(): Promise<Bloco[]> {
  const response = await api.get("/localizacoes/blocos/");
  const blocos: Bloco[] = response.data;
  blocos.sort((a, b) => a.nome.localeCompare(b.nome));
  return blocos;
}

// Buscar todas as salas (opcional)
export async function getSalas(): Promise<Sala[]> {
  const response = await api.get("/localizacoes/salas/");
  const salas: Sala[] = response.data;
  salas.sort((a, b) => a.nome.localeCompare(b.nome));
  return salas;
}
