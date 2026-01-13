
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
    if (len > 35) return 'text-[0.5rem]';
    if (len > 25) return 'text-[0.6rem]';
    if (len > 18) return 'text-[0.7rem]';
    if (len > 12) return 'text-[0.85rem]';
    if (len > 8) return 'text-[1.1rem]';
    return 'text-2xl md:text-3xl';
  };

  const renderIcon = () => {
    const props = { size: 32, fill: theme.cellTextColor, className: "opacity-80" };
    switch (centerIcon) {
      case 'star': return <Star {...props} />;
      case 'heart': return <Heart {...props} />;
      case 'trophy': return <Trophy {...props} />;
      default: return null;
    }
  };

  return (
    <div 
      className="bg-white w-full aspect-[4/5] flex flex-col overflow-hidden shadow-sm mx-auto select-none border-0"
      style={{ boxShadow: `0 0 0 8px ${theme.primaryColor}` }}
    >
      <div 
        className="py-5 px-6 text-center shrink-0 border-b-2 flex items-center justify-center"
        style={{ backgroundColor: theme.primaryColor, color: theme.headerTextColor, borderColor: theme.primaryColor }}
      >
        <h2 className="text-4xl md:text-5xl font-[1000] tracking-tighter uppercase truncate w-full leading-none drop-shadow-sm">
          {title}
        </h2>
      </div>

      <div className={`grid ${gridCols[gridSize]} flex-1 bg-slate-300 gap-[1px] border-b border-slate-300`}>
        {items.map((item, idx) => {
          const isString = typeof item === 'string';
          const isCenter = isCenterCell(idx);
          
          return (
            <div 
              key={idx} 
              className={`aspect-square flex flex-col items-center justify-center p-2 text-center relative overflow-hidden transition-colors ${isCenter ? 'z-10 shadow-inner' : ''}`}
              style={{ 
                backgroundColor: isCenter ? `${theme.primaryColor}15` : theme.cellBgColor, 
                color: theme.cellTextColor
              }}
            >
              {isCenter && centerIcon !== 'none' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-10 scale-150 -rotate-12">
                  {renderIcon()}
                </div>
              )}
              
              {item ? (
                isString ? (
                  <div className="flex flex-col items-center justify-center h-full w-full gap-1">
                    {isCenter && centerIcon !== 'none' && <div className="mb-0.5">{renderIcon()}</div>}
                    <span className={`font-black leading-[0.9] w-full break-words flex items-center justify-center px-1 tracking-tight ${getFontSize(item)}`}>
                      {item}
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-1.5">
                    <img 
                      src={item.url} 
                      alt={item.name} 
                      className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-sm" 
                    />
                  </div>
                )
              ) : (
                <div className="w-full h-full border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center bg-slate-50/50" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BingoCard;
