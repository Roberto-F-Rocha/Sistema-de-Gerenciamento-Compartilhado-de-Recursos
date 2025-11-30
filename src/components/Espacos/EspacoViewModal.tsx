import React from "react";
import type { Espaco } from "../../services/espaco";

interface Props {
  open: boolean;
  onClose: () => void;
  data: (Espaco & { id: number }) | null;
}

const EspacoViewModal: React.FC<Props> = ({ open, onClose, data }) => {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl border border-gray-200 shadow-xl relative">

        {/* Header */}
        <h2 className="text-xl font-bold text-[#2E3A59] mb-5">
          Detalhes do Espaço
        </h2>

        {/* Conteúdo */}
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <span className="font-semibold text-[#2E3A59]">ID:</span> {data.id}
          </div>

          <div>
            <span className="font-semibold text-[#2E3A59]">Nome:</span> {data.nome}
          </div>

          <div>
            <span className="font-semibold text-[#2E3A59]">Tipo:</span> {data.tipo}
          </div>

          <div>
            <span className="font-semibold text-[#2E3A59]">Bloco:</span> {data.bloco || "-"}
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

export default EspacoViewModal;
