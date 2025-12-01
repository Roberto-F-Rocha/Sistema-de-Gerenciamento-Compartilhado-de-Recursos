import React, { useState, useEffect } from "react";
import { getPredios } from "../../services/espaco";
import type { Predio, Bloco } from "../../services/espaco";
import api from "../../services/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelected?: (predioId?: number, blocoId?: number, salaId?: number) => void;
};

const LocalizacaoSelectModal: React.FC<Props> = ({ open, onClose, onSelected }) => {
  const [predios, setPredios] = useState<Predio[]>([]);
  const [predioNome, setPredioNome] = useState("");
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [blocoNome, setBlocoNome] = useState("");
  const [salaNome, setSalaNome] = useState("");

  useEffect(() => {
    if (open) {
      getPredios().then(setPredios).catch(console.error);
    }
  }, [open]);

  useEffect(() => {
    const predioSelecionado = predios.find((p) => p.nome === predioNome);
    setBlocos(predioSelecionado?.blocos || []);
    setBlocoNome("");
  }, [predioNome, predios]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    let predioId: number | undefined;
    if (predioNome) {
      const resPredio = await api.post("localizacoes/predios/", { nome: predioNome });
      predioId = resPredio.data.id;
    }

    if (!predioId) throw new Error("Prédio não foi criado");

    let blocoId: number | undefined;
    if (blocoNome) {
      const resBloco = await api.post("localizacoes/blocos/", {
        nome: blocoNome,
        predio: predioId // 🔑 obrigatório
      });
      blocoId = resBloco.data.id;
    }

    let salaId: number | undefined;
    if (salaNome) {
      if (!blocoId) throw new Error("Bloco não foi criado para a sala");
      const resSala = await api.post("localizacoes/salas/", {
        nome: salaNome,
        predio: predioId,
        bloco: blocoId
      });
      salaId = resSala.data.id;
    }

    onSelected?.(predioId, blocoId, salaId);

    setPredioNome("");
    setBlocoNome("");
    setSalaNome("");
    onClose();

  } catch (err: any) {
    console.error("Erro ao salvar espaço físico:", err.response?.data || err);
    alert("Erro ao salvar. Confira os campos e tente novamente.");
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative">
        <h2 className="text-2xl font-bold mb-4">Adicionar Espaço Físico</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Prédio</label>
            <input
              list="predios"
              className="w-full border rounded-lg p-2"
              value={predioNome}
              onChange={(e) => setPredioNome(e.target.value)}
              placeholder="Escolha ou digite um prédio"
            />
            <datalist id="predios">
              {predios.map((p) => (
                <option key={p.id} value={p.nome} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block font-medium">Bloco</label>
            <input
              list="blocos"
              className="w-full border rounded-lg p-2"
              value={blocoNome}
              onChange={(e) => setBlocoNome(e.target.value)}
              placeholder="Escolha ou digite um bloco"
              disabled={!predioNome}
            />
            <datalist id="blocos">
              {blocos.map((b) => (
                <option key={b.id} value={b.nome} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block font-medium">Sala</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              value={salaNome}
              onChange={(e) => setSalaNome(e.target.value)}
              placeholder="Digite o nome da sala (nova)"
              disabled={!predioNome || !blocoNome}
            />
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
