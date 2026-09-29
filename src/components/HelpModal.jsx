import React from 'react';
import { X, PieChart, Camera, Lock, Download, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">How to Use Cake Cutter AR</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions Steps */}
        <div className="space-y-4 text-sm text-slate-300">
          
          <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 font-mono">
              1
            </div>
            <div>
              <h4 className="font-semibold text-white mb-0.5">Select Slice Count & Style</h4>
              <p className="text-xs text-slate-400">
                Choose the number of pieces (2 to 32) and select Radial (for round cakes/pizzas), Strips, or Grid layout.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 font-bold flex items-center justify-center shrink-0 font-mono">
              2
            </div>
            <div>
              <h4 className="font-semibold text-white mb-0.5">Start Camera & Point at Food</h4>
              <p className="text-xs text-slate-400">
                Click "Start Camera" and allow camera permissions. Position your phone top-down facing the cake or dish.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 font-mono">
              3
            </div>
            <div>
              <h4 className="font-semibold text-white mb-0.5">Automatic AI Detection & Touch Overlay</h4>
              <p className="text-xs text-slate-400">
                TensorFlow COCO-SSD will automatically detect the food object. If the cake is not auto-detected, simply tap/drag on the screen to place a manual target circle!
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center shrink-0 font-mono">
              4
            </div>
            <div>
              <h4 className="font-semibold text-white mb-0.5">Lock Position & Save Photo</h4>
              <p className="text-xs text-slate-400">
                Tap the Lock icon 🔒 to freeze the line positions, or tap the Download icon 📸 to capture a screenshot.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:brightness-110 transition-all shadow-neon-cyan"
        >
          Got it, Let's Cut!
        </button>

      </div>
    </div>
  );
}
