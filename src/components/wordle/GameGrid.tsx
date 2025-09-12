import { cn } from "@/lib/utils";

interface GameGridProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
  currentRow: number;
  revealedRows: Set<number>;
  shakeRow: number | null;
}

type LetterState = 'correct' | 'wrong-position' | 'not-in-word' | 'empty';

const getLetterState = (letter: string, position: number, word: string, targetWord: string): LetterState => {
  if (!letter) return 'empty';
  
  const targetLetter = targetWord[position];
  if (letter === targetLetter) return 'correct';
  if (targetWord.includes(letter)) return 'wrong-position';
  return 'not-in-word';
};

const getTileClasses = (state: LetterState, isRevealed: boolean) => {
  const baseClasses = "w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold uppercase transition-all duration-300";
  
  if (!isRevealed) {
    return cn(baseClasses, "border-tile-border bg-empty text-foreground");
  }
  
  switch (state) {
    case 'correct':
      return cn(baseClasses, "border-correct bg-correct text-white");
    case 'wrong-position':
      return cn(baseClasses, "border-wrong-position bg-wrong-position text-white");
    case 'not-in-word':
      return cn(baseClasses, "border-not-in-word bg-not-in-word text-white");
    default:
      return cn(baseClasses, "border-tile-border bg-empty text-foreground");
  }
};

export const GameGrid = ({ guesses, currentGuess, targetWord, currentRow, revealedRows, shakeRow }: GameGridProps) => {
  const rows = Array.from({ length: 6 }, (_, rowIndex) => {
    let word = '';
    
    if (rowIndex < guesses.length) {
      word = guesses[rowIndex];
    } else if (rowIndex === currentRow) {
      word = currentGuess;
    }
    
    return word.padEnd(5, ' ');
  });

  return (
    <div className="grid grid-rows-6 gap-2 p-4">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={cn(
            "grid grid-cols-5 gap-2 transition-transform duration-500",
            shakeRow === rowIndex && "animate-shake-row"
          )}
        >
          {Array.from({ length: 5 }, (_, colIndex) => {
            const letter = row[colIndex].trim();
            const isRevealed = revealedRows.has(rowIndex);
            const state = rowIndex < guesses.length 
              ? getLetterState(letter, colIndex, guesses[rowIndex], targetWord)
              : 'empty';
            
            return (
              <div
                key={colIndex}
                className={cn(
                  getTileClasses(state, isRevealed),
                  letter && !isRevealed && rowIndex === currentRow && "animate-bounce-tile border-primary",
                  isRevealed && "animate-flip-tile"
                )}
                style={{
                  animationDelay: isRevealed ? `${colIndex * 100}ms` : '0ms'
                }}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};