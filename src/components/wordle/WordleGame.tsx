import { useState, useEffect, useCallback } from "react";
import { GameGrid } from "./GameGrid";
import { Keyboard } from "./Keyboard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Trophy, X } from "lucide-react";

// Simple word list for the game
const WORD_LIST = [
  'REACT', 'HELLO', 'WORLD', 'CODES', 'HAPPY', 'MUSIC', 'DANCE', 'LIGHT', 'MAGIC', 'DREAM',
  'PEACE', 'OCEAN', 'TIGER', 'SPACE', 'GRACE', 'FLAME', 'BRAVE', 'SHINE', 'SMILE', 'STORM'
];

type GameState = 'playing' | 'won' | 'lost';

export const WordleGame = () => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [letterStates, setLetterStates] = useState<Record<string, 'correct' | 'wrong-position' | 'not-in-word'>>({});
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set());
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const { toast } = useToast();

  const initializeGame = useCallback(() => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setTargetWord(randomWord);
    setGuesses([]);
    setCurrentGuess('');
    setCurrentRow(0);
    setGameState('playing');
    setLetterStates({});
    setRevealedRows(new Set());
    setShakeRow(null);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const updateLetterStates = (guess: string) => {
    const newStates = { ...letterStates };
    
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const targetLetter = targetWord[i];
      
      if (letter === targetLetter) {
        newStates[letter] = 'correct';
      } else if (targetWord.includes(letter) && newStates[letter] !== 'correct') {
        newStates[letter] = 'wrong-position';
      } else if (!targetWord.includes(letter)) {
        newStates[letter] = 'not-in-word';
      }
    }
    
    setLetterStates(newStates);
  };

  const submitGuess = async () => {
    if (currentGuess.length !== 5) {
      setShakeRow(currentRow);
      setTimeout(() => setShakeRow(null), 500);
      toast({
        title: "Invalid guess",
        description: "Please enter a 5-letter word",
        variant: "destructive",
      });
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    
    // Animate the reveal
    setTimeout(() => {
      setRevealedRows(prev => new Set([...prev, currentRow]));
      updateLetterStates(currentGuess);
    }, 100);

    if (currentGuess === targetWord) {
      setTimeout(() => {
        setGameState('won');
        toast({
          title: "🎉 Congratulations!",
          description: `You guessed the word in ${newGuesses.length} tries!`,
        });
      }, 2000);
    } else if (newGuesses.length >= 6) {
      setTimeout(() => {
        setGameState('lost');
        toast({
          title: "Game Over",
          description: `The word was ${targetWord}`,
          variant: "destructive",
        });
      }, 2000);
    } else {
      setCurrentRow(currentRow + 1);
    }

    setCurrentGuess('');
  };

  const handleKeyPress = (key: string) => {
    if (gameState !== 'playing') return;
    if (currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key);
    }
  };

  const handleDelete = () => {
    if (gameState !== 'playing') return;
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    const key = event.key.toUpperCase();
    
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      handleDelete();
    } else if (/^[A-Z]$/.test(key)) {
      handleKeyPress(key);
    }
  }, [gameState, currentGuess, submitGuess, handleDelete, handleKeyPress]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Wordle</h1>
          <p className="text-muted-foreground">Guess the 5-letter word in 6 tries</p>
        </div>

        {/* Game Grid */}
        <div className="mb-8">
          <GameGrid
            guesses={guesses}
            currentGuess={currentGuess}
            targetWord={targetWord}
            currentRow={currentRow}
            revealedRows={revealedRows}
            shakeRow={shakeRow}
          />
        </div>

        {/* Game Status */}
        {gameState !== 'playing' && (
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              {gameState === 'won' ? (
                <Trophy className="w-8 h-8 text-correct mr-2" />
              ) : (
                <X className="w-8 h-8 text-destructive mr-2" />
              )}
              <span className="text-xl font-bold">
                {gameState === 'won' ? 'You Won!' : 'Game Over'}
              </span>
            </div>
            {gameState === 'lost' && (
              <p className="text-muted-foreground mb-4">
                The word was: <span className="font-bold text-foreground">{targetWord}</span>
              </p>
            )}
            <Button onClick={initializeGame} className="bg-correct hover:bg-correct/90 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        )}

        {/* Virtual Keyboard */}
        <Keyboard
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onEnter={submitGuess}
          letterStates={letterStates}
          disabled={gameState !== 'playing'}
        />
      </div>
    </div>
  );
};