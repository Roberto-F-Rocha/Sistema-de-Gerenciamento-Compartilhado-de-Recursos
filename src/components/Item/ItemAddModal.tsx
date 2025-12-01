import React, { useState, useEffect } from "react";
import api from "../../services/api"; // seu axios configurado
import { useAuth } from "../Auth/AuthContext";

export interface Sala {
  id: number;
  nome: string;
  bloco: { id: number; nome: string; predio: { id: number; nome: string } };
}

export interface ItemFormValues {
  nome: string;
  descricao: string;
  numero_tombo: string;
  sala_id: number;
  status: string;
  data_aquisicao?: string;
  responsavel?: number;
}

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (dados: ItemFormValues) => void;
};

const ItemAddModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [numeroTombo, setNumeroTombo] = useState("");
  const [salas, setSalas] = useState<Sala[]>([]);
  const [salaSelecionada, setSalaSelecionada] = useState<number | "">("");
  const [status, setStatus] = useState("");
  const [dataAquisicao, setDataAquisicao] = useState("");

  useEffect(() => {
    async function fetchSalas() {
      try {
        const response = await api.get("/api/salas/");
        setSalas(response.data);
      } catch (err) {
        console.error("Erro ao carregar salas:", err);
      }
    }
    fetchSalas();
  }, []);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!salaSelecionada) return;

    const dadosItem: ItemFormValues = {
      nome,
      descricao,
      numero_tombo: numeroTombo,
      sala_id: Number(salaSelecionada),
      status,
      data_aquisicao: dataAquisicao || undefined,
      responsavel: user?.id,
    };

    onSubmit?.(dadosItem);
    onClose();

    // Resetar campos
    setNome("");
    setDescricao("");
    setNumeroTombo("");
    setSalaSelecionada("");
    setStatus("");
    setDataAquisicao("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative">

        <h2 className="text-2xl font-bold text-[#2E3A59] mb-4">
          Adicionar Item Patrimonial
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nome */}
          <div>
            <label className="block font-medium text-sm mb-1">Nome *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Projetor Epson"
              required
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block font-medium text-sm mb-1">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição do item (opcional)"
              rows={3}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Número do Tombo */}
          <div>
            <label className="block font-medium text-sm mb-1">Número do Tombo *</label>
            <input
              type="text"
              value={numeroTombo}
              onChange={(e) => setNumeroTombo(e.target.value)}
              placeholder="Ex: NT006"
              required
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Sala */}
          <div>
            <label className="block font-medium text-sm mb-1">Sala *</label>
            <select
              value={salaSelecionada}
              onChange={(e) => setSalaSelecionada(Number(e.target.value))}
              required
              className="w-full border rounded-lg p-2"
            >
              <option value="">Selecione a sala...</option>
              {salas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} - {s.bloco.nome} - {s.bloco.predio.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium text-sm mb-1">Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="w-full border rounded-lg p-2"
            >
              <option value="">Selecione...</option>
              <option value="ativo">Ativo</option>
              <option value="em_manutencao">Em Manutenção</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          {/* Data de Aquisição */}
          <div>
            <label className="block font-medium text-sm mb-1">Data de Aquisição</label>
            <input
              type="date"
              value={dataAquisicao}
              onChange={(e) => setDataAquisicao(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Salvar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ItemAddModal;
