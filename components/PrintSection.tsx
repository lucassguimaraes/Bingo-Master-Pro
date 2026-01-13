
import React from 'react';
import { BingoItem } from '../types';

interface PrintSectionProps {
  items: BingoItem[];
}

const PrintSection: React.FC<PrintSectionProps> = ({ items }) => {
  return (
    <div id="print-section" className="hidden p-10 bg-white min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase border-b-2 border-black inline-block pb-1">Itens de Sorteio</h1>
        <p className="text-sm text-gray-600 mt-1 italic">Recorte nos pontilhados para realizar o sorteio do bingo.</p>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-0 border-t border-l border-black">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="aspect-square border-r border-b border-black border-dashed flex flex-col items-center justify-center p-3 text-center"
          >
            <div className="w-16 h-16 mb-2 flex items-center justify-center">
              <img src={item.url} alt={item.name} className="max-w-full max-h-full object-contain" />
            </div>
            <span className="text-[10px] font-medium leading-none break-all">{item.name}</span>
            <span className="text-[8px] mt-1 text-gray-400">#{index + 1}</span>
          </div>
        ))}
        {/* Fill empty cells to complete the last row grid for visual consistency */}
        {items.length > 0 && Array.from({ length: (6 - (items.length % 6)) % 6 }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square border-r border-b border-black border-dashed" />
        ))}
      </div>

      <div className="mt-10 text-[10px] text-gray-400 text-right">
        Gerado por Bingo Master App
      </div>
    </div>
  );
};

export default PrintSection;
