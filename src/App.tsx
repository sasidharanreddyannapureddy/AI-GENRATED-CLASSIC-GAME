/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen text-gray-800 font-sans flex flex-col items-center justify-between p-4 relative overflow-hidden">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center py-6 z-10 mb-4 bg-white/80 backdrop-blur-md rounded-2xl px-8 shadow-lg border border-white/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-inner border-b-4 border-green-600">
            <span className="text-2xl">🐍</span>
          </div>
          <h1 className="text-3xl font-black text-green-600 tracking-tight drop-shadow-sm">
            Snake Classic
          </h1>
        </div>
        <div className="flex flex-col items-end bg-amber-100 px-6 py-2 rounded-xl border-b-4 border-amber-200">
          <span className="text-sm text-amber-700 font-bold uppercase tracking-wider mb-1">Score</span>
          <span className="text-3xl font-black text-amber-600">
            {score}
          </span>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex items-center justify-center w-full max-w-4xl z-10 my-4">
        <SnakeGame onScoreChange={setScore} />
      </main>

      {/* Music Player Footer */}
      <footer className="w-full max-w-4xl mt-auto z-10 pb-4">
        <MusicPlayer />
      </footer>
    </div>
  );
}

