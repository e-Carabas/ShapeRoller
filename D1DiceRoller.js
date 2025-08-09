import { useState } from 'react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"
import { Lock, LockOpen, RefreshCw } from "lucide-react"

export default function DiceRoller() {
  const dieFaces = ["\\V", "v", "v", "v", "x", "x", "x", ">x<"]
  const [diceResults, setDiceResults] = useState<string[]>([])
  const [lockedDice, setLockedDice] = useState<boolean[]>(Array(6).fill(false))
  const [removedDice, setRemovedDice] = useState<boolean[]>(Array(6).fill(false))
  
  const rollSingleDie = (): string => {
    const randomIndex = Math.floor(Math.random() * dieFaces.length)
    return dieFaces[randomIndex]
  }
  
  const rollDice = (keepLocked = true) => {
    const results = diceResults.length > 0 ? [...diceResults] : Array(6).fill(null)
    results.forEach((_, index) => {
      if ((!keepLocked || !lockedDice[index]) && !removedDice[index]) {
        results[index] = rollSingleDie()
      }
    })
    setDiceResults(results)
  }
  
  const toggleLockDie = (index: number) => {
    const newLocked = [...lockedDice]
    newLocked[index] = !newLocked[index]
    setLockedDice(newLocked)
  }
  
  const toggleRemoveDie = (index: number) => {
    const newRemoved = [...removedDice]
    newRemoved[index] = !newRemoved[index]
    setRemovedDice(newRemoved)
    if (newRemoved[index]) {
      const newLocked = [...lockedDice]
      newLocked[index] = false
      setLockedDice(newLocked)
    }
  }

  const transformXtoV = () => {
    if (!diceResults.includes("x")) return
    const newResults = [...diceResults]
    const xIndex = newResults.findIndex((r, i) => r === "x" && !lockedDice[i] && !removedDice[i])
    if (xIndex !== -1) {
      newResults[xIndex] = "v"
      setDiceResults(newResults)
    }
  }

  // Custom SVG components for each die face
  const XIcon = ({ className = "" }) => (
    <svg viewBox="0 0 31.28 31.28" className={`w-16 h-16 ${className}`}>
      <polygon fill="#fd0" points="31.28 4.59 26.69 0 15.64 11.05 4.59 0 0 4.59 11.05 15.64 0 26.69 4.59 31.28 15.64 20.23 26.69 31.28 31.28 26.69 20.23 15.64 31.28 4.59"/>
    </svg>
  )

  const BigXIcon = ({ className = "" }) => (
    <svg viewBox="0 0 31.28 31.28" className={`w-16 h-16 ${className}`}>
      <polygon fill="#e50076" points="31.28 4.59 26.69 0 18.33 8.36 18.33 0 12.95 0 12.95 8.36 4.59 0 0 4.59 8.36 12.95 0 12.95 0 18.33 8.36 18.33 0 26.69 4.59 31.28 12.95 22.92 12.95 31.28 18.33 31.28 18.33 22.92 26.69 31.28 31.28 26.69 22.92 18.33 31.28 18.33 31.28 12.95 22.92 12.95 31.28 4.59"/>
    </svg>
  )

  const VIcon = ({ className = "" }) => (
    <svg viewBox="0 0 29.79 29.69" className={`w-16 h-16 ${className}`}>
      <polygon fill="#1d9dd9" points="9.4 19.8 4.48 15.43 0 20.49 10.38 29.69 29.79 4.08 24.4 0 9.4 19.8"/>
    </svg>
  )

  const BigVIcon = ({ className = "" }) => (
    <svg viewBox="0 0 38.64 29.69" className={`w-16 h-16 ${className}`}>
      <polygon fill="#1d9dd9" points="22.37 .07 8.62 18.22 4.1 14.22 0 18.85 9.52 27.28 27.3 3.81 22.37 .07"/>
      <rect fill="#1d9dd9" x="9.28" y="11.75" width="33.12" height="6.19" transform="translate(-1.92 25.68) rotate(-51.18)"/>
    </svg>
  )

  const renderDieFace = (face: string) => {
    switch(face) {
      case "\\V":
        return <BigVIcon />
      case "v":
        return <VIcon />
      case "x":
        return <XIcon />
      case ">x<":
        return <BigXIcon />
      default:
        return null
    }
  }

  const activeDiceCount = 6 - removedDice.filter(Boolean).length
  const hasTransformableX = diceResults.some((r, i) => r === "x" && !lockedDice[i] && !removedDice[i])

  // Count occurrences of each symbol
  const resultCounts = {
    "\\V": diceResults.filter((r, i) => r === "\\V" && !removedDice[i]).length,
    "v": diceResults.filter((r, i) => r === "v" && !removedDice[i]).length,
    "x": diceResults.filter((r, i) => r === "x" && !removedDice[i]).length,
    ">x<": diceResults.filter((r, i) => r === ">x<" && !removedDice[i]).length
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Dice Roller</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* Dice display */}
        {diceResults.length > 0 ? (
          <div className="grid grid-cols-3 gap-6 mb-10">
            {diceResults.map((result, index) => (
              <div 
                key={index} 
                className={`relative flex flex-col items-center justify-center p-6 rounded-xl shadow-sm min-w-[120px] min-h-[120px]
                  ${removedDice[index] ? 'opacity-30 bg-gray-200' : lockedDice[index] ? 'bg-green-50' : 'bg-gray-100'}`}
                onClick={() => !lockedDice[index] && toggleRemoveDie(index)}
              >
                {!removedDice[index] && (
                  <button 
                    className={`absolute top-2 right-2 p-1.5 rounded-full bg-white shadow
                      ${lockedDice[index] ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLockDie(index)
                    }}
                  >
                    {lockedDice[index] ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      <LockOpen className="w-5 h-5" />
                    )}
                  </button>
                )}
                <div className="w-16 h-16 flex items-center justify-center mb-2">
                  {removedDice[index] ? (
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  ) : (
                    renderDieFace(result)
                  )}
                </div>
                <span className="text-sm font-medium text-gray-600">Die {index + 1}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 mb-10">
            {Array(6).fill(null).map((_, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-xl shadow-sm min-w-[120px] min-h-[120px]"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
                <span className="text-sm font-medium text-gray-600">Die {index + 1}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-col w-full gap-4 max-w-md">
          <div className="flex gap-4">
            <Button 
              onClick={() => rollDice()}
              className="flex-1 h-12 text-lg"
              disabled={activeDiceCount === 0}
            >
              {diceResults.length > 0 ? 'Reroll Unlocked' : 'Roll Dice'}
            </Button>
            
            {hasTransformableX && (
              <Button 
                variant="outline"
                onClick={transformXtoV}
                className="flex-1 h-12 text-lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                x → v
              </Button>
            )}
          </div>
          
          {diceResults.length > 0 && (
            <Button 
              variant="outline"
              onClick={() => {
                setLockedDice(Array(6).fill(false))
                setRemovedDice(Array(6).fill(false))
                rollDice(false)
              }}
              className="w-full h-12 text-lg"
            >
              Reset & Roll All
            </Button>
          )}
        </div>
        
        {/* New Results summary - spread across screen */}
        {diceResults.length > 0 && activeDiceCount > 0 && (
          <div className="mt-10 w-full">
            <h3 className="font-semibold text-lg mb-6 text-center">Results</h3>
            <div className="flex justify-between px-[10%]"> {/* 10% padding on each side */}
              <div className="flex flex-col items-center">
                <BigVIcon className="w-12 h-12" />
                <span className="text-2xl font-bold mt-2">{resultCounts["\\V"]}</span>
              </div>
              <div className="flex flex-col items-center">
                <VIcon className="w-12 h-12" />
                <span className="text-2xl font-bold mt-2">{resultCounts["v"]}</span>
              </div>
              <div className="flex flex-col items-center">
                <XIcon className="w-12 h-12" />
                <span className="text-2xl font-bold mt-2">{resultCounts["x"]}</span>
              </div>
              <div className="flex flex-col items-center">
                <BigXIcon className="w-12 h-12" />
                <span className="text-2xl font-bold mt-2">{resultCounts[">x<"]}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}