import { useState, useEffect, useRef, useCallback } from 'react';

// Default target classes to look for food objects
export const FOOD_CLASSES = ['cake', 'pizza', 'donut', 'apple', 'orange', 'sandwich', 'bowl', 'dining table'];

/**
 * Custom React Hook for TensorFlow.js COCO-SSD Object Detection
 */
export function useObjectDetection(videoRef, isCameraActive) {
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelError, setModelError] = useState(null);
  const [detections, setDetections] = useState([]);
  const [detectedObject, setDetectedObject] = useState(null);
  const [targetFilter, setTargetFilter] = useState('food'); // 'food' | 'all' | 'cake' | 'pizza' | 'donut'
  const [isLocked, setIsLocked] = useState(false);
  const [lockedDetection, setLockedDetection] = useState(null);

  const requestRef = useRef(null);
  const smoothedBBoxRef = useRef(null);

  // Load TensorFlow.js and COCO-SSD Model
  useEffect(() => {
    let isMounted = true;

    async function loadTFModel() {
      setIsModelLoading(true);
      setModelError(null);

      try {
        // Dynamically import tfjs and coco-ssd
        const tf = await import('@tensorflow/tfjs');
        await tf.ready();
        
        const cocoSsd = await import('@tensorflow-models/coco-ssd');
        const loadedModel = await cocoSsd.load({
          base: 'lite_mobilenet_v2' // Fast mobile optimization
        });

        if (isMounted) {
          setModel(loadedModel);
          setIsModelLoading(false);
        }
      } catch (err) {
        console.error('TensorFlow.js model load error:', err);
        if (isMounted) {
          setModelError('Failed to load AI vision model. Please check network connection.');
          setIsModelLoading(false);
        }
      }
    }

    loadTFModel();

    return () => {
      isMounted = false;
    };
  }, []);

  // Smooth bounding box coordinates using Exponential Moving Average (EMA) to eliminate AR jitter
  const smoothBBox = useCallback((newBBox, alpha = 0.35) => {
    if (!smoothedBBoxRef.current) {
      smoothedBBoxRef.current = [...newBBox];
      return newBBox;
    }
    const [x, y, w, h] = newBBox;
    const [sx, sy, sw, sh] = smoothedBBoxRef.current;
    const smoothed = [
      sx + alpha * (x - sx),
      sy + alpha * (y - sy),
      sw + alpha * (w - sw),
      sh + alpha * (h - sh)
    ];
    smoothedBBoxRef.current = smoothed;
    return smoothed;
  }, []);

  // Run Object Detection Continuous Loop
  useEffect(() => {
    if (!model || !isCameraActive || !videoRef.current || isLocked) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      return;
    }

    let isRunning = true;

    const detectFrame = async () => {
      if (!isRunning) return;

      const video = videoRef.current;
      if (video && video.readyState === 4 && video.videoWidth > 0 && video.videoHeight > 0) {
        try {
          const predictions = await model.detect(video, 10, 0.45);
          
          // Filter predictions based on targetFilter
          let filtered = predictions;
          if (targetFilter === 'food') {
            filtered = predictions.filter(p => FOOD_CLASSES.includes(p.class));
          } else if (targetFilter !== 'all') {
            filtered = predictions.filter(p => p.class === targetFilter);
          }

          setDetections(filtered);

          if (filtered.length > 0) {
            // Select highest confidence match
            const topMatch = filtered.reduce((prev, current) => (prev.score > current.score ? prev : current));
            const smoothedBox = smoothBBox(topMatch.bbox);
            
            setDetectedObject({
              ...topMatch,
              bbox: smoothedBox
            });
          } else {
            setDetectedObject(null);
            smoothedBBoxRef.current = null;
          }
        } catch (err) {
          console.warn('Prediction frame error:', err);
        }
      }

      if (isRunning) {
        requestRef.current = requestAnimationFrame(detectFrame);
      }
    };

    detectFrame();

    return () => {
      isRunning = false;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [model, isCameraActive, videoRef, targetFilter, isLocked, smoothBBox]);

  // Lock target detection in place
  const toggleLockTarget = useCallback(() => {
    if (isLocked) {
      setIsLocked(false);
      setLockedDetection(null);
    } else if (detectedObject) {
      setIsLocked(true);
      setLockedDetection({ ...detectedObject });
    }
  }, [isLocked, detectedObject]);

  const activeDetection = isLocked ? lockedDetection : detectedObject;

  return {
    isModelLoading,
    modelError,
    detections,
    detectedObject: activeDetection,
    targetFilter,
    setTargetFilter,
    isLocked,
    toggleLockTarget
  };
}
