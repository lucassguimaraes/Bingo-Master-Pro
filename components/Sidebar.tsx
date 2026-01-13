
import React from 'react';
import { Settings, Play, RotateCcw, LayoutGrid, Hash, List, ImageIcon as IconImage, ToggleLeft, ToggleRight, Star, Heart, Trophy, Type } from 'lucide-react';
import { GridSize, BingoTheme, BingoConfig, ContentType, CenterIcon } from '../types';

interface SidebarProps {
  gridSize: GridSize;
  setGridSize: (val: GridSize) => void;
  title: string;
  setTitle: (val: string) => void;
  onGenerate: () => void;
  freeSpaceLabel: string;
  setFreeSpaceLabel: (val: string) => void;
  isFreeSpaceEnabled: boolean;
  setIsFreeSpaceEnabled: (val: boolean) => void;
  centerIcon: CenterIcon;
  setCenterIcon: (val: CenterIcon) => void;
  cardCount: number;
  setCardCount: (val: number) => void;
  itemsCount: number;
  exportAllCards: () => void;
  theme: BingoTheme;
  setTheme: (val: BingoTheme) => void;
  themePresets: BingoTheme[];
  config: BingoConfig;
  setConfig: React.Dispatch<React.SetStateAction<BingoConfig>>;
  onPrint: (mode: 'lottery' | 'cards') => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  gridSize, setGridSize, title, setTitle, onGenerate, freeSpaceLabel, setFreeSpaceLabel,
  isFreeSpaceEnabled, setIsFreeSpaceEnabled, centerIcon, setCenterIcon, cardCount, setCardCount, exportAllCards,
  theme, setTheme, themePresets, config, setConfig
}) => {

  const updateTheme = (key: keyof BingoTheme, value: string) => setTheme({ ...theme, [key]: value });
  const setMode = (mode: ContentType) => setConfig({ ...config, contentType: mode });
  const hasCenterCell = gridSize % 2 !== 0;

  return (
    <nav className="w-full md:w-72 bg-slate-900 text-white p-6 flex flex-col gap-6 shadow-2xl z-10 overflow-y-auto custom-scrollbar border-r border-slate-800">
      <div className="flex items-center gap-3 px-2 mb-2">
        <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20"><Settings size={20} /></div>
        <span className="font-black text-xl tracking-tight">Painel</span>
      </div>

      <div className="space-y-6">
        {/* Geral */}
        <div className="space-y-3 bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Configuração Geral</label>
          <input 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título"
            className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
          />
          <div className="flex gap-1.5">
            {[3, 4, 5].map((s) => (
              <button key={s} onClick={() => setGridSize(s as GridSize)} className={`flex-1 py-2 rounded-xl border-2 transition-all text-xs font-black ${gridSize === s ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-600/30' : 'bg-slate-800 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                {s}x{s}
              </button>
            ))}
          </div>
        </div>

        {/* Estilo e Presets */}
        <div className="space-y-4 border-t border-slate-800 pt-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Estilo & Presets</label>
          <div className="grid grid-cols-5 gap-2">
            {themePresets.map((p) => (
              <button 
                key={p.name} 
                onClick={() => setTheme(p)}
                className={`w-full aspect-square rounded-full border-2 transition-all ${theme.name === p.name ? 'scale-110 border-white shadow-xl' : 'border-transparent scale-90 hover:scale-100'}`}
                style={{ backgroundColor: p.primaryColor }}
                title={p.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-500 ml-1">PRIMÁRIA</span>
              <input type="color" value={theme.primaryColor} onChange={(e) => updateTheme('primaryColor', e.target.value)} className="w-full h-10 rounded-xl bg-slate-800 border-none p-1 cursor-pointer hover:bg-slate-700 transition" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-500 ml-1">CÉLULA</span>
              <input type="color" value={theme.cellBgColor} onChange={(e) => updateTheme('cellBgColor', e.target.value)} className="w-full h-10 rounded-xl bg-slate-800 border-none p-1 cursor-pointer hover:bg-slate-700 transition" />
            </div>
          </div>
        </div>

        {/* Espaço Central */}
        {hasCenterCell && (
          <div className="space-y-3 border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Célula Central</label>
              <button onClick={() => setIsFreeSpaceEnabled(!isFreeSpaceEnabled)} className={`transition ${isFreeSpaceEnabled ? 'text-indigo-400' : 'text-slate-600'}`}>
                {isFreeSpaceEnabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
            {isFreeSpaceEnabled && (
              <>
                <div className="flex gap-2 bg-slate-800/50 p-1 rounded-xl border border-slate-800">
                  <button onClick={() => setCenterIcon('none')} className={`flex-1 p-2 rounded-lg flex items-center justify-center transition ${centerIcon === 'none' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}><Type size={16}/></button>
                  <button onClick={() => setCenterIcon('star')} className={`flex-1 p-2 rounded-lg flex items-center justify-center transition ${centerIcon === 'star' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}><Star size={16}/></button>
                  <button onClick={() => setCenterIcon('heart')} className={`flex-1 p-2 rounded-lg flex items-center justify-center transition ${centerIcon === 'heart' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}><Heart size={16}/></button>
                  <button onClick={() => setCenterIcon('trophy')} className={`flex-1 p-2 rounded-lg flex items-center justify-center transition ${centerIcon === 'trophy' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}><Trophy size={16}/></button>
                </div>
                <input 
                  type="text" value={freeSpaceLabel} onChange={(e) => setFreeSpaceLabel(e.target.value)} placeholder="Texto (opcional)"
                  className="w-full bg-slate-800 border-none rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500 shadow-inner"
                />
              </>
            )}
          </div>
        )}

        {/* Conteúdo */}
        <div className="space-y-3 border-t border-slate-800 pt-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Conteúdo</label>
          <div className="grid grid-cols-3 gap-1.5">
            <button onClick={() => setMode('numbers')} className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${config.contentType === 'numbers' ? 'bg-indigo-600 scale-105 shadow-lg shadow-indigo-600/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}>
              <Hash size={18} /><span className="text-[8px] font-black uppercase">Números</span>
            </button>
            <button onClick={() => setMode('words')} className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${config.contentType === 'words' ? 'bg-indigo-600 scale-105 shadow-lg shadow-indigo-600/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}>
              <List size={18} /><span className="text-[8px] font-black uppercase">Palavras</span>
            </button>
            <button onClick={() => setMode('images')} className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${config.contentType === 'images' ? 'bg-indigo-600 scale-105 shadow-lg shadow-indigo-600/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}>
              <IconImage size={18} /><span className="text-[8px] font-black uppercase">Imagens</span>
            </button>
          </div>

          {config.contentType === 'numbers' && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input type="number" value={config.numberRange.min} onChange={(e) => setConfig({...config, numberRange: {...config.numberRange, min: parseInt(e.target.value) || 0}})} className="bg-slate-800 border-none text-xs p-3 rounded-xl font-bold" />
              <input type="number" value={config.numberRange.max} onChange={(e) => setConfig({...config, numberRange: {...config.numberRange, max: parseInt(e.target.value) || 0}})} className="bg-slate-800 border-none text-xs p-3 rounded-xl font-bold" />
            </div>
          )}
          {config.contentType === 'words' && (
            <textarea value={config.wordList} onChange={(e) => setConfig({...config, wordList: e.target.value})} placeholder="Um nome por linha..." className="w-full h-24 bg-slate-800 border-none text-xs p-3 rounded-xl font-bold resize-none custom-scrollbar" />
          )}
        </div>

        {/* Produção */}
        <div className="space-y-4 border-t border-slate-800 pt-4 mb-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Lote (ZIP)</label>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-600 font-bold uppercase">Qtd:</span>
              <input type="number" min="1" max="100" value={cardCount} onChange={(e) => setCardCount(parseInt(e.target.value) || 1)} className="bg-slate-800 border-none text-xs p-1.5 rounded-lg w-14 font-black" />
            </div>
          </div>
          <button onClick={onGenerate} className="w-full py-4 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all border border-indigo-500/30">
            <LayoutGrid size={16} /> ATUALIZAR GRADE
          </button>
          <button onClick={exportAllCards} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-900/20 active:scale-95">
            <Play size={16} fill="currentColor" /> EXPORTAR PNGs (.ZIP)
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
