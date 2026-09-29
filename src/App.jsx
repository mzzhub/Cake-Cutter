import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import CameraView from './components/CameraView';
import Controls from './components/Controls';
import StatusBanner from './components/StatusBanner';
import HelpModal from './components/HelpModal';
import { useCamera } from './hooks/useCamera';
import { useObjectDetection } from './hooks/useObjectDetection';

export default function App() {
  const [sliceCount, setSliceCount] = useState(6);
  const [cutType, setCutType] = useState('radial'); // 'radial' | 'parallel' | 'grid'
  const [themeKey, setThemeKey] = useState('cyan');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [manualBox, setManualBox] = useState(null);

  // Camera Management Hook
  const {
    videoRef,
    isCameraActive,
    isCameraLoading,
    cameraError,
    hasMultipleCameras,
    isTorchSupported,
    isTorchOn,
    startCamera,
    stopCamera,
    toggleCamera,
    toggleTorch
  } = useCamera();

  // Object Detection Hook
  const {
    isModelLoading,
    modelError,
    detectedObject,
    isLocked,
    toggleLockTarget
  } = useObjectDetection(videoRef, isCameraActive);

  // High-Res Snapshot Capture (Combines video frame + AR canvas overlay)
  const handleTakeSnapshot = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isCameraActive) return;

    const canvas = document.createElement('canvas');
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Draw current video frame
    ctx.drawImage(video, 0, 0, width, height);

    // 2. Draw active AR Canvas Overlay on top
    const arCanvas = document.querySelector('canvas');
    if (arCanvas) {
      ctx.drawImage(arCanvas, 0, 0, width, height);
    }

    // 3. Trigger PNG Download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `cake-cutter-ar-${sliceCount}-pieces-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, [videoRef, isCameraActive, sliceCount]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      
      {/* Top Header */}
      <Header
        isModelLoading={isModelLoading}
        modelError={modelError}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-20 pb-36 flex flex-col justify-center">
        
        {/* Camera Feed & AR Canvas */}
        <CameraView
          videoRef={videoRef}
          isCameraActive={isCameraActive}
          isCameraLoading={isCameraLoading}
          cameraError={cameraError}
          onStartCamera={startCamera}
          detectedObject={detectedObject}
          sliceCount={sliceCount}
          cutType={cutType}
          themeKey={themeKey}
          isLocked={isLocked}
          manualBox={manualBox}
          setManualBox={setManualBox}
        />

        {/* Live Status Notification Banner */}
        <StatusBanner
          isCameraActive={isCameraActive}
          detectedObject={detectedObject}
          isLocked={isLocked}
          manualBox={manualBox}
        />

      </main>

      {/* Bottom Floating Controls */}
      <Controls
        sliceCount={sliceCount}
        setSliceCount={setSliceCount}
        cutType={cutType}
        setCutType={setCutType}
        isCameraActive={isCameraActive}
        isCameraLoading={isCameraLoading}
        onStartCamera={startCamera}
        onStopCamera={stopCamera}
        hasMultipleCameras={hasMultipleCameras}
        onToggleCamera={toggleCamera}
        isTorchSupported={isTorchSupported}
        isTorchOn={isTorchOn}
        onToggleTorch={toggleTorch}
        isLocked={isLocked}
        onToggleLock={toggleLockTarget}
        detectedObject={detectedObject || manualBox}
        themeKey={themeKey}
        setThemeKey={setThemeKey}
        onTakeSnapshot={handleTakeSnapshot}
      />

      {/* Help / Instructions Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

    </div>
  );
}
