
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  Send, 
  Paperclip, 
  WifiOff, 
  CheckCircle2,
  AlertCircle,
  Video,
  Phone,
  Mic,
  Image
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserType } from '@/utils/storageUtils';
import { addToOfflineQueue } from '@/utils/storageUtils';
import { Consultation, Message, Attachment } from '@/types/telemedicine';
import { FileUploadDialog } from './FileUploadDialog';
import { FileUploadPreview } from './FileUploadPreview';
import { generateThumbnail } from '@/utils/fileUploadUtils';

interface MessageDetailProps {
  consultation: Consultation;
  userType: UserType;
}

export const MessageDetail = ({ 
  consultation, 
  userType 
}: MessageDetailProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [messages, setMessages] = useState<Message[]>(consultation.messages || []);
  const [isRecording, setIsRecording] = useState(false);
  const [isAttaching, setIsAttaching] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && pendingAttachments.length === 0) return;
    
    const attachments = pendingAttachments.map(attachment => ({
      id: attachment.id,
      name: attachment.name,
      type: attachment.type,
      url: attachment.base64,
      thumbnail: attachment.type.startsWith('image/') ? attachment.base64 : undefined
    }));
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage.trim(),
      sender: userType === UserType.PATIENT ? 'patient' : 'doctor',
      timestamp: Date.now(),
      status: isOnline ? 'sent' : 'sending',
      attachments: attachments.length > 0 ? attachments : undefined
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    setPendingAttachments([]);
    
    if (!isOnline) {
      addToOfflineQueue({
        operation: 'sync_patient_data',
        data: { type: 'consultation_message', consultationId: consultation.id, message: newMsg },
        type: 'telemedicine'
      });
      
      toast({
        title: "Message saved offline",
        description: "Your message will be sent when connectivity is restored.",
      });
    }
  };

  const handleAttachment = () => {
    setShowUploadDialog(true);
  };

  const handleFileUpload = (files: { id: string; name: string; type: string; base64: string }[]) => {
    setPendingAttachments(files);
  };

  const removeAttachment = (id: string) => {
    setPendingAttachments(pendingAttachments.filter(file => file.id !== id));
  };

  const handleRecordAudio = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast({
        title: "Recording started",
        description: "Click the microphone again to stop recording.",
      });
    } else {
      toast({
        title: "Recording stopped",
        description: "Audio message will be available soon.",
      });
    }
  };

  const formatMessageTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatMessageDate = (timestamp: number) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const otherPersonName = userType === UserType.PATIENT 
    ? consultation.doctorName 
    : consultation.patientName || 'Patient';

  return (
    <div className="flex flex-col h-[65vh]">
      <div className="p-3 md:p-4 border-b flex items-center justify-between bg-card sticky top-0 z-10">
        <div className="flex items-center gap-2 md:gap-3">
          <Avatar className="h-8 w-8 md:h-10 md:w-10 border">
            <AvatarFallback className="bg-health-primary/10 text-health-primary text-xs md:text-sm">
              {otherPersonName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm md:text-base">{otherPersonName}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">{consultation.specialty}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2">
          <Badge 
            variant="outline" 
            className={cn(
              "rounded-full font-normal text-xs md:text-sm transition-colors",
              consultation.status === 'completed' ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700" :
              consultation.status === 'scheduled' ? "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700" :
              consultation.status === 'pending' ? "bg-amber-50 text-amber-700 hover:bg-amber-50 hover:text-amber-700" :
              consultation.status === 'active' ? "bg-purple-50 text-purple-700 hover:bg-purple-50 hover:text-purple-700" :
              "bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700"
            )}
          >
            {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
          </Badge>
          
          {consultation.type !== 'message' && (
            <Button variant="outline" size="icon" className="h-8 w-8 md:h-9 md:w-9 rounded-full">
              {consultation.type === 'video' ? 
                <Video className="h-3 w-3 md:h-4 md:w-4" /> : 
                <Phone className="h-3 w-3 md:h-4 md:w-4" />
              }
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
        {messages.length > 0 ? (
          <>
            {messages.map((message, index) => (
              <div key={message.id} className="space-y-1">
                {index === 0 || formatMessageDate(message.timestamp) !== formatMessageDate(messages[index - 1].timestamp) ? (
                  <div className="text-xs text-center text-muted-foreground my-2">
                    {formatMessageDate(message.timestamp)}
                  </div>
                ) : null}
                
                <div className={cn(
                  "flex",
                  (message.sender === 'patient' && userType === UserType.PATIENT) || 
                  (message.sender === 'doctor' && userType === UserType.HEALTH_WORKER) 
                    ? "justify-end" 
                    : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[85%] md:max-w-[80%] rounded-lg p-2 md:p-3",
                    (message.sender === 'patient' && userType === UserType.PATIENT) || 
                    (message.sender === 'doctor' && userType === UserType.HEALTH_WORKER)
                      ? "bg-health-primary text-white rounded-tr-none" 
                      : "bg-muted rounded-tl-none"
                  )}>
                    {message.content && (
                      <p className="text-xs md:text-sm">{message.content}</p>
                    )}
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className={cn(
                        "flex flex-wrap gap-1 md:gap-2", 
                        message.content ? "mt-2" : ""
                      )}>
                        {message.attachments.map((attachment) => (
                          attachment.type.startsWith('image/') ? (
                            <div 
                              key={attachment.id} 
                              className="relative overflow-hidden rounded-md cursor-pointer"
                              onClick={() => window.open(attachment.url, '_blank')}
                            >
                              <img 
                                src={attachment.thumbnail || attachment.url} 
                                alt={attachment.name}
                                className="max-h-32 max-w-32 object-cover rounded-md border"
                              />
                            </div>
                          ) : (
                            <div 
                              key={attachment.id} 
                              className="bg-black/10 text-xs py-0.5 px-1 md:py-1 md:px-2 rounded flex items-center cursor-pointer"
                              onClick={() => window.open(attachment.url, '_blank')}
                            >
                              <Paperclip className="h-2 w-2 md:h-3 md:w-3 mr-1" />
                              <span className="text-[10px] md:text-xs truncate max-w-[100px] md:max-w-full">
                                {attachment.name}
                              </span>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    
                    <div className="text-[10px] md:text-xs opacity-70 text-right mt-1 flex justify-end items-center gap-1">
                      {formatMessageTime(message.timestamp)}
                      {((message.sender === 'patient' && userType === UserType.PATIENT) ||
                        (message.sender === 'doctor' && userType === UserType.HEALTH_WORKER)) && (
                        message.status === 'read' ? 
                          <CheckCircle2 className="h-2 w-2 md:h-3 md:w-3" /> : 
                        message.status === 'failed' ? 
                          <AlertCircle className="h-2 w-2 md:h-3 md:w-3" /> : 
                          null
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground p-4">
              <div className="p-3 bg-muted/30 rounded-full inline-block mb-2">
                <Send className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <p className="text-sm md:text-base">No messages yet</p>
              <p className="text-xs md:text-sm">Start your conversation with {otherPersonName}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-2 md:p-3 border-t">
        {!isOnline && (
          <div className="bg-amber-100 text-amber-800 text-[10px] md:text-xs p-1.5 md:p-2 rounded-md mb-1.5 md:mb-2 flex items-center">
            <WifiOff className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 
            You're offline. Messages will be sent when connectivity is restored.
          </div>
        )}
        
        {pendingAttachments.length > 0 && (
          <div className="mb-2">
            <FileUploadPreview 
              files={pendingAttachments.map(file => ({
                id: file.id,
                name: file.name,
                type: file.type,
                size: file.size || 0,
                preview: file.type.startsWith('image/') ? file.base64 : undefined
              }))}
              onRemove={removeAttachment}
            />
          </div>
        )}
        
        <div className="flex gap-1 md:gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className={cn(
              "rounded-full h-8 w-8 md:h-9 md:w-9", 
              isAttaching && "text-health-primary"
            )}
            onClick={handleAttachment}
          >
            <Paperclip className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className={cn(
              "rounded-full h-8 w-8 md:h-9 md:w-9", 
              isRecording && "text-health-primary bg-health-primary/10"
            )}
            onClick={handleRecordAudio}
          >
            <Mic className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Input 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="rounded-full text-xs md:text-sm h-8 md:h-9"
          />
          <Button 
            variant="default" 
            size="icon" 
            className="rounded-full h-8 w-8 md:h-9 md:w-9"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && pendingAttachments.length === 0}
          >
            <Send className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>

      <FileUploadDialog 
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUpload={handleFileUpload}
        maxFiles={5}
        allowedTypes={['image', 'application', 'text']}
        maxSizeMB={5}
      />
    </div>
  );
};
