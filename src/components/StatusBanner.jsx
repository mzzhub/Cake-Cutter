import React from 'react';
import { Info, Lock, Touchpad, CheckCircle2 } from 'lucide-react';

export default function StatusBanner({ isCameraActive, detectedObject, isLocked, manualBox }) {
  if (!isCameraActive) return null;

  let message = '';
  let icon = <Info className="w-4 h-4 text-cyan-400" />;
  let badgeColor = 'border-cyan-500/30 text-cyan-200';

  if (isLocked) {
    message = 'Target locked! You can lock position while cutting.';
    icon = <Lock className="w-4 h-4 text-pink-400" />;
    badgeColor = 'border-pink-500/40 text-pink-200';
  } else if (detectedObject) {
    message = `AI Detected ${detectedObject.class.toUpperCase()} (${Math.round(detectedObject.score * 100)}%)`;
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    badgeColor = 'border-emerald-500/40 text-emerald-200';
  } else if (manualBox) {
    message = 'Manual target overlay active. Drag or tap screen to adjust size & center.';
    icon = <Touchpad className="w-4 h-4 text-yellow-400" />;
    badgeColor = 'border-yellow-500/40 text-yellow-200';
  } else {
    message = 'Looking for cake, pizza, pie or donut... Or tap screen to set manual overlay.';
    icon = <Info className="w-4 h-4 text-cyan-400 animate-pulse" />;
    badgeColor = 'border-slate-700 text-slate-300';
  }

  return (
    <div className="flex justify-center mt-3 px-4">
      <div className={`px-4 py-2 rounded-full glass-panel border ${badgeColor} text-xs font-semibold flex items-center space-x-2 shadow-lg transition-all`}>
        {icon}
        <span>{message}</span>
      </div>
    </div>
  );
}
