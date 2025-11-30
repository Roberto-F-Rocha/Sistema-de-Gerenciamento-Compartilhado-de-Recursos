import { useState } from "react";
import { deleteEspaco } from "../../services/espaco";
import type { Espaco } from "../../services/espaco";

interface EspacoDeleteModalProps {
  open: boolean;
  onClose: () => void;
  espaco: Espaco | null;
  onDeleted?: () => void;
}

export default function EspacoDeleteModal({
  open,
  onClose,
  espaco,
  onDeleted,
}: EspacoDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open || !espaco) return null;

  const handleDelete = async () => {
    if (loading) return; // evita clique duplo
    setLoading(true);

    try {
      await deleteEspaco(espaco.id);

      onDeleted?.();
      onClose();
    } catch (err) {
      console.error("Erro ao excluir espaço:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white p-6 w-[400px] rounded-xl shadow-xl">
        <h2 className="text-lg font-semibold text-red-600 mb-4">
          Confirmar Exclusão
        </h2>

        <p className="mb-6">
          Tem certeza de que deseja excluir o espaço{" "}
          <strong>{espaco.nome}</strong>?
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
            onClick={handleDelete}
            className={`px-4 py-2 text-white rounded cursor-pointer ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
            disabled={loading}
          >
            {loading ? "Deletando..." : "Deletar"}
          </button>
        </div>
      </div>
    </div>
  );
}
