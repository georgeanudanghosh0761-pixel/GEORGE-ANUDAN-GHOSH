
import React, { useState, useEffect, useCallback } from 'react';
import { QuizScript } from '../types';

interface QuizPlayerProps {
  script: QuizScript;
  onClose: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ script, onClose }) => {
  const [stage, setStage] = useState<'intro' | 'hook' | 'quiz' | 'twist' | 'cta'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(5);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let interval: any;
    
    if (stage === 'intro') {
      interval = setTimeout(() => setStage('hook'), 3000);
    } else if (stage === 'hook') {
      interval = setTimeout(() => setStage('quiz'), 4000);
    } else if (stage === 'quiz') {
      if (timer > 0 && !showAnswer) {
        interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      } else if (timer === 0 && !showAnswer) {
        setShowAnswer(true);
        interval = setTimeout(() => {
          if (currentQuestionIndex < script.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setTimer(5);
            setShowAnswer(false);
          } else {
            setStage('twist');
          }
        }, 3000);
      }
    } else if (stage === 'twist') {
      interval = setTimeout(() => setStage('cta'), 7000);
    }

    return () => clearInterval(interval);
  }, [stage, timer, showAnswer, currentQuestionIndex, script.questions.length]);

  const currentQ = script.questions[currentQuestionIndex];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[400px] aspect-[9/16] bg-slate-900 rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[60] bg-white/20 p-2 rounded-full hover:bg-white/40 transition"
        >
          ✕
        </button>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-800 z-[60]">
            <div 
                className="h-full bg-yellow-400 transition-all duration-500" 
                style={{ width: `${((currentQuestionIndex + 1) / script.questions.length) * 100}%` }}
            />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          
          {stage === 'intro' && (
            <div className="animate-bounce-short">
              <div className="text-6xl mb-6">🛑</div>
              <h2 className="text-4xl font-black text-yellow-400 uppercase leading-tight mb-4">
                {script.intro.text}
              </h2>
              <p className="text-sm text-slate-400 italic">Visual: {script.intro.visualDescription}</p>
            </div>
          )}

          {stage === 'hook' && (
            <div className="animate-in fade-in zoom-in duration-500">
              <h2 className="text-3xl font-bold text-white mb-6 leading-snug">
                {script.hook}
              </h2>
              <div className="bg-red-600 text-white font-black py-2 px-4 rounded-full text-xl animate-pulse">
                চ্যালেঞ্জ গ্রহণ করুন!
              </div>
            </div>
          )}

          {stage === 'quiz' && (
            <div className="w-full flex flex-col h-full justify-between py-10">
              <div className="relative">
                <div className="text-yellow-400 font-bold mb-2">প্রশ্ন {currentQuestionIndex + 1}</div>
                <h2 className="text-2xl font-bold text-white leading-tight">
                  {currentQ.question}
                </h2>
              </div>

              <div className="space-y-3 mt-8">
                {currentQ.options.map((opt, i) => (
                  <div 
                    key={i}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                      showAnswer 
                        ? (opt === currentQ.answer ? 'bg-green-500 border-green-300 scale-105 shadow-lg' : 'bg-slate-800 border-slate-700 opacity-50')
                        : 'bg-slate-800 border-yellow-400/30'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center">
                {!showAnswer ? (
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle 
                        cx="40" cy="40" r="36" 
                        className="stroke-slate-700 fill-none" 
                        strokeWidth="8"
                      />
                      <circle 
                        cx="40" cy="40" r="36" 
                        className="stroke-yellow-400 fill-none transition-all duration-1000 ease-linear" 
                        strokeWidth="8"
                        strokeDasharray="226.2"
                        strokeDashoffset={226.2 - (226.2 * timer / 5)}
                      />
                    </svg>
                    <span className="text-3xl font-black text-yellow-400">{timer}</span>
                  </div>
                ) : (
                  <div className="animate-bounce">
                    <div className="bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow-lg">
                      সঠিক উত্তর!
                    </div>
                    <p className="mt-4 text-sm text-slate-300 px-4 italic">{currentQ.fact}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {stage === 'twist' && (
            <div className="bg-yellow-400 p-8 rounded-2xl text-slate-900 shadow-2xl animate-in zoom-in">
              <h2 className="text-xl font-black mb-4 uppercase tracking-tighter">অবাক করা তথ্য!</h2>
              <h3 className="text-3xl font-bold mb-6 leading-tight">{script.twist.title}</h3>
              <p className="text-lg font-medium">{script.twist.description}</p>
            </div>
          )}

          {stage === 'cta' && (
            <div className="flex flex-col items-center">
                <div className="text-5xl mb-6">🏆</div>
                <h2 className="text-3xl font-black text-white mb-8">{script.cta}</h2>
                <button 
                    onClick={onClose}
                    className="bg-yellow-400 text-slate-900 font-black py-4 px-8 rounded-full hover:scale-105 transition active:scale-95 shadow-xl text-xl"
                >
                    আবার চেষ্টা করুন
                </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
