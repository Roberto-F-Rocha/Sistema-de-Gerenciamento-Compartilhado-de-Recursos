import React, { useState, useEffect } from "react";
import type { ItemFormValues } from "./ItemAddModal";
import type { Sala } from "../../services/espaco";
import api from "../../services/api";

interface EditItensModalProps {
  open: boolean;
  onClose: () => void;
  initialValues: ItemFormValues;
  onSubmit: (dados: ItemFormValues) => void;
}

export default function EditItensModal({
  open,
  onClose,
  initialValues,
  onSubmit,
}: EditItensModalProps) {
  const [nome, setNome] = useState(initialValues.nome);
  const [descricao, setDescricao] = useState(initialValues.descricao);
  const [numeroTombo, setNumeroTombo] = useState(initialValues.numero_tombo);
  const [localizacao, setLocalizacao] = useState<number | undefined>(initialValues.sala_id);
  const [status, setStatus] = useState(initialValues.status);
  const [dataAquisicao, setDataAquisicao] = useState(initialValues.data_aquisicao || "");
  const [salas, setSalas] = useState<Sala[]>([]);

  // Busca as salas
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

  // Atualiza campos quando initialValues mudar
  useEffect(() => {
    setNome(initialValues.nome);
    setDescricao(initialValues.descricao);
    setNumeroTombo(initialValues.numero_tombo);
    setLocalizacao(initialValues.sala_id);
    setStatus(initialValues.status);
    setDataAquisicao(initialValues.data_aquisicao || "");
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dadosItem: ItemFormValues = {
      nome,
      descricao,
      numero_tombo: numeroTombo,
      sala_id: localizacao!, // ID da sala
      status,
      data_aquisicao: dataAquisicao || undefined,
    };

    onSubmit(dadosItem);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[450px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Editar Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium">Nome*</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium">Descrição*</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>

          {/* Número do Tombo */}
          <div>
            <label className="block text-sm font-medium">Número do Tombo*</label>
            <input
              type="text"
              value={numeroTombo}
              onChange={(e) => setNumeroTombo(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Localização */}
          <div>
            <label className="block text-sm font-medium">Localização*</label>
            <select
              value={localizacao ?? ""}
              onChange={(e) => setLocalizacao(Number(e.target.value))}
              required
            >
              <option value="">Selecione...</option>
              {salas.map((sala) => (
                <option key={sala.id} value={sala.id}>
                  {sala.nome} — {sala.bloco?.nome ?? "-"} / {sala.predio?.nome ?? "-"}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium">Status*</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Selecione...</option>
              <option value="ativo">Ativo</option>
              <option value="em_manutencao">Em Manutenção</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          {/* Data de Aquisição */}
          <div>
            <label className="block text-sm font-medium">Data de Aquisição</label>
            <input
              type="date"
              value={dataAquisicao}
              onChange={(e) => setDataAquisicao(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 border rounded cursor-pointer"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
