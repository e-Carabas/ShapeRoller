import { useState } from 'react';
import { Button } from "/components/ui/button";
import { Card, CardContent, CardHeader } from "/components/ui/card";
import { Lock, LockOpen } from "lucide-react";

export default function DiceRoller() {
  const dieFaces = ["V", "v", "v", "v", "x", "x", "x", "X"];
  const [diceResults, setDiceResults] = useState<string[]>([]);
  const [lockedDice, setLockedDice] = useState<boolean[]>(Array(6).fill(false));
  const [removedDice, setRemovedDice] = useState<boolean[]>(Array(6).fill(false));

  const activeDiceCount = 6 - removedDice.filter(Boolean).length;
  const hasTransformableX = diceResults.some((r, i) => r === "x" && !lockedDice[i] && !removedDice[i]);

  const rollSingleDie = (): string => {
    const randomIndex = Math.floor(Math.random() * dieFaces.length);
    return dieFaces[randomIndex];
  };

  const rollDice = (keepLocked = true) => {
    const results = diceResults.length > 0 ? [...diceResults] : Array(6).fill("");
    const newResults = results.map((result, index) => {
      if ((!keepLocked || !lockedDice[index]) && !removedDice[index]) {
        return rollSingleDie();
      }
      return result;
    });
    setDiceResults(newResults);
  };

  const toggleLockDie = (index: number) => {
    const newLocked = [...lockedDice];
    newLocked[index] = !newLocked[index];
    setLockedDice(newLocked);
  };

  const toggleRemoveDie = (index: number) => {
    const newRemoved = [...removedDice];
    newRemoved[index] = !newRemoved[index];
    setRemovedDice(newRemoved);
    if (newRemoved[index]) {
      const newLocked = [...lockedDice];
      newLocked[index] = false;
      setLockedDice(newLocked);
    }
  };

  const transformXtoV = () => {
    const newResults = [...diceResults];
    const xIndex = newResults.findIndex((r, i) => r === "x" && !lockedDice[i] && !removedDice[i]);
    if (xIndex !== -1) {
      newResults[xIndex] = "v";
      setDiceResults(newResults);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <Card className="w-full max-w-2xl mx-auto bg-white border border-gray-200 shadow-lg">
        <CardHeader>
          <div className="flex justify-center">
            <img 
              src="https://github.com/e-Carabas/ShapeRoller/raw/main/LogoD1.png" 
              alt="ShapeRoller Logo"
              className="h-24 w-auto object-contain"
            />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="grid grid-cols-3 gap-6 mb-10">
            {Array(6).fill(null).map((_, index) => (
              <div 
                key={index} 
                className={`relative flex flex-col items-center justify-center p-6 rounded-xl shadow-sm min-w-[120px] min-h-[120px] border border-gray-200
                  ${removedDice[index] ? 'opacity-30 bg-gray-100' : lockedDice[index] ? 'bg-green-50' : 'bg-white'}`}
                onClick={() => !lockedDice[index] && toggleRemoveDie(index)}
              >
                {!removedDice[index] && (
                  <button 
                    className={`absolute top-2 right-2 p-1.5 rounded-full bg-gray-100 shadow
                      ${lockedDice[index] ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLockDie(index);
                    }}
                  >
                    {lockedDice[index] ? <Lock className="w-5 h-5" /> : <LockOpen className="w-5 h-5" />}
                  </button>
                )}
                <div className="w-16 h-16 flex items-center justify-center mb-2">
                  {!removedDice[index] ? (
                    diceResults[index] ? (
                      diceResults[index] === "V" ? <BigVIcon /> :
                      diceResults[index] === "v" ? <VIcon /> :
                      diceResults[index] === "x" ? <XIcon /> :
                      <BigXIcon />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-full border border-gray-200"></div>
                    )
                  ) : (
                    <div className="w-12 h-12 bg-transparent"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-500">Dado {index + 1}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col w-full gap-4 max-w-md">
            <div className="flex gap-4">
              <Button 
                onClick={() => rollDice()}
                className="flex-1 h-12 text-lg bg-[#1c9cd8] hover:bg-[#1685c2] text-black"
                disabled={activeDiceCount === 0}
              >
                <RollDiceIcon className="w-6 h-6 mr-2" />
                {diceResults.length > 0 ? 'Rilancia sbloccati' : 'Lancia dadi'}
              </Button>
              
              {hasTransformableX && (
                <Button 
                  onClick={transformXtoV}
                  className="flex-1 h-12 bg-[#ffdd00] hover:bg-[#e6c700]"
                >
                  <TransformIcon className="w-6 h-6 mr-2" />
                  x → v
                </Button>
              )}
            </div>
            
            {diceResults.length > 0 && (
              <Button 
                onClick={() => {
                  setLockedDice(Array(6).fill(false));
                  setRemovedDice(Array(6).fill(false));
                  rollDice(false);
                }}
                className="w-full h-12 text-lg bg-[#e50075] hover:bg-[#cc0068] text-black"
              >
                Resetta & Lancia tutti
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Icon components
const XIcon = () => (
  <svg viewBox="0 0 31.28 31.28" className="w-16 h-16">
    <polygon fill="#fd0" points="31.28 4.59 26.69 0 15.64 11.05 4.59 0 0 4.59 11.05 15.64 0 26.69 4.59 31.28 15.64 20.23 26.69 31.28 31.28 26.69 20.23 15.64 31.28 4.59"/>
  </svg>
);

const BigXIcon = () => (
  <svg viewBox="0 0 31.28 31.28" className="w-16 h-16">
    <polygon fill="#e50076" points="31.28 4.59 26.69 0 18.33 8.36 18.33 0 12.95 0 12.95 8.36 4.59 0 0 4.59 8.36 12.95 0 12.95 0 18.33 8.36 18.33 0 26.69 4.59 31.28 12.95 22.92 12.95 31.28 18.33 31.28 18.33 22.92 26.69 31.28 31.28 26.69 22.92 18.33 31.28 18.33 31.28 12.95 22.92 12.95 31.28 4.59"/>
  </svg>
);

const VIcon = () => (
  <svg viewBox="0 0 29.79 29.69" className="w-16 h-16">
    <polygon fill="#1d9dd9" points="9.4 19.8 4.48 15.43 0 20.49 10.38 29.69 29.79 4.08 24.4 0 9.4 19.8"/>
  </svg>
);

const BigVIcon = () => (
  <svg viewBox="0 0 38.64 29.69" className="w-16 h-16">
    <polygon fill="#1d9dd9" points="22.37 .07 8.62 18.22 4.1 14.22 0 18.85 9.52 27.28 27.3 3.81 22.37 .07"/>
    <rect fill="#1d9dd9" x="9.28" y="11.75" width="33.12" height="6.19" transform="translate(-1.92 25.68) rotate(-51.18)"/>
  </svg>
);

const RollDiceIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 30.55 26.98">
    <g>
      <path d="M23.59,21.63l-2.21-3.83c-1.34,1.92-3.58,3.18-6.11,3.18-2.7,0-5.07-1.44-6.38-3.59-.25-.39-.45-.81-.61-1.25-.16-.4-.28-.82-.36-1.25h1.65l-1.64-2.84-3.14-5.45-2.85,4.94-1.94,3.35h1.86c.05.42.11.84.19,1.25.08.42.19.84.32,1.25,1.67,5.54,6.82,9.59,12.9,9.59,3.84,0,7.32-1.61,9.77-4.21-.6-.18-1.13-.58-1.45-1.14Z"/>
      <path d="M28.69,12.09c-.05-.42-.11-.84-.19-1.25-.09-.42-.19-.84-.32-1.25C26.51,4.05,21.35,0,15.27,0c-.23,0-.46.01-.69.02-.24.01-.48.03-.72.06-.37.03-.73.09-1.09.16-.09.01-.18.03-.27.05-.24.05-.48.1-.72.17-.17.05-.34.09-.51.15-.21.06-.42.13-.63.21-.18.07-.36.13-.53.21-.23.09-.46.19-.68.3-.2.1-.39.2-.58.3-.19.1-.38.21-.57.33-.18.11-.36.23-.54.35-.2.13-.39.27-.58.41-.59.45-1.15.94-1.66,1.49.61.18,1.13.58,1.45,1.14l2.21,3.83c.48-.69,1.08-1.29,1.76-1.77.11-.08.22-.16.34-.23.14-.1.28-.18.43-.26.01,0,.02-.01.03-.02.17-.09.35-.18.54-.26.28-.13.56-.23.86-.32.16-.05.33-.1.51-.13.12-.04.24-.06.36-.07.18-.04.36-.07.54-.08.24-.03.49-.04.74-.04,2.7,0,5.07,1.44,6.38,3.59.25.39.46.81.62,1.25.16.4.28.82.36,1.25h-1.66l1.65,2.85,3.14,5.44,2.85-4.94,1.94-3.35h-1.86Z"/>
    </g>
  </svg>
);

const TransformIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20.86 28.51">
    <path d="M20.69,17.31l-4.59-8.33L11.5.65c-.48-.86-1.67-.86-2.15,0l-4.59,8.33L.17,17.31c-.48.86.12,1.95,1.07,1.95h4.25s-.01.08-.01.13v7.91c0,.67.52,1.22,1.16,1.22h7.56c.64,0,1.17-.55,1.17-1.22v-7.91s0-.09-.01-.13h4.25c.95,0,1.55-1.08,1.07-1.95Z"/>
  </svg>
);
