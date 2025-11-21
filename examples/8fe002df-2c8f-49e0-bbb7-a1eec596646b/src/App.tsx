import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Sparkles } from 'lucide-react';

type Position = {
  x: number;
  y: number;
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Star = Position & { size: number; opacity: number; speed: number };
type Meteor = Position & { length: number; speed: number; opacity: number };
type Nebula = Position & { size: number; hue: number; opacity: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = 'RIGHT';
const GAME_SPEED = 150;
const STAR_COUNT = 50;
const METEOR_COUNT = 3;
const NEBULA_COUNT = 4;

function App() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [stars, setStars] = useState<Star[]>([]);
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [nebulas, setNebulas] = useState<Nebula[]>([]);
  const [showSparkle, setShowSparkle] = useState(false);

  // 初始化背景元素
  useEffect(() => {
    // 初始化星星
    const newStars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.3 + 0.1,
    }));
    setStars(newStars);

    // 初始化流星
    const newMeteors = Array.from({ length: METEOR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: -20,
      length: Math.random() * 100 + 50,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.2,
    }));
    setMeteors(newMeteors);

    // 初始化星云
    const newNebulas = Array.from({ length: NEBULA_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 200 + 100,
      hue: Math.random() * 60 - 30,
      opacity: Math.random() * 0.15 + 0.05,
    }));
    setNebulas(newNebulas);
  }, []);

  // 动画背景元素
  useEffect(() => {
    const animateBackground = () => {
      // 动画星星
      setStars(prevStars =>
        prevStars.map(star => ({
          ...star,
          y: star.y + star.speed,
          ...(star.y > window.innerHeight
            ? { y: -5, x: Math.random() * window.innerWidth }
            : {}),
        }))
      );

      // 动画流星
      setMeteors(prevMeteors =>
        prevMeteors.map(meteor => ({
          ...meteor,
          x: meteor.x + meteor.speed * 2,
          y: meteor.y + meteor.speed * 3,
          ...(meteor.y > window.innerHeight || meteor.x > window.innerWidth
            ? {
                x: Math.random() * window.innerWidth * 0.3,
                y: -20,
                opacity: Math.random() * 0.3 + 0.2,
              }
            : {}),
        }))
      );

      // 动画星云
      setNebulas(prevNebulas =>
        prevNebulas.map(nebula => ({
          ...nebula,
          opacity: nebula.opacity + Math.sin(Date.now() / 1000) * 0.01,
        }))
      );
    };

    const interval = setInterval(animateBackground, 50);
    return () => clearInterval(interval);
  }, []);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const checkCollision = (head: Position) => {
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }
    return snake.slice(1).some((segment) => 
      segment.x === head.x && segment.y === head.y
    );
  };

  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      if (checkCollision(head)) {
        setIsGameOver(true);
        if (score > highScore) {
          setHighScore(score);
        }
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 1);
        setFood(generateFood());
        setShowSparkle(true);
        setTimeout(() => setShowSparkle(false), 500);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, isGameOver, score, highScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
  };

  const getSegmentStyle = (index: number, segment: Position, snake: Position[]) => {
    const isHead = index === 0;
    
    return {
      width: isHead ? CELL_SIZE : CELL_SIZE - 2,
      height: isHead ? CELL_SIZE : CELL_SIZE - 2,
      left: segment.x * CELL_SIZE + (isHead ? 0 : 1),
      top: segment.y * CELL_SIZE + (isHead ? 0 : 1),
      borderRadius: isHead ? '40%' : '50%',
      zIndex: snake.length - index,
      transition: 'all 0.15s',
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center overflow-hidden relative">
      {/* 星云 */}
      {nebulas.map((nebula, index) => (
        <div
          key={`nebula-${index}`}
          className="absolute rounded-full"
          style={{
            width: nebula.size,
            height: nebula.size,
            left: nebula.x,
            top: nebula.y,
            background: `radial-gradient(circle at center, 
              rgba(167, 139, 250, ${nebula.opacity}) 0%,
              rgba(139, 92, 246, ${nebula.opacity * 0.7}) 50%,
              rgba(67, 56, 202, 0) 70%
            )`,
            filter: `hue-rotate(${nebula.hue}deg)`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* 星星 */}
      {stars.map((star, index) => (
        <div
          key={`star-${index}`}
          className="absolute bg-white rounded-full"
          style={{
            width: star.size,
            height: star.size,
            left: star.x,
            top: star.y,
            opacity: star.opacity,
            transition: 'all 0.05s linear',
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})`,
          }}
        />
      ))}

      {/* 流星 */}
      {meteors.map((meteor, index) => (
        <div
          key={`meteor-${index}`}
          className="absolute"
          style={{
            left: meteor.x,
            top: meteor.y,
            width: '2px',
            height: meteor.length,
            background: `linear-gradient(to bottom, 
              rgba(255, 255, 255, ${meteor.opacity}) 0%,
              rgba(255, 255, 255, 0) 100%
            )`,
            transform: 'rotate(45deg)',
            transformOrigin: 'top left',
          }}
        />
      ))}
      
      <div className="text-center relative z-10">
        <div className="mb-4 flex items-center justify-center gap-8">
          <div className="text-white backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
            <span className="text-gray-300">得分：</span> {score}
          </div>
          <div className="text-white flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
            <Trophy className="text-yellow-500" size={20} />
            <span className="text-gray-300">最高分：</span> {highScore}
          </div>
        </div>
        
        <div 
          className="bg-gray-800/30 backdrop-blur-md rounded-lg p-4 border border-white/10"
          style={{
            width: GRID_SIZE * CELL_SIZE + 32,
            height: GRID_SIZE * CELL_SIZE + 32,
            boxShadow: '0 0 40px rgba(167, 139, 250, 0.1)',
          }}
        >
          <div className="relative" style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}>
            {/* 网格图案 */}
            <div className="absolute inset-0 grid grid-cols-20 grid-rows-20">
              {Array.from({ length: 400 }).map((_, i) => (
                <div key={i} className="border border-white/5" />
              ))}
            </div>
            
            {/* 蛇 */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`absolute ${
                  index === 0 
                    ? 'bg-gradient-to-br from-emerald-400 to-green-500' 
                    : 'bg-gradient-to-br from-green-500/90 to-green-600/90'
                } shadow-lg`}
                style={getSegmentStyle(index, segment, snake)}
              >
                {index === 0 && (
                  <>
                    <div className="absolute w-1.5 h-1.5 bg-black rounded-full" 
                         style={{ 
                           left: direction === 'RIGHT' ? '12px' : '2px',
                           top: '4px',
                           display: direction === 'UP' ? 'none' : 'block'
                         }} />
                    <div className="absolute w-1.5 h-1.5 bg-black rounded-full" 
                         style={{ 
                           right: direction === 'LEFT' ? '12px' : '2px',
                           top: '4px',
                           display: direction === 'UP' ? 'none' : 'block'
                         }} />
                  </>
                )}
              </div>
            ))}

            {/* 食物 */}
            <div
              className="absolute bg-gradient-to-br from-pink-400 to-purple-600 rounded-full shadow-lg"
              style={{
                width: CELL_SIZE - 4,
                height: CELL_SIZE - 4,
                left: food.x * CELL_SIZE + 2,
                top: food.y * CELL_SIZE + 2,
                animation: 'pulse 2s infinite',
                boxShadow: showSparkle ? '0 0 20px rgba(236, 72, 153, 0.6)' : 'none',
              }}
            >
              {showSparkle && (
                <Sparkles
                  className="absolute -top-1 -right-1 text-yellow-400 animate-spin"
                  size={16}
                />
              )}
            </div>
          </div>
        </div>

        {isGameOver && (
          <div className="mt-4 animate-fade-in">
            <p className="text-red-500 mb-2 text-xl font-bold">游戏结束！</p>
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
            >
              重新开始
            </button>
          </div>
        )}

        <div className="mt-4 text-gray-400 text-sm backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full inline-block">
          使用方向键控制蛇的移动
        </div>
      </div>
    </div>
  );
}

export default App;