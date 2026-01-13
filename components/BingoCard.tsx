
import React from 'react';
import { BingoItem, GridSize, BingoTheme, CenterIcon } from '../types';
import { Star, Heart, Trophy } from 'lucide-react';

interface BingoCardProps {
  title: string;
  gridSize: GridSize;
  items: (BingoItem | string | null)[];
  theme: BingoTheme;
  centerIcon?: CenterIcon;
}

const BingoCard: React.FC<BingoCardProps> = ({ title, gridSize, items, theme, centerIcon = 'none' }) => {
  const gridCols = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  };

  const isCenterCell = (idx: number) => {
    if (gridSize % 2 === 0) return false;
    return idx === Math.floor((gridSize * gridSize) / 2);
  };

  const getFontSize = (text: string) => {
    const len = text.length;
    // Lógica mais agressiva para evitar cortes
    if (len > 40) return 'text-[0.45rem] leading-[1]';
    if (len > 30) return 'text-[0.55rem] leading-[1]';
    if (len > 20) return 'text-[0.65rem] leading-[1]';
    if (len > 12) return 'text-[0.8rem] leading-[1]';
    if (len > 5) return 'text-[1.2rem] md:text-[1.5rem] leading-[1]';
    return 'text-2xl md:text-4xl font-black';
  };

  const renderIcon = () => {
    const props = { size: 28, fill: theme.cellTextColor, className: "opacity-80" };
    switch (centerIcon) {
      case 'star': return <Star {...props} />;
      case 'heart': return <Heart {...props} />;
      case 'trophy': return <Trophy {...props} />;
      default: return null;
    }
  };

  return (
    <div 
      className="bg-white w-full flex flex-col overflow-hidden shadow-sm mx-auto select-none border-0"
      style={{ boxShadow: `0 0 0 8px ${theme.primaryColor}` }}
    >
      <div 
        className="py-4 px-6 text-center shrink-0 border-b-2 flex items-center justify-center"
        style={{ backgroundColor: theme.primaryColor, color: theme.headerTextColor, borderColor: theme.primaryColor }}
      >
        <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase truncate w-full leading-tight drop-shadow-sm">
          {title}
        </h2>
      </div>

      <div className={`grid ${gridCols[gridSize]} bg-slate-200 gap-[1px]`}>
        {items.map((item, idx) => {
          const isString = typeof item === 'string';
          const isCenter = isCenterCell(idx);
          
          return (
            <div 
              key={idx} 
              className="aspect-square flex flex-col items-center justify-center p-1 text-center relative overflow-hidden bg-white"
              style={{ 
                backgroundColor: theme.cellBgColor, 
                color: theme.cellTextColor
              }}
            >
              {isCenter && centerIcon !== 'none' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-5 scale-125">
                  {renderIcon()}
                </div>
              )}
              
              {item ? (
                isString ? (
                  <div className="flex flex-col items-center justify-center h-full w-full gap-0.5 overflow-hidden">
                    {isCenter && centerIcon !== 'none' && <div className="mb-0.5">{renderIcon()}</div>}
                    <span className={`font-black w-full break-words flex items-center justify-center px-0.5 tracking-tight ${getFontSize(item)}`}>
                      {item}
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-1">
                    <img 
                      src={item.url} 
                      alt={item.name} 
                      className="max-w-[90%] max-h-[90%] object-contain pointer-events-none" 
                    />
                  </div>
                )
              ) : (
                <div className="w-full h-full border border-dashed border-slate-100 flex items-center justify-center bg-slate-50/20" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BingoCard;
