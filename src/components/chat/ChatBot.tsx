
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Bot, User, X } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Xin chào! Tôi là trợ lý AI y tế. Tôi có thể giúp bạn trả lời các câu hỏi về sức khỏe, triệu chứng, hoặc hướng dẫn chăm sóc cơ bản. Bạn cần hỗ trợ gì?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('đau đầu')) {
      return 'Đau đầu có thể do nhiều nguyên nhân như căng thẳng, mất ngủ, hoặc tăng huyết áp. Bạn nên nghỉ ngơi, uống đủ nước và nếu đau không giảm sau 24h, hãy đến gặp bác sĩ.';
    } else if (input.includes('sốt')) {
      return 'Sốt là dấu hiệu cơ thể đang chống lại nhiễm trùng. Bạn nên uống nhiều nước, nghỉ ngơi và nếu sốt trên 38.5°C kéo dài, hãy liên hệ bác sĩ ngay.';
    } else if (input.includes('ho')) {
      return 'Ho có thể do cảm lạnh, dị ứng hoặc nhiễm trùng. Uống nước ấm, mật ong và tránh khói bụi. Nếu ho có máu hoặc kéo dài trên 2 tuần, cần khám bác sĩ.';
    } else if (input.includes('đặt lịch') || input.includes('hẹn')) {
      return 'Để đặt lịch hẹn với bác sĩ, bạn có thể sử dụng chức năng "Đặt lịch hẹn" trong trang chính hoặc gọi hotline của bệnh viện.';
    } else if (input.includes('thuốc')) {
      return 'Tôi không thể tư vấn cụ thể về thuốc. Mọi việc sử dụng thuốc cần theo chỉ định của bác sĩ. Bạn nên tham khảo ý kiến bác sĩ trước khi dùng bất kỳ loại thuốc nào.';
    } else {
      return 'Cảm ơn bạn đã chia sẻ. Tôi khuyên bạn nên tham khảo ý kiến bác sĩ để được tư vấn chính xác nhất. Có điều gì khác tôi có thể giúp bạn không?';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <span>Trợ lý AI Y tế</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && (
                    <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                  )}
                  {message.sender === 'user' && (
                    <User className="w-4 h-4 mt-1 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Nhập câu hỏi của bạn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Lưu ý: Đây chỉ là tư vấn cơ bản. Vui lòng tham khảo ý kiến bác sĩ cho chẩn đoán chính xác.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
