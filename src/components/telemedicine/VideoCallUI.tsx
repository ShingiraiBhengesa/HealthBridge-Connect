
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  MessageSquare, Users, ScreenShare, Settings, 
  Volume2, VolumeX 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Consultation } from '@/types/telemedicine';
import { UserType } from '@/utils/storageUtils';

interface VideoCallUIProps {
  consultation: Consultation;
  userType: UserType;
  onEndCall: () => void;
}

export const VideoCallUI = ({ consultation, userType, onEndCall }: VideoCallUIProps) => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Mock stream for demo purposes
  useEffect(() => {
    // Simulate connection delay
    const timer = setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      // Mock video streams
      if (localVideoRef.current) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(stream => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
            
            // Mock remote video with a delayed connection
            setTimeout(() => {
              if (remoteVideoRef.current) {
                // In a real app, this would be the peer's stream
                remoteVideoRef.current.srcObject = stream;
              }
            }, 2000);
          })
          .catch(err => {
            console.error("Error accessing media devices:", err);
            toast({
              title: "Camera access error",
              description: "Could not access your camera or microphone. Please check permissions.",
              variant: "destructive"
            });
          });
      }
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      
      // Clean up streams on unmount
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isConnected) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);
  
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !micEnabled;
      });
    }
  };
  
  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !cameraEnabled;
      });
    }
  };
  
  const toggleSpeaker = () => {
    setSpeakerEnabled(!speakerEnabled);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !speakerEnabled;
    }
  };
  
  const toggleFullScreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        toast({
          title: "Fullscreen error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
        });
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  const handleEndCall = () => {
    // Clean up streams
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    onEndCall();
  };
  
  const otherPersonName = userType === UserType.PATIENT 
    ? consultation.doctorName 
    : consultation.patientName || 'Patient';
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex flex-col h-[65vh] bg-black relative",
        isFullScreen && "fixed inset-0 z-50 h-screen"
      )}
    >
      {/* Connection status */}
      {isConnecting && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/80 text-white">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mb-4"></div>
            <p>Connecting to {otherPersonName}...</p>
          </div>
        </div>
      )}
      
      {/* Remote video (large) */}
      <div className="flex-1 relative">
        {isConnected ? (
          <video 
            ref={remoteVideoRef}
            autoPlay 
            playsInline
            className="w-full h-full object-cover"
            muted={!speakerEnabled}
          />
        ) : (
          <div className="bg-gray-900 w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-2xl text-white">
              {otherPersonName.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        )}
        
        {/* Call duration */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white py-1 px-3 rounded-full text-sm">
          {isConnected ? formatTime(elapsedTime) : 'Connecting...'}
        </div>
        
        {/* Local video (small) */}
        <div className="absolute bottom-4 right-4 w-1/4 max-w-[180px] aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
          <video 
            ref={localVideoRef}
            autoPlay 
            playsInline 
            muted 
            className={cn(
              "w-full h-full object-cover",
              !cameraEnabled && "hidden"
            )}
          />
          {!cameraEnabled && (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
              <VideoOff size={24} />
            </div>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-gray-900 p-3 md:p-4 flex items-center justify-center gap-2 md:gap-4">
        <Button 
          variant={micEnabled ? "outline" : "secondary"}
          size="icon"
          className={cn(
            "rounded-full h-10 w-10 md:h-12 md:w-12 bg-gray-800 border-0 hover:bg-gray-700",
            !micEnabled && "bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-500"
          )}
          onClick={toggleMic}
        >
          {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        
        <Button 
          variant={cameraEnabled ? "outline" : "secondary"}
          size="icon"
          className={cn(
            "rounded-full h-10 w-10 md:h-12 md:w-12 bg-gray-800 border-0 hover:bg-gray-700",
            !cameraEnabled && "bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-500"
          )}
          onClick={toggleCamera}
        >
          {cameraEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        
        <Button 
          variant={speakerEnabled ? "outline" : "secondary"}
          size="icon"
          className={cn(
            "rounded-full h-10 w-10 md:h-12 md:w-12 bg-gray-800 border-0 hover:bg-gray-700",
            !speakerEnabled && "bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-500"
          )}
          onClick={toggleSpeaker}
        >
          {speakerEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
        
        <Button 
          variant="destructive"
          size="icon"
          className="rounded-full h-12 w-12 md:h-14 md:w-14"
          onClick={handleEndCall}
        >
          <PhoneOff className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
        
        <Button 
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 md:h-12 md:w-12 bg-gray-800 border-0 hover:bg-gray-700"
          onClick={() => {
            toast({
              title: "Chat opened",
              description: "In-call chat will be available soon",
            });
          }}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 md:h-12 md:w-12 bg-gray-800 border-0 hover:bg-gray-700"
          onClick={toggleFullScreen}
        >
          <ScreenShare className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
