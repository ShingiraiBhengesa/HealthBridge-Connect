
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, X, Send, ThumbsUp, ThumbsDown, MessageSquare, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-mobile';
import { getHomeRemedySuggestions } from '@/utils/chatbotUtils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

const welcomeMessage: Message = {
  id: 'welcome',
  content: 'Hello! I can help with home remedies for common symptoms. What are you experiencing today?',
  sender: 'bot',
  timestamp: Date.now(),
};

const suggestions = [
  "Headache remedies",
  "Sore throat help",
  "Stomach pain relief",
  "Common cold tips",
  "Fever management"
];

export function ChatbotUI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: input.trim(),
      sender: 'user',
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Simulate API delay
      setTimeout(() => {
        // Get response from the utility function
        const remedyResponse = getHomeRemedySuggestions(input.trim());
        
        const botMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          content: remedyResponse,
          sender: 'bot',
          timestamp: Date.now(),
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      setIsTyping(false);
      
      // Send error message
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: "I'm sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSendMessage();
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
          <DrawerContent className="h-[70vh]">
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
              className="w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border"
            >
              {renderChatContent()}
            </motion.div>
          )}
        </>
      )}
    </div>
  );

  function renderChatContent() {
    return (
      <>
        <div className="p-4 border-b flex items-center justify-between bg-health-primary text-white">
          <div className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Health Assistant</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 rounded-full text-white hover:bg-health-primary/80"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full hover:bg-gray-200"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full hover:bg-gray-200"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
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
        
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-[60px] resize-none"
            />
            <Button 
              className="h-auto rounded-full bg-health-primary hover:bg-health-primary/90 transition-colors"
              onClick={handleSendMessage}
              disabled={!input.trim()}
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
