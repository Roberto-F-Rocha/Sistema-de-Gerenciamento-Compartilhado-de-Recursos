import api from "./api";

export interface Item {
  id: string;
  nome: string;
  descricao: string;
  numero_tombo: string;
  localizacao: string;
  status: string;
  data_aquisicao: string;
  responsavel?: number;
}

export interface CreateItemPayload {
  nome: string;
  descricao: string;
  numero_tombo: string;
  localizacao: string;
  status: string;
  data_aquisicao?: string;
  responsavel?: number;
}

// GET - Lista de itens
export async function getItens() {
  try {
    const response = await api.get("patrimonios/");
    return response.data.results; // <<< AQUI
  } catch (error) {
    console.error("Erro ao buscar patrimonios:", error);
    throw error;
  }
}

// POST - Criar item
export async function createItem(dados: CreateItemPayload) {
  try {
    const payload = {
      nome: dados.nome,
      descricao: dados.descricao,
      numero_tombo: dados.numero_tombo,
      localizacao: dados.localizacao,
      status: dados.status,
      ...(dados.data_aquisicao ? { data_aquisicao: dados.data_aquisicao } : {}),
      ...(dados.responsavel ? { responsavel: dados.responsavel } : {}),
    };

    const response = await api.post("patrimonios/", payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar patrimonios:", error);
    throw error;
  }
}

// PUT - Atualizar item 
export async function updateItem(
  id: string,
  dados: Omit<CreateItemPayload, "responsavel"> // podemos reutilizar o payload de criação
) {
  try {
    const payload = {
      nome: dados.nome,
      descricao: dados.descricao,
      numero_tombo: dados.numero_tombo,
      localizacao: dados.localizacao,
      status: dados.status,
      ...(dados.data_aquisicao ? { data_aquisicao: dados.data_aquisicao } : {}),
    };

    const response = await api.put(`patrimonios/${id}/`, payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar patrimonios:", error);
    throw error;
  }
}

// DELETE - Excluir item
export async function deleteItem(id: string) {
  try {
    const response = await api.delete(`patrimonios/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir item:", error);
    throw error;
  }
}
