import React, { useEffect, useState } from "react";
import api from "../../services/api";

export interface Espaco {
  id: number;
  nome: string;
  tipo: string;
  predio?: { id: number; nome: string };
  bloco?: { id: number; nome: string };
  sala?: { id: number; nome: string };
}

interface Props {
  open: boolean;
  onClose: () => void;
  data: Espaco | null;
}

const EspacoViewModal: React.FC<Props> = ({ open, onClose, data }) => {
  const [espaco, setEspaco] = useState<Espaco | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !data?.id) {
      setEspaco(null);
      return;
    }

    if (data.predio && data.bloco && data.sala) {
      setEspaco(data);
      return;
    }

    setLoading(true);
    api
      .get(`localizacoes/espacos/${data.id}/`)
      .then((res) => setEspaco(res.data))
      .catch((err) => {
        console.error("Erro ao buscar espaço:", err);
        setEspaco(data); // fallback parcial
      })
      .finally(() => setLoading(false));
  }, [open, data]);

  if (!open || !espaco) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-xl border border-gray-200 shadow-xl relative overflow-y-auto">
        {/* Header */}
        <h2 className="text-xl font-bold text-[#2E3A59] mb-5">Detalhes do Espaço</h2>

        {/* Conteúdo */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando...</div>
        ) : (
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <span className="font-semibold text-[#2E3A59]">ID:</span> {espaco.id}
            </div>
            <div>
              <span className="font-semibold text-[#2E3A59]">Nome:</span> {espaco.nome || "-"}
            </div>
            <div>
              <span className="font-semibold text-[#2E3A59]">Tipo:</span> {espaco.tipo || "-"}
            </div>
            <div>
              <span className="font-semibold text-[#2E3A59]">Prédio:</span> {espaco.predio?.nome || "-"}
            </div>
            <div>
              <span className="font-semibold text-[#2E3A59]">Bloco:</span> {espaco.bloco?.nome || "-"}
            </div>
            <div>
              <span className="font-semibold text-[#2E3A59]">Sala:</span> {espaco.sala?.nome || "-"}
            </div>
          </div>
        )}

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
