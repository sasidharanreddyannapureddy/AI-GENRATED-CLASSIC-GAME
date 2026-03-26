import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 180;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      if (gameOver) return;
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': if (directionRef.current.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': case 's': case 'S': if (directionRef.current.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': case 'a': case 'A': if (directionRef.current.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': case 'd': case 'D': if (directionRef.current.x !== -1) setDirection({ x: 1, y: 0 }); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;
    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };
        directionRef.current = direction;

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true); return prevSnake;
        }
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true); return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => { const newScore = s + 10; onScoreChange(newScore); return newScore; });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, generateFood, onScoreChange]);

  return (
    <div className="relative group p-4 bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm border border-white/60">
      <div 
        className="relative overflow-hidden rounded-2xl shadow-inner border-4 border-green-800 game-board"
        style={{
          width: 'min(85vw, 450px)',
          height: 'min(85vw, 450px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          backgroundSize: `${100/(GRID_SIZE/2)}% ${100/(GRID_SIZE/2)}%`,
          backgroundPosition: `0 0, ${100/GRID_SIZE}% ${100/GRID_SIZE}%`
        }}
      >
        {/* Food (Apple) */}
        <div
          className="z-10 flex items-center justify-center relative"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        >
          <div className="w-[80%] h-[80%] bg-red-500 rounded-full shadow-sm border-b-2 border-red-700 relative">
            {/* Apple Leaf */}
            <div className="absolute -top-1 right-0 w-2 h-2 bg-green-500 rounded-tl-full rounded-br-full border border-green-700 transform -rotate-12"></div>
            {/* Apple Stem */}
            <div className="absolute -top-1 left-1/2 w-0.5 h-1.5 bg-amber-800 transform -translate-x-1/2"></div>
          </div>
        </div>

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          const isTail = index === snake.length - 1;
          
          let rotation = 0;
          if (isHead) {
            if (direction.y === -1) rotation = 0;
            else if (direction.x === 1) rotation = 90;
            else if (direction.y === 1) rotation = 180;
            else if (direction.x === -1) rotation = 270;
          }

          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`z-10 flex items-center justify-center`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            >
              <div 
                className={`${isHead ? 'bg-blue-500 border-blue-700' : 'bg-blue-400 border-blue-600'} w-full h-full border-b-2 border-r-2`}
                style={{
                  borderRadius: isHead ? '40% 40% 10% 10%' : isTail ? '10% 10% 40% 40%' : '15%',
                  transform: isHead ? `rotate(${rotation}deg) scale(1.05)` : 'scale(0.95)',
                  zIndex: isHead ? 20 : 10
                }}
              >
                {isHead && (
                  <div className="relative w-full h-full">
                    {/* Eyes */}
                    <div className="absolute top-[20%] left-[15%] w-[25%] h-[25%] bg-white rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-[40%] h-[40%] bg-black rounded-full translate-y-[-10%]" />
                    </div>
                    <div className="absolute top-[20%] right-[15%] w-[25%] h-[25%] bg-white rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-[40%] h-[40%] bg-black rounded-full translate-y-[-10%]" />
                    </div>
                    {/* Tongue */}
                    <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[10%] h-[25%] bg-red-500 rounded-t-full" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Overlays */}
        {gameOver && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-30 backdrop-blur-sm"
          >
            <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center border-4 border-amber-200">
              <h2 className="text-4xl font-black text-amber-500 mb-2 drop-shadow-sm">
                Game Over!
              </h2>
              <p className="text-xl text-gray-600 font-bold mb-6">
                You collected <span className="text-red-500">{score / 10}</span> apples!
              </p>
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-green-500 text-white text-xl font-bold rounded-xl shadow-[0_4px_0_rgb(21,128,61)] hover:bg-green-400 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20 backdrop-blur-sm">
            <div className="bg-white/90 px-8 py-4 rounded-2xl shadow-lg border-2 border-white">
              <h2 className="text-3xl font-black text-blue-500">PAUSED</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
