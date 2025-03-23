
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Send, User, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Patient } from '@/utils/patientUtils';
import { Message, saveMessage, getMessagesBetweenUsers } from '@/utils/storageUtils';
import { toast } from '@/hooks/use-toast';

interface MessageDialogProps {
  isOpen: boolean;
  patient: Patient | null;
  healthWorkerId: string;
  onClose: () => void;
}

export function MessageDialog({ isOpen, patient, healthWorkerId, onClose }: MessageDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen && patient) {
      // Load existing messages
      const existingMessages = getMessagesBetweenUsers(healthWorkerId, patient.id);
      setMessages(existingMessages);
    }
  }, [isOpen, patient, healthWorkerId]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !patient) return;
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: healthWorkerId,
      receiverId: patient.id,
      content: newMessage.trim(),
      read: false,
      timestamp: Date.now()
    };
    
    saveMessage(message);
    setMessages([...messages, message]);
    setNewMessage('');
    
    toast({
      title: "Message sent",
      description: `Your message to ${patient.firstName} ${patient.lastName} has been sent.`,
    });
  };
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const dateKey = formatDate(message.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {patient ? `Message ${patient.firstName} ${patient.lastName}` : 'Messages'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[60vh]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {patient ? (
              Object.entries(messageGroups).length > 0 ? (
                Object.entries(messageGroups).map(([date, dateMessages]) => (
                  <div key={date}>
                    <div className="text-xs text-center text-muted-foreground my-2">
                      {date}
                    </div>
                    <div className="space-y-3">
                      {dateMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className={cn(
                            "flex",
                            message.senderId === healthWorkerId ? "justify-end" : "justify-start"
                          )}
                        >
                          <div className={cn(
                            "max-w-[80%] p-3 rounded-lg",
                            message.senderId === healthWorkerId 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          )}>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 text-right mt-1">
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <User className="h-8 w-8 mx-auto mb-2" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start your conversation with {patient.firstName}</p>
                  </div>
                </div>
              )
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Select a patient to message</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {patient && (
            <div className="p-3 border-t mt-auto">
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="min-h-[40px] resize-none"
                />
                <Button 
                  className="shrink-0"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
