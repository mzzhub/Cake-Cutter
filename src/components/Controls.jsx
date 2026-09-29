import React from 'react';
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  Zap, 
  Lock, 
  Unlock, 
  Download, 
  PieChart, 
  Grid, 
  Columns,
  Plus,
  Minus,
  Palette
} from 'lucide-react';
import { NEON_THEMES } from '../utils/drawingUtils';

export default function Controls({
  sliceCount,
  setSliceCount,
  cutType,
  setCutType,
  isCameraActive,
  isCameraLoading,
  onStartCamera,
  onStopCamera,
  hasMultipleCameras,
  onToggleCamera,
  isTorchSupported,
  isTorchOn,
  onToggleTorch,
  isLocked,
  onToggleLock,
  detectedObject,
  themeKey,
  setThemeKey,
  onTakeSnapshot
}) {
  const PRESET_PIECES = [2, 3, 4, 6, 8, 10, 12, 16];

  const handleIncrement = () => setSliceCount(prev => Math.min(32, prev + 1));
  const handleDecrement = () => setSliceCount(prev => Math.max(2, prev - 1));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-6 glass-panel border-t border-slate-800">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Row 1: Main Slice Counter & Presets */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          
          {/* Piece Counter Input */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-sm font-semibold text-slate-300">Pieces:</span>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDecrement}
                disabled={sliceCount <= 2}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-400 font-bold flex items-center justify-center border border-slate-700 transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="relative">
                <input
                  type="number"
                  min="2"
                  max="32"
                  value={sliceCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) setSliceCount(Math.max(2, Math.min(32, val)));
                  }}
                  className="w-16 h-10 bg-slate-950 text-center font-bold text-lg text-white rounded-xl border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono shadow-inner"
                />
              </div>

              <button
                onClick={handleIncrement}
                disabled={sliceCount >= 32}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-400 font-bold flex items-center justify-center border border-slate-700 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {PRESET_PIECES.map(num => (
              <button
                key={num}
                onClick={() => setSliceCount(num)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all border ${
                  sliceCount === num
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-neon-cyan'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Cut Pattern Type Selector (Radial vs Parallel vs Grid) */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCutType('radial')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                cutType === 'radial'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Radial (Pie Slices - Cake, Pizza, Donut)"
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Radial</span>
            </button>

            <button
              onClick={() => setCutType('parallel')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                cutType === 'parallel'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Parallel (Vertical Strips)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Strips</span>
            </button>

            <button
              onClick={() => setCutType('grid')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                cutType === 'grid'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid (Rows x Columns - Sheet Cake, Brownies)"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>
        </div>

        {/* Row 2: Main Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Start/Stop Camera Button */}
          {!isCameraActive ? (
            <button
              onClick={onStartCamera}
              disabled={isCameraLoading}
              className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 font-bold text-sm sm:text-base shadow-neon-cyan hover:brightness-110 transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <Camera className="w-5 h-5" />
              <span>{isCameraLoading ? 'Starting Camera...' : 'Start Camera'}</span>
            </button>
          ) : (
            <button
              onClick={onStopCamera}
              className="flex-1 py-3 px-4 rounded-2xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-sm sm:text-base border border-rose-500/50 transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <CameraOff className="w-5 h-5" />
              <span>Stop Camera</span>
            </button>
          )}

          {/* Secondary Camera Controls (Flip, Torch, Lock, Snapshot, Color) */}
          {isCameraActive && (
            <div className="flex items-center space-x-2">
              
              {/* Flip Camera */}
              {hasMultipleCameras && (
                <button
                  onClick={onToggleCamera}
                  className="p-3 rounded-2xl glass-panel-subtle hover:bg-slate-800 text-slate-200 transition-all"
                  title="Flip Front/Rear Camera"
                >
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                </button>
              )}

              {/* Torch Flashlight */}
              {isTorchSupported && (
                <button
                  onClick={onToggleTorch}
                  className={`p-3 rounded-2xl transition-all ${
                    isTorchOn ? 'bg-amber-500 text-slate-950 shadow-lg' : 'glass-panel-subtle text-slate-200 hover:bg-slate-800'
                  }`}
                  title="Toggle Flashlight"
                >
                  <Zap className="w-5 h-5" />
                </button>
              )}

              {/* Lock Bounding Box */}
              <button
                onClick={onToggleLock}
                disabled={!detectedObject}
                className={`p-3 rounded-2xl transition-all ${
                  isLocked 
                    ? 'bg-pink-600 text-white shadow-neon-pink' 
                    : 'glass-panel-subtle text-slate-200 hover:bg-slate-800 disabled:opacity-40'
                }`}
                title={isLocked ? 'Unlock Bounding Box' : 'Lock AR Bounding Box Position'}
              >
                {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              </button>

              {/* Theme Selector Popover / Picker */}
              <div className="relative group">
                <button
                  className="p-3 rounded-2xl glass-panel-subtle hover:bg-slate-800 text-slate-200 transition-all"
                  title="Change AR Neon Color"
                >
                  <Palette className="w-5 h-5" style={{ color: NEON_THEMES[themeKey].stroke }} />
                </button>
                <div className="absolute bottom-full mb-2 right-0 hidden group-hover:flex items-center space-x-2 p-2 rounded-xl glass-panel border border-slate-700 shadow-xl">
                  {Object.keys(NEON_THEMES).map(key => (
                    <button
                      key={key}
                      onClick={() => setThemeKey(key)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-125 ${
                        themeKey === key ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: NEON_THEMES[key].stroke }}
                    />
                  ))}
                </div>
              </div>

              {/* Take Snapshot */}
              <button
                onClick={onTakeSnapshot}
                className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:brightness-110 transition-all shadow-md active:scale-95"
                title="Save High-Res Photo Snapshot"
              >
                <Download className="w-5 h-5" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
