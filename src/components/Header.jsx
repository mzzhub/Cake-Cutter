import React from 'react';
import { Sparkles, HelpCircle, Camera, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Header({ isModelLoading, modelError, onOpenHelp }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 glass-panel border-b border-slate-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-pink-500 p-0.5 shadow-neon-cyan flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xl">
              🎂
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-300 bg-clip-text text-transparent">
              Cake Cutter <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono ml-1">AR</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Equal Portion AI Cutting Overlay</p>
          </div>
        </div>

        {/* AI Model Status Badge & Help Toggle */}
        <div className="flex items-center space-x-3">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full glass-panel-subtle text-xs font-medium">
            {isModelLoading ? (
              <>
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-slate-300">Loading AI Model...</span>
              </>
            ) : modelError ? (
              <>
                <AlertCircle className="w-4 h-4 text-pink-500" />
                <span className="text-pink-400">AI Model Error</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">TensorFlow.js Ready</span>
              </>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-xl glass-panel-subtle hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="How to Use"
          >
            <HelpCircle className="w-5 h-5 text-cyan-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
