import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  letterStates: Record<string, 'correct' | 'wrong-position' | 'not-in-word'>;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const getKeyClasses = (letter: string, letterStates: Record<string, string>) => {
  const state = letterStates[letter];
  const baseClasses = "h-12 font-bold text-sm transition-all duration-200 hover:scale-105";
  
  switch (state) {
    case 'correct':
      return cn(baseClasses, "bg-correct text-white border-correct hover:bg-correct/90");
    case 'wrong-position':
      return cn(baseClasses, "bg-wrong-position text-white border-wrong-position hover:bg-wrong-position/90");
    case 'not-in-word':
      return cn(baseClasses, "bg-not-in-word text-white border-not-in-word hover:bg-not-in-word/90");
    default:
      return cn(baseClasses, "bg-secondary text-secondary-foreground hover:bg-secondary/80");
  }
};

export const Keyboard = ({ onKeyPress, onDelete, onEnter, letterStates, disabled }: KeyboardProps) => {
  return (
    <div className="w-full max-w-lg mx-auto p-4 space-y-2">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {rowIndex === 2 && (
            <Button
              onClick={onEnter}
              disabled={disabled}
              className={cn(
                "h-12 px-4 font-bold text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-200 hover:scale-105",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              ENTER
            </Button>
          )}
          
          {row.map((letter) => (
            <Button
              key={letter}
              onClick={() => onKeyPress(letter)}
              disabled={disabled}
              className={cn(
                "w-10 px-2",
                getKeyClasses(letter, letterStates),
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {letter}
            </Button>
          ))}
          
          {rowIndex === 2 && (
            <Button
              onClick={onDelete}
              disabled={disabled}
              className={cn(
                "h-12 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-200 hover:scale-105",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <Delete size={18} />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};