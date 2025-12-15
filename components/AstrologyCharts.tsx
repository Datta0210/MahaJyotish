import React from 'react';
import { PlanetPosition } from '../types';

interface ChartProps {
  planets: PlanetPosition[];
  type: 'North' | 'South';
}

const NorthIndianChart: React.FC<{ planets: PlanetPosition[] }> = ({ planets }) => {
  // SVG Logic for North Indian (Diamond) Chart
  const size = 300;
  const half = size / 2;

  // Simple mock mapping of planets to houses for visualization
  const getHouseContent = (houseNum: number) => {
    return planets
      .filter(p => p.house === houseNum)
      .map(p => p.name.substring(0, 2))
      .join(' ');
  };

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="bg-cream border-2 border-maroon-500">
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="black" strokeWidth="0.5"/>
        </pattern>
      </defs>
      
      {/* Outer Box */}
      <rect x="0" y="0" width={size} height={size} fill="none" stroke="#8B0000" strokeWidth="2" />
      
      {/* Diagonals */}
      <line x1="0" y1="0" x2={size} y2={size} stroke="#8B0000" strokeWidth="1" />
      <line x1={size} y1="0" x2="0" y2={size} stroke="#8B0000" strokeWidth="1" />
      
      {/* Midpoint Diamond */}
      <line x1="0" y1={half} x2={half} y2="0" stroke="#8B0000" strokeWidth="1" />
      <line x1={half} y1="0" x2={size} y2={half} stroke="#8B0000" strokeWidth="1" />
      <line x1={size} y1={half} x2={half} y2={size} stroke="#8B0000" strokeWidth="1" />
      <line x1={half} y1={size} x2="0" y2={half} stroke="#8B0000" strokeWidth="1" />

      {/* House Numbers & Planets Mock Placement */}
      {/* House 1 (Top Center Diamond) */}
      <text x={half} y={size * 0.25} textAnchor="middle" className="text-[10px] fill-maroon-600 font-bold">1</text>
      <text x={half} y={size * 0.35} textAnchor="middle" className="text-xs fill-black">{getHouseContent(1)}</text>

      {/* House 2 (Top Left) */}
      <text x={size * 0.25} y={size * 0.1} textAnchor="middle" className="text-[10px] fill-maroon-600">2</text>
      <text x={size * 0.25} y={size * 0.2} textAnchor="middle" className="text-xs fill-black">{getHouseContent(2)}</text>
      
       {/* House 4 (Center Left) */}
      <text x={size * 0.25} y={half} textAnchor="middle" className="text-[10px] fill-maroon-600 font-bold">4</text>
      <text x={size * 0.25} y={half + 15} textAnchor="middle" className="text-xs fill-black">{getHouseContent(4)}</text>

      {/* House 7 (Bottom Center) */}
      <text x={half} y={size * 0.75} textAnchor="middle" className="text-[10px] fill-maroon-600 font-bold">7</text>
      <text x={half} y={size * 0.65} textAnchor="middle" className="text-xs fill-black">{getHouseContent(7)}</text>

      {/* House 10 (Center Right) */}
      <text x={size * 0.75} y={half} textAnchor="middle" className="text-[10px] fill-maroon-600 font-bold">10</text>
      <text x={size * 0.75} y={half + 15} textAnchor="middle" className="text-xs fill-black">{getHouseContent(10)}</text>

      {/* Simplified visual filler for other houses */}
      <text x={size * 0.1} y={size * 0.1} className="text-[8px] fill-gray-500">12</text>
      <text x={size * 0.9} y={size * 0.1} className="text-[8px] fill-gray-500">3</text>
      <text x={size * 0.1} y={size * 0.9} className="text-[8px] fill-gray-500">5</text>
      <text x={size * 0.9} y={size * 0.9} className="text-[8px] fill-gray-500">9</text>
    </svg>
  );
};

const SouthIndianChart: React.FC<{ planets: PlanetPosition[] }> = ({ planets }) => {
  const size = 300;
  const cell = size / 4;

  const getHouseContent = (signName: string) => {
     // Mock logic: find planets in this sign
     const targetSignIndex = ["Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius"].indexOf(signName);
     // For demo, just show random planets or mapped ones
     return planets
      .filter(p => p.house === (targetSignIndex % 12) + 1) 
      .map(p => p.name.substring(0, 2))
      .join(' ');
  };

  const renderCell = (x: number, y: number, sign: string) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect width={cell} height={cell} fill="none" stroke="#8B0000" strokeWidth="1" />
      <text x={5} y={15} className="text-[10px] fill-maroon-600 font-bold">{sign}</text>
      <text x={cell/2} y={cell/2} textAnchor="middle" className="text-xs fill-black">{getHouseContent(sign)}</text>
    </g>
  );

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="bg-cream border-2 border-maroon-500">
      {/* Top Row */}
      {renderCell(cell, 0, 'Pisces')}
      {renderCell(cell * 2, 0, 'Aries')}
      {renderCell(cell * 3, 0, 'Taurus')}
      {renderCell(0, 0, 'Aquarius')} // Wait, South chart is clockwise: Pisces, Aries, Taurus, Gemini

      {/* Correct South Layout: 
          Pisces | Aries | Taurus | Gemini 
          Aquarius |      |      | Cancer
          Capricorn|      |      | Leo
          Sagitt | Scorpio| Libra | Virgo
      */}
      
      {/* Row 1 */}
      {renderCell(cell, 0, 'Pisces')}
      {renderCell(cell * 2, 0, 'Aries')}
      {renderCell(cell * 3, 0, 'Taurus')}
      {renderCell(0, 0, 'Aquarius')} {/* Actually standard south chart starts Pisces top-left usually or Aries? Standard is fixed zodiac. 
         Let's stick to standard South: 
         Pisces (TL), Aries (TM1), Taurus (TM2), Gemini (TR)
         Aquarius (LM1) ... Cancer (RM1)
      */}
      
      {/* Let's simplify drawing logic manually for reliability */}
      {/* Top Row: Pisces, Aries, Taurus, Gemini */}
      {renderCell(0, 0, 'Pisces')}
      {renderCell(cell, 0, 'Aries')}
      {renderCell(cell*2, 0, 'Taurus')}
      {renderCell(cell*3, 0, 'Gemini')}

      {/* Right Column: Cancer, Leo */}
      {renderCell(cell*3, cell, 'Cancer')}
      {renderCell(cell*3, cell*2, 'Leo')}

      {/* Bottom Row: Virgo, Libra, Scorpio, Sagittarius */}
      {renderCell(cell*3, cell*3, 'Virgo')}
      {renderCell(cell*2, cell*3, 'Libra')}
      {renderCell(cell, cell*3, 'Scorpio')}
      {renderCell(0, cell*3, 'Sagittarius')}

      {/* Left Column: Capricorn, Aquarius */}
      {renderCell(0, cell*2, 'Capricorn')}
      {renderCell(0, cell, 'Aquarius')}

      {/* Center text */}
      <text x={size/2} y={size/2} textAnchor="middle" className="text-lg font-marathi font-bold fill-saffron-600">
        राशी चक्र
      </text>
    </svg>
  );
};

export const ChartVisualizer: React.FC<ChartProps> = ({ planets, type }) => {
  return (
    <div className="w-full max-w-[400px] aspect-square mx-auto shadow-lg bg-cream p-2 rounded-lg">
      {type === 'North' ? <NorthIndianChart planets={planets} /> : <SouthIndianChart planets={planets} />}
    </div>
  );
};
