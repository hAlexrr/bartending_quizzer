'use client';

import { useState, useRef, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Volume2, Mic, VolumeX } from 'lucide-react';

interface AudioTestProps {
  onComplete: (passed: boolean, details?: string) => void;
  onCancel: () => void;
}

export default function AudioTest({ onComplete, onCancel }: AudioTestProps) {
  const [testingPhase, setTestingPhase] = useState<'intro' | 'speaker' | 'microphone' | 'complete'>('intro');
  const [speakerPassed, setSpeakerPassed] = useState(false);
  const [microphonePassed, setMicrophonePassed] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const playTestSound = () => {
    // Create a simple beep sound
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 440; // A4 note
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const startMicrophoneTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsRecording(true);
      monitorMicLevel();
    } catch (err: any) {
      console.error('Microphone error:', err);
      onComplete(false, `Microphone test failed: ${err.message}`);
    }
  };

  const monitorMicLevel = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkLevel = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      setMicLevel(Math.round((average / 255) * 100));

      animationRef.current = requestAnimationFrame(checkLevel);
    };

    checkLevel();
  };

  const stopMicrophoneTest = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setIsRecording(false);
    setMicLevel(0);
  };

  const completeTest = () => {
    stopMicrophoneTest();
    const allPassed = speakerPassed && microphonePassed;
    const details = `Speaker: ${speakerPassed ? 'Pass' : 'Fail'}, Microphone: ${microphonePassed ? 'Pass' : 'Fail'}`;
    onComplete(allPassed, details);
  };

  useEffect(() => {
    return () => {
      stopMicrophoneTest();
    };
  }, []);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Volume2 className="w-6 h-6" />
        Audio Test
      </h3>

      {testingPhase === 'intro' && (
        <div className="space-y-4">
          <p className="text-gray-600">
            This test will check both your speakers and microphone. We'll start with the speaker test.
          </p>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => setTestingPhase('speaker')}>
              Start Audio Test
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {testingPhase === 'speaker' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Speaker Test</h4>
            <p className="text-sm text-blue-800">
              Click the button below to play a test sound. Can you hear it clearly?
            </p>
          </div>

          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <Button
              variant="primary"
              size="lg"
              onClick={playTestSound}
            >
              <Volume2 className="w-5 h-5 mr-2" />
              Play Test Sound
            </Button>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => {
                setSpeakerPassed(true);
                setTestingPhase('microphone');
                startMicrophoneTest();
              }}
            >
              Yes, I Can Hear It
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSpeakerPassed(false);
                setTestingPhase('microphone');
                startMicrophoneTest();
              }}
            >
              No Sound / Issues
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {testingPhase === 'microphone' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Microphone Test</h4>
            <p className="text-sm text-blue-800">
              Speak into your microphone. The level indicator should respond to your voice.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <Mic className={`w-8 h-8 ${micLevel > 5 ? 'text-green-600' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-100"
                    style={{ width: `${micLevel}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Level: {micLevel}%
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => {
                setMicrophonePassed(true);
                setTestingPhase('complete');
              }}
            >
              Microphone Works
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setMicrophonePassed(false);
                setTestingPhase('complete');
              }}
            >
              Microphone Issues
            </Button>
            <Button variant="outline" onClick={() => { stopMicrophoneTest(); onCancel(); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {testingPhase === 'complete' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className={`p-4 rounded-md border ${speakerPassed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2">
                {speakerPassed ? (
                  <Volume2 className="w-5 h-5 text-green-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${speakerPassed ? 'text-green-900' : 'text-red-900'}`}>
                  Speaker: {speakerPassed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-md border ${microphonePassed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2">
                <Mic className={`w-5 h-5 ${microphonePassed ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`font-medium ${microphonePassed ? 'text-green-900' : 'text-red-900'}`}>
                  Microphone: {microphonePassed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" onClick={completeTest}>
              Complete Audio Test
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setTestingPhase('intro');
                setSpeakerPassed(false);
                setMicrophonePassed(false);
              }}
            >
              Restart Test
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
