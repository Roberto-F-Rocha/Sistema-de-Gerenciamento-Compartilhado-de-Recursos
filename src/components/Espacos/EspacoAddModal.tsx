import React, { useState, useEffect } from "react";
import { createEspaco } from "../../services/espaco";
import type { Bloco } from "../../services/bloco";
import { getBlocos } from "../../services/bloco";


type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

const EspacoAddModal: React.FC<Props> = ({ open, onClose, onCreated }) => {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [bloco, setBloco] = useState<number | "">("");
  const [blocos, setBlocos] = useState<Bloco[]>([]);

  // Carregar blocos ao abrir o modal
  useEffect(() => {
    if (open) {
      getBlocos().then(setBlocos).catch(console.error);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        nome,
        tipo,
        bloco, // agora é ID numérico
      };

      await createEspaco(payload);
      onCreated?.();

      setNome("");
      setTipo("");
      setBloco("");

      onClose();
    } catch (err) {
      console.error("Erro ao criar espaço:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative">
        <h2 className="text-2xl font-bold mb-4">Novo Espaço Físico</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label>Nome *</label>
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Bloco como SELECT */}
          <div>
            <label>Bloco *</label>
            <select
              required
              className="w-full border rounded-lg p-2"
              value={bloco}
              onChange={(e) => setBloco(Number(e.target.value))}
            >
              <option value="">Selecione...</option>
              {blocos.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nome} — {b.predio_nome}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo */}
          <div>
            <label>Tipo *</label>
            <select
              required
              className="w-full border rounded-lg p-2"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Sala de Aula">Sala de Aula</option>
              <option value="Laboratório">Laboratório</option>
              <option value="Auditório">Auditório</option>
              <option value="Sala Professor / Projeto">
                Sala Professor / Projeto
              </option>
              <option value="Ginásio">Ginásio</option>
              <option value="Sala Administrativa">Administrativa</option>
              <option value="Área Externa">Área Externa</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EspacoAddModal;
