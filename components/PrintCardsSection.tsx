
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
      <div className="flex flex-col gap-0">
        {cards.map((gridItems, index) => {
          const isFirstInPage = index % 2 === 0;
          return (
            <React.Fragment key={index}>
              {isFirstInPage && index !== 0 && <div className="print-page-break" style={{ pageBreakBefore: 'always' }} />}
              <div className="w-full h-[50vh] p-10 flex flex-col items-center justify-center border-b border-dashed border-slate-300 last:border-0 relative">
                 <div className="absolute top-2 right-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                   BNG-MASTER-PRO #{1000 + index}
                 </div>
                 <div className="w-[85%] h-[90%]">
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
