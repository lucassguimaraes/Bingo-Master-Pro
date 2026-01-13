
import React, { useRef } from 'react';
import { Upload, Trash2, Download, FileArchive, ImageIcon } from 'lucide-react';
import { BingoItem } from '../types';

declare const saveAs: any;

interface ItemGalleryProps {
  items: BingoItem[];
  setItems: React.Dispatch<React.SetStateAction<BingoItem[]>>;
  onZipDownload: () => void;
}

const ItemGallery: React.FC<ItemGalleryProps> = ({ items, setItems, onZipDownload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newItems: BingoItem[] = [];
    // Fix: explicitly type the file as File to avoid unknown type errors on lines 30 and 37
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setItems((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substr(2, 9),
              name: file.name,
              url: event.target?.result as string,
              file: file,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const downloadSingle = (item: BingoItem) => {
    const base64 = item.url;
    fetch(base64)
      .then(res => res.blob())
      .then(blob => saveAs(blob, item.name));
  };

  const clearAll = () => {
    if (confirm("Deseja remover todos os itens?")) {
      setItems([]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <ImageIcon size={18} /> Galeria ({items.length})
          </h3>
          {items.length > 0 && (
            <button 
              onClick={clearAll}
              className="text-xs text-red-500 hover:underline flex items-center gap-1"
            >
              <Trash2 size={12} /> Limpar
            </button>
          )}
        </div>
        
        <label className="cursor-pointer group">
          <div className="border-2 border-dashed border-slate-200 group-hover:border-indigo-400 group-hover:bg-indigo-50 rounded-xl p-4 transition text-center">
            <Upload className="mx-auto mb-2 text-slate-400 group-hover:text-indigo-500" size={24} />
            <span className="text-xs font-medium text-slate-500 group-hover:text-indigo-600 uppercase tracking-wide">
              Subir Imagens (PNG/JPG)
            </span>
            <input 
              ref={fileInputRef}
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </div>
        </label>
      </div>

      {items.length > 0 && (
        <button 
          onClick={onZipDownload}
          className="flex items-center justify-center gap-2 w-full py-2 mb-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition text-sm font-semibold"
        >
          <FileArchive size={16} /> Baixar Tudo (.ZIP)
        </button>
      )}

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-300">
            <ImageIcon size={48} className="opacity-20 mb-2" />
            <p className="text-sm">Nenhum item carregado</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="group relative bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-white overflow-hidden border border-slate-100 flex-shrink-0">
                <img src={item.url} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{item.name}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button 
                  onClick={() => downloadSingle(item)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded"
                  title="Download individual"
                >
                  <Download size={14} />
                </button>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded"
                  title="Remover"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ItemGallery;
