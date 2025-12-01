import React, { useState, useEffect } from "react";
import { getPredios } from "../../services/espaco";
import type { Predio, Bloco, Sala } from "../../services/espaco";
type Props = {
  open: boolean;
  onClose: () => void;
  onSelected?: (predioId: number, blocoId: number, salaId: number) => void;
};

const LocalizacaoSelectModal: React.FC<Props> = ({ open, onClose, onSelected }) => {
  const [predios, setPredios] = useState<Predio[]>([]);
  const [predioSelecionado, setPredioSelecionado] = useState<number | "">("");
  const [blocoSelecionado, setBlocoSelecionado] = useState<number | "">("");
  const [salaSelecionada, setSalaSelecionada] = useState<number | "">("");

  useEffect(() => {
    if (open) {
      getPredios().then(setPredios).catch(console.error);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (predioSelecionado && blocoSelecionado && salaSelecionada) {
      onSelected?.(
        Number(predioSelecionado),
        Number(blocoSelecionado),
        Number(salaSelecionada)
      );
      setPredioSelecionado("");
      setBlocoSelecionado("");
      setSalaSelecionada("");
      onClose();
    }
  };

  const blocosDisponiveis: Bloco[] =
    predios.find((p) => p.id === predioSelecionado)?.blocos || [];

  const salasDisponiveis: Sala[] =
    blocosDisponiveis.find((b) => b.id === blocoSelecionado)?.salas || [];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative">
        <h2 className="text-2xl font-bold mb-4">Selecionar Localização</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Prédio */}
          <div>
            <label>Prédio *</label>
            <select
              required
              className="w-full border rounded-lg p-2"
              value={predioSelecionado}
              onChange={(e) => {
                setPredioSelecionado(Number(e.target.value));
                setBlocoSelecionado("");
                setSalaSelecionada("");
              }}
            >
              <option value="">Selecione...</option>
              {predios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Bloco */}
          <div>
            <label>Bloco *</label>
            <select
              required
              className="w-full border rounded-lg p-2"
              value={blocoSelecionado}
              onChange={(e) => {
                setBlocoSelecionado(Number(e.target.value));
                setSalaSelecionada("");
              }}
              disabled={!predioSelecionado}
            >
              <option value="">Selecione...</option>
              {blocosDisponiveis.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Sala */}
          <div>
            <label>Sala *</label>
            <select
              required
              className="w-full border rounded-lg p-2"
              value={salaSelecionada}
              onChange={(e) => setSalaSelecionada(Number(e.target.value))}
              disabled={!blocoSelecionado}
            >
              <option value="">Selecione...</option>
              {salasDisponiveis.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocalizacaoSelectModal;
