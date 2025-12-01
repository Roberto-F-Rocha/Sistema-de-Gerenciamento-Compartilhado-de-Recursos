import React, { useState, useEffect } from "react";
import type { Predio, Bloco, Sala } from "../../services/espaco";
import api from "../../services/api";

type Props = {
  open: boolean;
  onClose: () => void;
  localizacao: {
    predio?: Predio;
    bloco?: Bloco;
    sala?: Sala;
    tipo?: string;
  } | null;
  onUpdated?: (updated: any) => void;
};

const LocalizacaoEditModal: React.FC<Props> = ({ open, onClose, localizacao, onUpdated }) => {
  const [predios, setPredios] = useState<Predio[]>([]);
  const [predioSelecionado, setPredioSelecionado] = useState<number | "">("");
  const [blocoSelecionado, setBlocoSelecionado] = useState<number | "">("");
  const [salaSelecionada, setSalaSelecionada] = useState<number | "">("");
  const [tipo, setTipo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    async function fetchPredios() {
      try {
        const response = await api.get("/api/predios/");
        setPredios(response.data);
      } catch (err) {
        console.error("Erro ao carregar prédios:", err);
      }
    }
    fetchPredios();
  }, [open]);

  useEffect(() => {
    if (open && localizacao) {
      setPredioSelecionado(localizacao.predio?.id ?? "");
      setBlocoSelecionado(localizacao.bloco?.id ?? "");
      setSalaSelecionada(localizacao.sala?.id ?? "");
      setTipo(localizacao.tipo ?? "");
    }
  }, [open, localizacao]);

  if (!open) return null;

  const blocosDisponiveis = predios.find(p => p.id === predioSelecionado)?.blocos || [];
  const salasDisponiveis = blocosDisponiveis.find(b => b.id === blocoSelecionado)?.salas || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const updated = {
      predio_id: predioSelecionado || null,
      bloco_id: blocoSelecionado || null,
      sala_id: salaSelecionada || null,
      tipo: tipo || null,
    };

    onUpdated?.(updated);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative">
        <h2 className="text-2xl font-bold mb-4">Editar Localização</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Prédio *</label>
            <select
              required
              value={predioSelecionado}
              onChange={(e) => { setPredioSelecionado(Number(e.target.value)); setBlocoSelecionado(""); setSalaSelecionada(""); }}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Selecione...</option>
              {predios.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>

          <div>
            <label>Bloco *</label>
            <select
              required
              value={blocoSelecionado}
              onChange={(e) => { setBlocoSelecionado(Number(e.target.value)); setSalaSelecionada(""); }}
              disabled={!predioSelecionado}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Selecione...</option>
              {blocosDisponiveis.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
            </select>
          </div>

          <div>
            <label>Sala *</label>
            <select
              required
              value={salaSelecionada}
              onChange={(e) => setSalaSelecionada(Number(e.target.value))}
              disabled={!blocoSelecionado}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Selecione...</option>
              {salasDisponiveis.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
          </div>

          <div>
            <label>Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Selecione...</option>
              <option value="Sala de Aula">Sala de Aula</option>
              <option value="Laboratório">Laboratório</option>
              <option value="Auditório">Auditório</option>
              <option value="Sala Professor / Projeto">Sala Professor / Projeto</option>
              <option value="Ginásio">Ginásio</option>
              <option value="Sala Administrativa">Administrativa</option>
              <option value="Área Externa">Área Externa</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">Cancelar</button>
            <button type="submit" disabled={loading} className={`px-4 py-2 rounded-lg text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>{loading ? "Salvando..." : "Salvar Alterações"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocalizacaoEditModal;
