import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom React Hook for Managing HTML5 Camera Stream & Permissions
 */
export function useCamera() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isTorchSupported, setIsTorchSupported] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);

  // Check available video devices
  useEffect(() => {
    async function checkDevices() {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputCount = devices.filter(d => d.kind === 'videoinput').length;
          setHasMultipleCameras(videoInputCount > 1);
        } catch (e) {
          console.warn('Device enumeration error:', e);
        }
      }
    }
    checkDevices();
  }, []);

  // Start Camera Stream
  const startCamera = useCallback(async (requestedFacingMode = facingMode) => {
    setIsCameraLoading(true);
    setCameraError(null);

    // Ensure secure context check (HTTPS required on mobile for camera except localhost)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setCameraError('Camera access requires an HTTPS secure connection on mobile devices.');
      setIsCameraLoading(false);
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Your browser does not support camera media devices.');
      setIsCameraLoading(false);
      return;
    }

    // Stop existing stream if running
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: requestedFacingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().then(resolve).catch(resolve);
          };
        });
      }

      setIsCameraActive(true);
      setFacingMode(requestedFacingMode);

      // Check Torch capabilities
      const track = newStream.getVideoTracks()[0];
      if (track && track.getCapabilities) {
        const capabilities = track.getCapabilities();
        setIsTorchSupported(!!capabilities.torch);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMsg = 'Failed to access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission denied. Please allow camera access in browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera device found on your device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'Camera is currently in use by another application.';
      }
      setCameraError(errorMsg);
      setIsCameraActive(false);
    } finally {
      setIsCameraLoading(false);
    }
  }, [facingMode, stream]);

  // Stop Camera Stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsTorchOn(false);
  }, [stream]);

  // Toggle Camera Front/Rear
  const toggleCamera = useCallback(() => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextMode);
  }, [facingMode, startCamera]);

  // Toggle Torch/Flashlight
  const toggleTorch = useCallback(async () => {
    if (!stream || !isTorchSupported) return;
    const track = stream.getVideoTracks()[0];
    if (track) {
      try {
        const nextTorchState = !isTorchOn;
        await track.applyConstraints({
          advanced: [{ torch: nextTorchState }]
        });
        setIsTorchOn(nextTorchState);
      } catch (err) {
        console.warn('Torch toggle failed:', err);
      }
    }
  }, [stream, isTorchSupported, isTorchOn]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    videoRef,
    stream,
    isCameraActive,
    isCameraLoading,
    cameraError,
    facingMode,
    hasMultipleCameras,
    isTorchSupported,
    isTorchOn,
    startCamera,
    stopCamera,
    toggleCamera,
    toggleTorch
  };
}
