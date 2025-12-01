import React, { useState, useMemo } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import type { Predio, Bloco, Sala } from "../../services/espaco";

export interface Localizacao {
  id: number;
  predio?: Predio;
  bloco?: Bloco;
  sala?: Sala;
}

interface LocalizacoesTableProps {
  data: Localizacao[];
  rowsPerPage?: number;
  onEdit?: (localizacao: Localizacao) => void;
  onDelete?: (localizacao: Localizacao) => void;
  onView?: (localizacao: Localizacao) => void;
}

const LocalizacoesTable: React.FC<LocalizacoesTableProps> = ({
  data,
  rowsPerPage = 10,
  onEdit,
  onDelete,
  onView,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [data, currentPage, rowsPerPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const pages = useMemo(() => {
    const delta = 2;
    const result: (number | string)[] = [];
    let last: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        if (last && i - last > 1) result.push("...");
        result.push(i);
        last = i;
      }
    }
    return result;
  }, [totalPages, currentPage]);

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center py-10 text-gray-500">
        Nenhuma localização encontrada.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-white rounded-xl border border-gray-200 shadow overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-left">
            <tr className="text-[#2E3A59]">
              <th className="py-3 px-4 font-semibold">ID</th>
              <th className="py-3 px-4 font-semibold">Localização</th>
              <th className="py-3 px-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((loc) => {
              const location = [loc.predio?.nome, loc.bloco?.nome, loc.sala?.nome]
                .filter(Boolean)
                .join(" > ");

              return (
                <tr key={loc.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">{loc.id}</td>
                  <td className="py-3 px-4" title={location}>{location}</td>
                  <td className="py-3 px-4 flex justify-center gap-2">
                    <button onClick={() => onView?.(loc)} title="Visualizar" className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                      <Eye size={16} className="text-gray-700" />
                    </button>
                    <button onClick={() => onEdit?.(loc)} title="Editar" className="p-1 rounded hover:bg-blue-100 cursor-pointer">
                      <Edit size={16} className="text-blue-500" />
                    </button>
                    <button onClick={() => onDelete?.(loc)} title="Excluir" className="p-1 rounded hover:bg-red-100 cursor-pointer">
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex justify-center mt-2 select-none">
        <div className="flex gap-2 justify-center min-w-[350px]">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 cursor-pointer disabled:opacity-50">&lt;</button>
          {pages.map((p, idx) =>
            typeof p === "number" ? (
              <button key={p} onClick={() => goToPage(p)} className={`px-3 py-1 cursor-pointer font-semibold ${currentPage === p ? "text-[#1E40AF]" : "text-black"} hover:text-[#1E40AF] transition-colors`}>
                {p}
              </button>
            ) : (
              <span key={`dots-${idx}`} className="px-2 py-1 text-black">{p}</span>
            )
          )}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 cursor-pointer disabled:opacity-50">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default LocalizacoesTable;
