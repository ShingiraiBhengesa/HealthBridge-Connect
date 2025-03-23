
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, X, Send, ThumbsUp, ThumbsDown, MessageSquare, 
  Brain, Clock, Sparkles, RefreshCw, Paperclip, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-mobile';
import { getHomeRemedySuggestions, initChatContext } from '@/utils/chatbotUtils';
import { FileUploadPreview } from '@/components/telemedicine/FileUploadPreview';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
  feedback?: 'positive' | 'negative';
}

interface FilePreview {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
}

const welcomeMessage: Message = {
  id: 'welcome',
  content: 'Hello! I\'m your HealthBridge Assistant. I can help with home remedies for common symptoms, answer questions about the app, or provide health information. What can I assist you with today?',
  sender: 'bot',
  timestamp: Date.now(),
};

const suggestions = [
  "How to use the app",
  "Headache remedies",
  "Sore throat help",
  "Trouble sleeping",
  "Back pain relief",
  "Feeling anxious"
];

export function ChatbotUI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset context when chat is opened
  useEffect(() => {
    if (isOpen) {
      initChatContext();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() && files.length === 0) return;
    
    let messageContent = input.trim();
    
    // If there are files, mention them in the message
    if (files.length > 0) {
      const fileNames = files.map(file => file.name).join(', ');
      if (messageContent) {
        messageContent += `\n\n(Attached: ${fileNames})`;
      } else {
        messageContent = `I've shared ${files.length} file(s): ${fileNames}`;
      }
    }
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content: messageContent,
      sender: 'user',
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setChatHistory(prev => [...prev, messageContent]);
    setInput('');
    setFiles([]);
    setIsTyping(true);
    
    try {
      // Add slight delay to simulate AI thinking
      const thinkingTime = Math.min(700 + messageContent.length * 2, 2000);
      
      setTimeout(() => {
        // Get response from the utility function
        const remedyResponse = getHomeRemedySuggestions(messageContent);
        
        const botMessage: Message = {
          id: uuidv4(),
          content: remedyResponse,
          sender: 'bot',
          timestamp: Date.now(),
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, thinkingTime);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      setIsTyping(false);
      
      // Send error message
      const errorMessage: Message = {
        id: uuidv4(),
        content: "I'm sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Option to auto-send or let user modify first
    // handleSendMessage(); // Auto-send
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: FilePreview[] = Array.from(e.target.files).map(file => {
        const preview = file.type.startsWith('image/') 
          ? URL.createObjectURL(file) 
          : undefined;
          
        return {
          id: uuidv4(),
          name: file.name,
          type: file.type,
          size: file.size,
          preview
        };
      });
      
      setFiles(prev => [...prev, ...newFiles]);
      
      // Reset the input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleFileRemove = (id: string) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(file => file.id !== id);
      return updatedFiles;
    });
  };
  
  const handleFeedback = (messageId: string, type: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, feedback: type } 
        : msg
    ));
    
    // Could add API call here to log feedback for future improvements
    // logFeedback(messageId, type);
    
    // Show feedback confirmation
    if (type === 'positive') {
      // Thank user for positive feedback
      setTimeout(() => {
        const thankMessage: Message = {
          id: uuidv4(),
          content: "Thank you for your feedback! I'm glad I could help.",
          sender: 'bot',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, thankMessage]);
      }, 500);
    } else {
      // Acknowledge negative feedback and offer alternatives
      setTimeout(() => {
        const improveMessage: Message = {
          id: uuidv4(),
          content: "I'm sorry my response wasn't helpful. Would you like to rephrase your question or speak with a healthcare professional for more specific advice?",
          sender: 'bot',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, improveMessage]);
      }, 500);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const resetChat = () => {
    setMessages([welcomeMessage]);
    setChatHistory([]);
    setInput('');
    setFiles([]);
    initChatContext();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button 
              size="icon" 
              className="h-14 w-14 rounded-full shadow-lg bg-health-primary hover:bg-health-primary/90"
            >
              <Bot className="h-6 w-6 text-white" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[80vh]">
            <div className="h-full flex flex-col p-0 mx-auto w-full max-w-md">
              {renderChatContent()}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <>
          {!isOpen ? (
            <Button 
              size="icon" 
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full shadow-lg bg-health-primary hover:bg-health-primary/90"
            >
              <Bot className="h-6 w-6 text-white" />
            </Button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border"
            >
              {renderChatContent()}
            </motion.div>
          )}
        </>
      )}
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef}
        multiple
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,application/pdf"
      />
    </div>
  );

  function renderChatContent() {
    return (
      <>
        <div className="p-4 border-b flex items-center justify-between bg-health-primary text-white">
          <div className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            <h3 className="font-medium">HealthBridge Assistant</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={resetChat}
              className="h-8 w-8 rounded-full text-white hover:bg-health-primary/80"
              title="Reset conversation"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full text-white hover:bg-health-primary/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[85%] rounded-lg p-3",
                  message.sender === 'user' 
                    ? "bg-health-primary text-white" 
                    : "bg-gray-100 text-gray-800"
                )}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {message.sender === 'bot' && (
                    <div className="mt-2 flex justify-end gap-2">
                      {!message.feedback && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleFeedback(message.id, 'positive')}
                            className="h-6 w-6 rounded-full hover:bg-gray-200"
                            title="Helpful response"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleFeedback(message.id, 'negative')}
                            className="h-6 w-6 rounded-full hover:bg-gray-200"
                            title="Not helpful"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      
                      {message.feedback === 'positive' && (
                        <span className="text-xs text-green-600">Thanks for your feedback!</span>
                      )}
                      
                      {message.feedback === 'negative' && (
                        <span className="text-xs text-amber-600">Thanks for letting us know</span>
                      )}
                    </div>
                  )}
                  
                  {message.sender === 'bot' && message.id !== welcomeMessage.id && (
                    <div className="mt-1 flex items-center text-[10px] text-gray-500">
                      <Clock className="h-2.5 w-2.5 mr-1" />
                      <span>{new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      <Sparkles className="h-2.5 w-2.5 ml-2 mr-1 text-health-primary" />
                      <span>AI Powered</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 rounded-lg p-3 px-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" 
                         style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" 
                         style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" 
                         style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messageEndRef} />
          </AnimatePresence>
          
          {messages.length === 1 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Try asking about:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {files.length > 0 && (
          <div className="px-3 pb-2">
            <FileUploadPreview 
              files={files} 
              onRemove={handleFileRemove} 
              className="max-h-[120px] overflow-y-auto"
            />
          </div>
        )}
        
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-[60px] shrink-0"
              onClick={() => fileInputRef.current?.click()}
              title="Attach files"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1 flex flex-col">
              <Textarea
                placeholder="Type your health question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[60px] resize-none flex-1"
              />
              {chatHistory.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">Privacy note:</span> Your questions are processed locally and not stored on any server.
                </div>
              )}
            </div>
            <Button 
              className="h-[60px] rounded-full bg-health-primary hover:bg-health-primary/90 transition-colors shrink-0"
              onClick={handleSendMessage}
              disabled={!input.trim() && files.length === 0}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-center mt-2 text-gray-500">
            This chatbot provides general information, not medical advice. 
            For serious symptoms, please consult a healthcare professional.
          </p>
        </div>
      </>
    );
  }
}
