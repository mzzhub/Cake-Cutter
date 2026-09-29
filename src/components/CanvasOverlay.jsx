import React, { useRef, useEffect, useState, useCallback } from 'react';
import { drawAROverlay } from '../utils/drawingUtils';

export default function CanvasOverlay({
  videoRef,
  isCameraActive,
  detectedObject,
  sliceCount,
  cutType,
  themeKey,
  isLocked,
  manualBox,
  setManualBox
}) {
  const canvasRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Draw overlay loop on video / window changes
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Synchronize canvas intrinsic pixel size with video CSS render size
    const rect = video.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Calculate scale factor between video stream resolution and container CSS size
    const scaleX = rect.width / (video.videoWidth || rect.width);
    const scaleY = rect.height / (video.videoHeight || rect.height);

    // Active Box: AI Detected Box OR Manual User Drag Box
    let activeBBox = null;
    let label = 'Cake';
    let score = 0.95;

    if (detectedObject && detectedObject.bbox) {
      const [x, y, w, h] = detectedObject.bbox;
      activeBBox = [x * scaleX, y * scaleY, w * scaleX, h * scaleY];
      label = detectedObject.class;
      score = detectedObject.score;
    } else if (manualBox) {
      activeBBox = [manualBox.x, manualBox.y, manualBox.w, manualBox.h];
      label = 'Manual Target';
      score = 1.0;
    }

    if (activeBBox) {
      drawAROverlay({
        ctx,
        bbox: activeBBox,
        label,
        score,
        sliceCount,
        cutType,
        themeKey,
        showNumbers: true,
        isLocked
      });
    }

    ctx.restore();
  }, [videoRef, detectedObject, sliceCount, cutType, themeKey, isLocked, manualBox]);

  useEffect(() => {
    let animId;
    const loop = () => {
      renderCanvas();
      animId = requestAnimationFrame(loop);
    };
    if (isCameraActive) {
      loop();
    } else if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isCameraActive, renderCanvas]);

  // Touch / Mouse Drag handlers for Manual Target Placement
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    isDraggingRef.current = true;
    dragStartRef.current = { x: clickX, y: clickY };

    // Default manual box centered around touch point
    const size = Math.min(rect.width, rect.height) * 0.45;
    setManualBox({
      x: clickX - size / 2,
      y: clickY - size / 2,
      w: size,
      h: size
    });
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const startX = dragStartRef.current.x;
    const startY = dragStartRef.current.y;

    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    setManualBox({
      x: Math.min(startX, currentX),
      y: Math.min(startY, currentY),
      w: Math.max(60, width),
      h: Math.max(60, height)
    });
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="absolute top-0 left-0 w-full h-full pointer-events-auto cursor-crosshair z-20 touch-none"
    />
  );
}
