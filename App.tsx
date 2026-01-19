
import React, { useState } from 'react';
import { generateQuizScript } from './services/gemini';
import { QuizScript, AppMode } from './types';
import { QuizPlayer } from './components/QuizPlayer';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<QuizScript | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const generatedScript = await generateQuizScript(topic);
      setScript(generatedScript);
    } catch (err: any) {
      console.error(err);
      setError('স্ক্রিপ্ট জেনারেট করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex flex-col items-center mb-12">
        <div className="viral-gradient p-3 rounded-2xl shadow-lg mb-6 rotate-1">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            ViralQuiz AI
          </h1>
        </div>
        <p className="text-slate-400 text-lg text-center max-w-lg">
          ১০ বছরের অভিজ্ঞতার ভাইরাল ফর্মুলা দিয়ে কুইজ ভিডিওর স্ক্রিপ্ট এবং প্রিভিউ তৈরি করুন মাত্র কয়েক সেকেন্ডে!
        </p>
      </header>

      {/* Main UI */}
      <main className="w-full max-w-3xl space-y-8">
        <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-bold text-yellow-400 uppercase tracking-widest">টপিক লিখুন</label>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="যেমন: মহাকাশ, ক্রিকেট, অদ্ভুত তথ্য..."
                className="flex-1 bg-slate-900 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-yellow-400 transition text-lg"
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className={`viral-gradient text-slate-900 font-black py-4 px-8 rounded-2xl hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:hover:scale-100 text-lg shadow-lg flex items-center justify-center gap-2`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-4 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                    তৈরি হচ্ছে...
                  </>
                ) : 'ম্যাজিক দেখুন ✨'}
              </button>
            </div>
          </div>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center">
                {error}
            </div>
        )}

        {/* Script Content */}
        {script && !isGenerating && (
          <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <h3 className="text-xl font-bold text-white">আপনার ভাইরাল স্ক্রিপ্ট</h3>
                <button 
                    onClick={() => setShowPreview(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-xl transition flex items-center gap-2"
                >
                    প্লে প্রিভিউ ▶️
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Intro & Hook */}
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 flex flex-col gap-4">
                <div>
                  <div className="text-xs text-yellow-500 font-bold uppercase mb-1">সুপার ফাস্ট ইন্ট্রো (0-3s)</div>
                  <p className="text-white font-bold text-lg leading-snug">{script.intro.text}</p>
                  <p className="text-slate-400 text-xs mt-2 italic">দৃশ্য: {script.intro.visualDescription}</p>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <div className="text-xs text-yellow-500 font-bold uppercase mb-1">ইনফরমেশনাল হুক (3-7s)</div>
                  <p className="text-white font-medium">{script.hook}</p>
                </div>
              </div>

              {/* Twist */}
              <div className="bg-yellow-400/10 p-6 rounded-2xl border border-yellow-400/30">
                <div className="text-xs text-yellow-500 font-bold uppercase mb-1">চমক বা টুইস্ট (৫০-৬০ সেকেন্ড)</div>
                <h4 className="text-yellow-400 font-bold text-lg mb-2">{script.twist.title}</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{script.twist.description}</p>
              </div>
            </div>

            {/* Questions List */}
            <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700">
              <div className="text-xs text-yellow-500 font-bold uppercase mb-6">মূল কুইজ বডি (৫টি প্রশ্ন)</div>
              <div className="space-y-4">
                {script.questions.map((q, idx) => (
                  <details key={idx} className="group bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <summary className="list-none cursor-pointer flex justify-between items-center">
                      <span className="font-bold text-white">প্রশ্ন {idx + 1}: {q.question.slice(0, 40)}...</span>
                      <span className="text-yellow-400 group-open:rotate-180 transition">▼</span>
                    </summary>
                    <div className="mt-4 space-y-2 pl-2 border-l-2 border-yellow-400/50">
                      <p className="text-slate-200 font-medium mb-3">{q.question}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, i) => (
                          <div key={i} className={`p-2 rounded border ${opt === q.answer ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                            {opt}
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-2">ফ্যাক্ট: {q.fact}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
            
            <div className="p-8 border-2 border-dashed border-slate-700 rounded-3xl text-center">
                <p className="text-slate-400 mb-4">আপনার ভিডিওর CTA</p>
                <h4 className="text-2xl font-black text-white italic">"{script.cta}"</h4>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 text-slate-500 text-sm pb-8">
        &copy; 2024 ViralQuiz AI | প্রো-লেভেল কুইজ মেকার
      </footer>

      {/* Preview Player Modal */}
      {showPreview && script && (
        <QuizPlayer 
          script={script} 
          onClose={() => setShowPreview(false)} 
        />
      )}
    </div>
  );
};

export default App;
