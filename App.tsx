
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Printer, 
  Loader2,
  LayoutGrid,
  Shuffle,
  FileText
} from 'lucide-react';
import { GridSize, BingoItem, BingoTheme, ContentType, BingoConfig, CenterIcon } from './types';
import Sidebar from './components/Sidebar';
import ItemGallery from './components/ItemGallery';
import BingoCard from './components/BingoCard';
import PrintSection from './components/PrintSection';
import PrintCardsSection from './components/PrintCardsSection';
import ReactDOM from 'react-dom/client';

declare const html2canvas: any;
declare const JSZip: any;
declare const saveAs: any;

const THEME_PRESETS: BingoTheme[] = [
  { name: 'Índigo', primaryColor: '#4f46e5', headerTextColor: '#ffffff', cellBgColor: '#ffffff', cellTextColor: '#334155', borderColor: '#4f46e5' },
  { name: 'Baby Pink', primaryColor: '#ec4899', headerTextColor: '#ffffff', cellBgColor: '#fff1f2', cellTextColor: '#831843', borderColor: '#fb7185' },
  { name: 'Emerald', primaryColor: '#059669', headerTextColor: '#ffffff', cellBgColor: '#f0fdf4', cellTextColor: '#064e3b', borderColor: '#10b981' },
  { name: 'Sunset', primaryColor: '#f59e0b', headerTextColor: '#ffffff', cellBgColor: '#fffbeb', cellTextColor: '#78350f', borderColor: '#fbbf24' },
  { name: 'Dark Mode', primaryColor: '#1e293b', headerTextColor: '#f8fafc', cellBgColor: '#334155', cellTextColor: '#f8fafc', borderColor: '#475569' },
];

const App: React.FC = () => {
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [title, setTitle] = useState('BINGO');
  const [items, setItems] = useState<BingoItem[]>([]);
  const [allCards, setAllCards] = useState<(BingoItem | string | null)[][]>([]);
  const [freeSpaceLabel, setFreeSpaceLabel] = useState('LIVRE');
  const [centerIcon, setCenterIcon] = useState<CenterIcon>('none');
  const [isFreeSpaceEnabled, setIsFreeSpaceEnabled] = useState(true);
  const [cardCount, setCardCount] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [theme, setTheme] = useState<BingoTheme>(THEME_PRESETS[0]);
  const [printMode, setPrintMode] = useState<'lottery' | 'cards'>('cards');
  
  const [config, setConfig] = useState<BingoConfig>({
    contentType: 'numbers',
    numberRange: { min: 1, max: 75 },
    wordList: ''
  });

  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const generateCombination = useCallback(() => {
    const totalCells = gridSize * gridSize;
    const isOdd = gridSize % 2 !== 0;
    const centerIndex = (isOdd && isFreeSpaceEnabled) ? Math.floor(totalCells / 2) : -1;
    const cellsToFill = isFreeSpaceEnabled && isOdd ? totalCells - 1 : totalCells;

    let pool: (BingoItem | string)[] = [];

    if (config.contentType === 'images') {
      pool = [...items];
    } else if (config.contentType === 'numbers') {
      const { min, max } = config.numberRange;
      const count = Math.max(0, max - min + 1);
      const numbers = Array.from({ length: count }, (_, i) => (min + i).toString());
      pool = numbers;
    } else if (config.contentType === 'words') {
      pool = config.wordList.split('\n').map(w => w.trim()).filter(w => w.length > 0);
    }

    const finalShuffledPool = shuffle(pool);
    const newGrid: (BingoItem | string | null)[] = [];

    let poolIdx = 0;
    for (let i = 0; i < totalCells; i++) {
      if (i === centerIndex) {
        newGrid.push(freeSpaceLabel);
      } else {
        if (poolIdx < finalShuffledPool.length) {
          newGrid.push(finalShuffledPool[poolIdx]);
          poolIdx++;
        } else {
          newGrid.push(null);
        }
      }
    }
    return newGrid;
  }, [gridSize, items, freeSpaceLabel, isFreeSpaceEnabled, config]);

  const generateBingoSet = () => {
    const newCards = [];
    for (let i = 0; i < cardCount; i++) {
      newCards.push(generateCombination());
    }
    setAllCards(newCards);
  };

  useEffect(() => {
    generateBingoSet();
  }, [gridSize, items.length, config.contentType, config.numberRange.min, config.numberRange.max]);

  const handlePrint = (mode: 'lottery' | 'cards') => {
    setPrintMode(mode);
    setTimeout(() => window.print(), 100);
  };

  const exportAllCards = async () => {
    setIsExporting(true);
    setExportProgress(0);
    const zip = new JSZip();
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '600px';
    document.body.appendChild(tempContainer);

    try {
      for (let i = 0; i < allCards.length; i++) {
        const rootDiv = document.createElement('div');
        tempContainer.appendChild(rootDiv);
        const root = ReactDOM.createRoot(rootDiv);
        await new Promise<void>((resolve) => {
          root.render(
            <div style={{ width: '600px', background: 'white' }}>
              <BingoCard title={title} gridSize={gridSize} items={allCards[i]} theme={theme} centerIcon={centerIcon} />
            </div>
          );
          setTimeout(resolve, 350);
        });

        const canvas = await html2canvas(rootDiv, { useCORS: true, scale: 2 });
        const imgData = canvas.toDataURL('image/png').split(',')[1];
        zip.file(`cartela-${i + 1}.png`, imgData, { base64: true });
        setExportProgress(Math.round(((i + 1) / allCards.length) * 100));
        root.unmount();
        tempContainer.removeChild(rootDiv);
      }
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `bingo-master-${allCards.length}-cartelas.zip`);
    } catch (e) {
      alert("Erro na exportação.");
    } finally {
      document.body.removeChild(tempContainer);
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {isExporting && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white">
          <Loader2 className="w-16 h-16 animate-spin mb-6 text-emerald-400" />
          <p className="text-2xl font-black uppercase tracking-widest">Processando: {exportProgress}%</p>
          <p className="text-slate-400 mt-2">Isso pode levar alguns instantes para grandes lotes.</p>
        </div>
      )}

      <Sidebar 
        gridSize={gridSize} setGridSize={setGridSize}
        title={title} setTitle={setTitle}
        onGenerate={generateBingoSet}
        freeSpaceLabel={freeSpaceLabel} setFreeSpaceLabel={setFreeSpaceLabel}
        isFreeSpaceEnabled={isFreeSpaceEnabled} setIsFreeSpaceEnabled={setIsFreeSpaceEnabled}
        centerIcon={centerIcon} setCenterIcon={setCenterIcon}
        cardCount={cardCount} setCardCount={setCardCount}
        itemsCount={items.length}
        exportAllCards={exportAllCards}
        theme={theme} setTheme={setTheme} themePresets={THEME_PRESETS}
        config={config} setConfig={setConfig}
        onPrint={handlePrint}
      />

      <main className="flex-1 p-6 md:p-10 flex flex-col items-center overflow-y-auto">
        <header className="w-full flex justify-between items-center mb-10 max-w-6xl">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Bingo Master <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-bold uppercase tracking-widest">PRO</span>
            </h1>
            <p className="text-slate-500 font-medium">Crie, personalize e produza cartelas em massa</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handlePrint('cards')} className="bg-white border-2 border-slate-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center gap-2">
              <Printer size={18} /> Imprimir Cartelas
            </button>
            <button onClick={() => handlePrint('lottery')} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-slate-900 transition-all flex items-center gap-2">
              <FileText size={18} /> Folha de Sorteio
            </button>
          </div>
        </header>

        <section className="w-full max-w-6xl">
          <div ref={cardsContainerRef} className={`grid gap-10 w-full ${allCards.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
            {allCards.map((gridItems, index) => (
              <div key={index} className="flex flex-col group">
                <div className="flex justify-between items-end mb-2 px-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cód. BNG-{1000 + index}</span>
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Preview Ativo</span>
                </div>
                <div className="bingo-card-wrapper bg-white p-4 rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 transform transition-transform hover:scale-[1.02]">
                  <BingoCard title={title} gridSize={gridSize} items={gridItems} theme={theme} centerIcon={centerIcon} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 mb-16 flex flex-col items-center gap-4">
            <button onClick={generateBingoSet} className="px-16 py-6 bg-indigo-600 text-white rounded-2xl font-black text-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center gap-4 active:scale-95 group">
              <Shuffle size={32} className="group-hover:rotate-180 transition-transform duration-500" /> EMBARALHAR TUDO
            </button>
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest animate-pulse">Cada clique gera padrões únicos</p>
          </div>
        </section>
      </main>

      <aside className="w-full md:w-80 bg-white border-l border-slate-200 p-6 flex flex-col overflow-hidden">
        <ItemGallery items={items} setItems={setItems} onZipDownload={() => {}} />
      </aside>

      {printMode === 'lottery' ? <PrintSection items={items} /> : <PrintCardsSection cards={allCards} title={title} gridSize={gridSize} theme={theme} centerIcon={centerIcon} />}
    </div>
  );
};

export default App;
