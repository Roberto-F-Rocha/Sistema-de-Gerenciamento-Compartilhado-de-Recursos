import { useState } from "react";
import type { Predio, Bloco, Sala } from "../../services/espaco";

export interface Localizacao {
  id: number;
  predio?: Predio;
  bloco?: Bloco;
  sala?: Sala;
}

interface LocalizacaoDeleteModalProps {
  open: boolean;
  onClose: () => void;
  localizacao: Localizacao | null;
  onConfirmed?: () => void;
}

export default function LocalizacaoDeleteModal({
  open,
  onClose,
  localizacao,
  onConfirmed,
}: LocalizacaoDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open || !localizacao) return null;

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // Aqui você pode chamar uma função de remoção real, se necessário
      onConfirmed?.();
      onClose();
    } catch (err) {
      console.error("Erro ao confirmar ação:", err);
    } finally {
      setLoading(false);
    }
  };

  const displayName = [
    localizacao.predio?.nome,
    localizacao.bloco?.nome,
    localizacao.sala?.nome,
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white p-6 w-[400px] rounded-xl shadow-xl">
        <h2 className="text-lg font-semibold text-red-600 mb-4">
          Confirmar Ação
        </h2>

        <p className="mb-6">
          Tem certeza de que deseja confirmar a ação para{" "}
          <strong>{displayName}</strong>?
        </p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded cursor-pointer ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
            disabled={loading}
          >
            {loading ? "Confirmando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
