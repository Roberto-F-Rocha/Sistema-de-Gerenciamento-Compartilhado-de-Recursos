import React, { useState, useMemo, useEffect } from "react";
import ChamadosFilters from "../components/Chamados/ChamadosFilters";
import ChamadosTable from "../components/Chamados/ChamadosTable";
import ChamadosForm from "../components/Chamados/ChamadosForm";
import { getChamados } from "../services/chamados";
import type { Chamado } from "../services/chamados";
import ChamadoDeleteModal from "../components/Chamados/ChamadoDeleteModal";

const Chamados: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const [chamados, setChamados] = useState<Chamado[]>([]);
    const [loading, setLoading] = useState(true); // controle de carregamento

    useEffect(() => {
        async function fetchData() {
          try {
            const data = await getChamados();
            setChamados(data);
          } catch (error) {
            console.error("Erro ao carregar chamados:", error);
          } finally {
            setLoading(false);
          }
        }
        fetchData();
      }, []);

    useEffect(() => {
      fetchChamados();
    }, []);

    async function fetchChamados() {
      const data = await getChamados();
      setChamados(data);
    }

    const [deleteOpen, setDeleteOpen] = useState(false);
    
    const [selected, setSelected] = useState<Chamado | null>(null);

    const handleDelete = (registro: Chamado) => {
        setSelected(registro);
        setDeleteOpen(true);
      };

    const handleDeleted = async () => {
      setDeleteOpen(false);
      setSelected(null);
      await fetchChamados();
    };

    const filteredChamados = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return chamados.filter((chamado) => {
      const matchesSearch =
        String(chamado.id).toLowerCase().includes(term)
        chamado.descricao.toLowerCase().includes(term);

        return matchesSearch
    });
  }, [searchTerm, chamados]);

  if (loading) {
    return (
      <section className="pt-4 px-4">
        <h2 className="text-3xl font-bold mb-6 text-[#2E3A59]">
            Central de Chamados e Solicitações
        </h2>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-[#2E3A59]">
                Abrir um Novo Chamado
            </h2>
            <ChamadosForm />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
          <p>Carregando dados...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4 px-4">
        <h2 className="text-3xl font-bold mb-6 text-[#2E3A59]">
            Central de Chamados e Solicitações
        </h2>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-[#2E3A59]">
                Abrir um Novo Chamado
            </h2>
            <ChamadosForm onCreated={fetchChamados} />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-6 text-[#2E3A59]">
                    Chamados
                </h2>
                <ChamadosFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            </div>

            <ChamadosTable 
            key={filteredChamados.length} 
            data={filteredChamados}
            onDelete={handleDelete} />

            {/* DELETE */}
            <ChamadoDeleteModal
              open={deleteOpen}
              chamado={selected}
              onClose={() => setDeleteOpen(false)}
              onDeleted={handleDeleted}
            />
      </div>
    </section>
  );
};

export default Chamados;
