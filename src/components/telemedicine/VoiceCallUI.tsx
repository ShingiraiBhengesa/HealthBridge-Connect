
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mic, MicOff, PhoneOff, Volume2, VolumeX, 
  MessageSquare, UserRound
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Consultation } from '@/types/telemedicine';
import { UserType } from '@/utils/storageUtils';

interface VoiceCallUIProps {
  consultation: Consultation;
  userType: UserType;
  onEndCall: () => void;
}

export const VoiceCallUI = ({ consultation, userType, onEndCall }: VoiceCallUIProps) => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const otherPersonName = userType === UserType.PATIENT 
    ? consultation.doctorName 
    : consultation.patientName || 'Patient';
  
  // Mock connection for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isConnected) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        // Simulate audio level changes
        setAudioLevel(Math.random() * 0.5 + 0.1);
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
    
    if (!micEnabled) {
      toast({
        title: "Microphone enabled",
        description: "Others can now hear you",
      });
    } else {
      toast({
        title: "Microphone disabled",
        description: "You are now muted",
      });
    }
  };
  
  const toggleSpeaker = () => {
    setSpeakerEnabled(!speakerEnabled);
    
    if (!speakerEnabled) {
      toast({
        title: "Speaker enabled",
        description: "You can now hear others",
      });
    } else {
      toast({
        title: "Speaker disabled",
        description: "Audio is now muted",
      });
    }
  };
  
  return (
    <div className="flex flex-col h-[65vh] bg-gray-100 dark:bg-gray-900">
      {/* Connection status */}
      {isConnecting && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/80 text-white">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mb-4"></div>
            <p>Connecting to {otherPersonName}...</p>
          </div>
        </div>
      )}
      
      {/* Main call UI */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
          <AvatarFallback className="bg-health-primary/10 text-health-primary text-xl md:text-2xl">
            {otherPersonName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <h2 className="text-xl md:text-2xl font-medium mb-2">{otherPersonName}</h2>
        <p className="text-muted-foreground mb-6">{isConnected ? 'On call' : 'Connecting...'}</p>
        
        {/* Call duration */}
        <div className="text-2xl font-mono mb-8">
          {isConnected ? formatTime(elapsedTime) : '...'}
        </div>
        
        {/* Audio visualization */}
        {isConnected && (
          <div className="flex gap-1 mb-8 h-8 items-end">
            {Array.from({ length: 12 }).map((_, i) => {
              const height = Math.random() < audioLevel ? `${Math.random() * 100}%` : '15%';
              
              return (
                <div 
                  key={i}
                  className="w-1 md:w-2 bg-health-primary rounded-full transition-all duration-200"
                  style={{ height }}
                ></div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="p-4 md:p-6 flex items-center justify-center gap-3 md:gap-6">
        <Button 
          variant={micEnabled ? "outline" : "secondary"}
          size="icon"
          className={cn(
            "rounded-full h-12 w-12 md:h-14 md:w-14",
            !micEnabled && "bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-500"
          )}
          onClick={toggleMic}
        >
          {micEnabled ? <Mic className="h-5 w-5 md:h-6 md:w-6" /> : <MicOff className="h-5 w-5 md:h-6 md:w-6" />}
        </Button>
        
        <Button 
          variant="destructive"
          size="icon"
          className="rounded-full h-14 w-14 md:h-16 md:w-16"
          onClick={onEndCall}
        >
          <PhoneOff className="h-6 w-6 md:h-7 md:w-7" />
        </Button>
        
        <Button 
          variant={speakerEnabled ? "outline" : "secondary"}
          size="icon"
          className={cn(
            "rounded-full h-12 w-12 md:h-14 md:w-14",
            !speakerEnabled && "bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-500"
          )}
          onClick={toggleSpeaker}
        >
          {speakerEnabled ? <Volume2 className="h-5 w-5 md:h-6 md:w-6" /> : <VolumeX className="h-5 w-5 md:h-6 md:w-6" />}
        </Button>
      </div>
    </div>
  );
};
