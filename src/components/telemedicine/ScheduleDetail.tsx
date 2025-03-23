
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Consultation } from '@/types/telemedicine';
import { UserType } from '@/utils/storageUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { 
  Video, 
  Phone, 
  Calendar, 
  Clock, 
  FilePlus, 
  History,
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { VideoCallUI } from './VideoCallUI';
import { VoiceCallUI } from './VoiceCallUI';

interface ScheduleDetailProps {
  consultation: Consultation;
  userType: UserType;
}

export const ScheduleDetail = ({ consultation, userType }: ScheduleDetailProps) => {
  const isMobile = useIsMobile();
  const [rescheduling, setRescheduling] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    consultation.timestamp ? new Date(consultation.timestamp) : undefined
  );
  const [selectedTime, setSelectedTime] = useState(
    consultation.timestamp ? new Date(consultation.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) : "12:00"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [callType, setCallType] = useState<'video' | 'voice' | null>(null);
  
  const canJoinCall = Date.now() >= consultation.timestamp - 5 * 60 * 1000 && 
                      Date.now() <= consultation.timestamp + 30 * 60 * 1000;

  const otherPersonName = userType === UserType.PATIENT 
    ? consultation.doctorName 
    : consultation.patientName || 'Patient';
    
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
    
  const handleReschedule = () => {
    if (!selectedDate) {
      toast({
        title: "Invalid date",
        description: "Please select a valid date for rescheduling",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Consultation rescheduled",
        description: `Your appointment has been rescheduled to ${format(selectedDate, 'PPPP')} at ${selectedTime}`,
      });
      setRescheduling(false);
      setIsSubmitting(false);
    }, 1500);
  };

  const startCall = (type: 'video' | 'voice') => {
    setCallType(type);
    setInCall(true);
    
    toast({
      title: `${type === 'video' ? 'Video' : 'Voice'} call started`,
      description: `Connected with ${otherPersonName}`,
    });
  };

  const endCall = () => {
    setInCall(false);
    setCallType(null);
    
    toast({
      title: "Call ended",
      description: "Your call has been ended",
    });
  };

  // If in a call, show the call UI
  if (inCall && callType) {
    return callType === 'video' ? (
      <VideoCallUI 
        consultation={consultation}
        userType={userType}
        onEndCall={endCall}
      />
    ) : (
      <VoiceCallUI
        consultation={consultation}
        userType={userType}
        onEndCall={endCall}
      />
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-lg">{consultation.type.charAt(0).toUpperCase() + consultation.type.slice(1)} Consultation</h3>
          <p className="text-sm text-muted-foreground">{consultation.specialty}</p>
        </div>
        
        <Badge 
          variant="outline" 
          className={cn(
            "rounded-full font-normal",
            consultation.status === 'completed' ? "bg-green-50 text-green-700" :
            consultation.status === 'scheduled' ? "bg-blue-50 text-blue-700" :
            consultation.status === 'pending' ? "bg-amber-50 text-amber-700" :
            consultation.status === 'active' ? "bg-purple-50 text-purple-700" :
            "bg-red-50 text-red-700"
          )}
        >
          {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
        </Badge>
      </div>
      
      <div className="flex items-center gap-3 py-3 border-t border-b">
        <Avatar className="h-12 w-12 md:h-14 md:w-14 border">
          <AvatarFallback className="bg-health-primary/10 text-health-primary">
            {otherPersonName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{otherPersonName}</h4>
          <p className="text-sm text-muted-foreground">{
            userType === UserType.PATIENT ? "Healthcare Provider" : "Patient"
          }</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(consultation.timestamp)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{formatTime(consultation.timestamp)}</span>
        </div>
        
        {consultation.duration && (
          <div className="flex items-center gap-2 text-sm">
            <History className="h-4 w-4 text-muted-foreground" />
            <span>{consultation.duration} minutes</span>
          </div>
        )}
        
        {consultation.notes && (
          <div className="mt-4">
            <Label className="mb-1 block">Notes</Label>
            <div className="p-3 bg-muted rounded-md text-sm">
              {consultation.notes}
            </div>
          </div>
        )}
      </div>
      
      {rescheduling ? (
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">Reschedule Appointment</h4>
          
          <div className="space-y-2">
            <Label>Date</Label>
            <Input 
              type="date" 
              value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''} 
              onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Time</Label>
            <Input 
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="default" 
              onClick={handleReschedule}
              disabled={isSubmitting || !selectedDate}
              className="flex-1"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setRescheduling(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-4 flex flex-col gap-2">
          {consultation.type === 'video' && (
            <Button 
              disabled={!canJoinCall && consultation.status === 'scheduled'}
              className={cn(
                !canJoinCall && consultation.status === 'scheduled' ? "opacity-50" : "",
                "bg-health-primary hover:bg-health-primary/90 text-white"
              )}
              onClick={() => startCall('video')}
            >
              <Video className="mr-2 h-4 w-4" />
              {canJoinCall ? "Join Video Call" : "Video Call"}
            </Button>
          )}
          
          {consultation.type === 'voice' && (
            <Button 
              disabled={!canJoinCall && consultation.status === 'scheduled'}
              className={cn(
                !canJoinCall && consultation.status === 'scheduled' ? "opacity-50" : "",
              )}
              onClick={() => startCall('voice')}
            >
              <Phone className="mr-2 h-4 w-4" />
              {canJoinCall ? "Join Voice Call" : "Voice Call"}
            </Button>
          )}
          
          {consultation.status === 'scheduled' && (
            <Button 
              variant="outline" 
              onClick={() => setRescheduling(true)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Reschedule
            </Button>
          )}
          
          {userType === UserType.HEALTH_WORKER && consultation.type !== 'message' && (
            <Button variant="outline">
              <FilePlus className="mr-2 h-4 w-4" />
              Add Report
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
