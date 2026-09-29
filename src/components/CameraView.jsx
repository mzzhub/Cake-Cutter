import React from 'react';
import CanvasOverlay from './CanvasOverlay';
import { Camera, Sparkles, Move, ScanLine } from 'lucide-react';

export default function CameraView({
  videoRef,
  isCameraActive,
  isCameraLoading,
  cameraError,
  onStartCamera,
  detectedObject,
  sliceCount,
  cutType,
  themeKey,
  isLocked,
  manualBox,
  setManualBox
}) {
  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] sm:aspect-[16/9] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
      
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isCameraActive ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* AR Canvas Overlay */}
      {isCameraActive && (
        <CanvasOverlay
          videoRef={videoRef}
          isCameraActive={isCameraActive}
          detectedObject={detectedObject}
          sliceCount={sliceCount}
          cutType={cutType}
          themeKey={themeKey}
          isLocked={isLocked}
          manualBox={manualBox}
          setManualBox={setManualBox}
        />
      )}

      {/* AI Active Scanning Line Effect */}
      {isCameraActive && !detectedObject && !manualBox && (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan shadow-neon-cyan opacity-80" />
          <div className="flex justify-center">
            <div className="px-4 py-1.5 rounded-full glass-panel text-xs text-cyan-300 font-mono flex items-center space-x-2 animate-pulse">
              <ScanLine className="w-4 h-4 animate-spin-slow" />
              <span>Scanning for Cake / Pizza / Donut... (Tap screen to place manual overlay)</span>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder / Empty State when Camera is OFF */}
      {!isCameraActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          
          {/* Animated Glow Circle Icon */}
          <div className="relative mb-6 group cursor-pointer" onClick={onStartCamera}>
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-yellow-400 opacity-50 blur-xl group-hover:opacity-100 transition duration-700 animate-pulse-slow" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-900 border border-slate-700 flex items-center justify-center text-4xl sm:text-5xl shadow-2xl">
              🎂
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Equal Slices Made Easy
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-md mb-6 leading-relaxed">
            Point your camera at any cake, pie, or pizza. TensorFlow AI auto-detects your food and overlays exact portion lines live.
          </p>

          {cameraError ? (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-sm max-w-md">
              <p className="font-bold mb-1">Camera Notice:</p>
              <p>{cameraError}</p>
            </div>
          ) : (
            <button
              onClick={onStartCamera}
              disabled={isCameraLoading}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-extrabold text-base shadow-neon-cyan hover:scale-105 transition-all flex items-center space-x-3 active:scale-95"
            >
              <Camera className="w-5 h-5" />
              <span>{isCameraLoading ? 'Accessing Camera...' : 'Start Camera'}</span>
            </button>
          )}

          <div className="mt-8 flex items-center space-x-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Zero Backend / 100% On-Device AI</span>
            </span>
            <span className="flex items-center space-x-1">
              <Move className="w-3.5 h-3.5 text-pink-400" />
              <span>Drag & Touch Adjust</span>
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
