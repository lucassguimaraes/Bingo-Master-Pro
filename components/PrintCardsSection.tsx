
import React from 'react';
import { BingoItem, GridSize, BingoTheme, CenterIcon } from '../types';
import BingoCard from './BingoCard';

interface PrintCardsSectionProps {
  cards: (BingoItem | string | null)[][];
  title: string;
  gridSize: GridSize;
  theme: BingoTheme;
  centerIcon: CenterIcon;
}

const PrintCardsSection: React.FC<PrintCardsSectionProps> = ({ cards, title, gridSize, theme, centerIcon }) => {
  return (
    <div id="print-section" className="hidden p-0 bg-white">
      <div className="flex flex-col">
        {cards.map((gridItems, index) => {
          const isFirstInPage = index % 2 === 0;
          return (
            <React.Fragment key={index}>
              {/* Quebra de página a cada 2 cartelas */}
              {isFirstInPage && index !== 0 && <div className="print-page-break" style={{ pageBreakBefore: 'always' }} />}
              
              <div className="w-full h-[50vh] flex flex-col items-center justify-center p-12 relative border-b border-dashed border-slate-200 last:border-0">
                 <div className="absolute top-4 right-8 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                   BINGO MASTER PRO #ID-{1000 + index}
                 </div>
                 
                 {/* Container com largura fixa para manter a proporção 1:1 das células via aspect-square */}
                 <div className="w-[18cm] max-w-full">
                   <BingoCard 
                    title={title} 
                    gridSize={gridSize} 
                    items={gridItems} 
                    theme={theme} 
                    centerIcon={centerIcon} 
                   />
                 </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PrintCardsSection;
