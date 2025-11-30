import React, { useState, useRef, useEffect } from "react";
import { Upload } from "lucide-react";
import { getItens } from "../../services/itens";
import type { Item } from "../../services/itens";
import { createChamado } from "../../services/chamados";

const ChamadosForm: React.FC<{ onCreated?: () => void }> = ({ onCreated }) => {
  const [tipoChamado, setTipoChamado] = useState("");
  const [itemPrimordial, setItemPrimordial] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [anexos, setAnexos] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [inputKey, setInputKey] = useState(0);

  const [itens, setItens] = useState<Item[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getItens();
        setItens(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao carregar itens:", error);
        setItens([]);
      }
    }
    fetchData();
  }, []);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setAnexos((prev) => [...prev, ...Array.from(files)]);
    setInputKey((prev) => prev + 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const removeFile = (index: number) => {
    setAnexos((prev) => prev.filter((_, i) => i !== index));
    setInputKey((prev) => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        tipo: tipoChamado,
        descricao,
        patrimonio: Number(itemPrimordial) || 0,
        titulo: titulo || "",
      };

      console.log(payload);

      await createChamado(payload);

      if (onCreated) onCreated();

      // reset
      setTipoChamado("");
      setItemPrimordial("");
      setTitulo("");
      setDescricao("");
      setAnexos([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      console.error("Erro ao enviar chamado:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tipo de Chamado */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Tipo de Chamado
        </label>
        <select
          value={tipoChamado}
          onChange={(e) => setTipoChamado(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          required
        >
          <option value="">Selecione...</option>
          <option value="falta">Falta</option>
          <option value="dano">Dano</option>
          <option value="manutencao">Manutenção</option>
          <option value="substituicao">Substituição</option>
        </select>
      </div>

      {/* Item Primordial */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Item Primordial
        </label>
        <select
          value={itemPrimordial}
          onChange={(e) => setItemPrimordial(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          required
        >
          <option value="">Selecione...</option>
          {(itens ?? []).map((item) => (
            <option key={item.id ?? Math.random()} value={item.id ?? ""}>
              {item.nome ?? "Sem nome"}
            </option>
          ))}
        </select>
      </div>

      {/* Título / Assunto */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Título / Assunto
        </label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Informe o título do chamado..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          required
        />
      </div>

      {/* Descrição detalhada */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Descrição detalhada
        </label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={4}
          placeholder="Descreva o problema ou solicitação com detalhes..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
          required
        />
      </div>

      {/* Botão Enviar */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-[#415085] hover:bg-[#303a63] text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
        >
          Enviar Chamado
        </button>
      </div>
    </form>
  );
};

export default ChamadosForm;
