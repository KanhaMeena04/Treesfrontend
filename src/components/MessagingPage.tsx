import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search, MoreVertical, Image, Paperclip, AlertCircle, Smile, Mic, Video } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

const mockChats = [
  {
    id: '1',
    user: { name: 'Alice Johnson', avatar: '/placeholder.svg', online: true, username: 'alice' },
    lastMessage: 'Hey! How are you?',
    timestamp: '2m ago',
    unread: 2,
    type: 'general'
  },
  {
    id: '2',
    user: { name: 'Bob Smith', avatar: '/placeholder.svg', online: false, username: 'bob' },
    lastMessage: 'Thanks for the match! 😊',
    timestamp: '1h ago',
    unread: 0,
    type: 'match'
  },
  {
    id: '3',
    user: { name: 'Emma Wilson', avatar: '/placeholder.svg', online: true, username: 'emma' },
    lastMessage: 'Love your new post!',
    timestamp: '3h ago',
    unread: 1,
    type: 'general'
  }
];

const mockMessages = [
  {
    id: '1',
    sender: 'Alice Johnson',
    content: 'Hey! How are you?',
    timestamp: '2:30 PM',
    isMe: false,
    type: 'text'
  },
  {
    id: '2',
    sender: 'Me',
    content: 'I\'m doing great! Thanks for asking.',
    timestamp: '2:32 PM',
    isMe: true,
    type: 'text'
  },
  {
    id: '3',
    sender: 'Alice Johnson',
    content: 'That\'s awesome! Want to grab coffee sometime?',
    timestamp: '2:33 PM',
    isMe: false,
    type: 'text'
  }
];

export const MessagingPage = () => {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const validateMessage = (message: string): boolean => {
    if (!message.trim()) {
      setMessageError('Message cannot be empty');
      return false;
    }
    if (message.length > 1000) {
      setMessageError('Message cannot exceed 1000 characters');
      return false;
    }
    setMessageError('');
    return true;
  };

  const handleSendMessage = async () => {
    if (!validateMessage(newMessage)) {
      return;
    }

    setIsSending(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const message = {
        id: Date.now().toString(),
        sender: 'Me',
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        type: 'text'
      };

      setMessages([...messages, message]);
      setNewMessage('');
      setMessageError('');

      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate reply
        const reply = {
          id: (Date.now() + 1).toString(),
          sender: selectedChat.user.name,
          content: 'Thanks for your message! I\'ll get back to you soon.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          type: 'text'
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);

      toast({
        title: 'Message sent!',
        description: 'Your message has been delivered',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = mockChats.filter(chat => 
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlockUser = (userId: string) => {
    toast({
      title: 'User Blocked',
      description: 'User has been blocked successfully',
    });
  };

  const handleReportUser = (userId: string) => {
    toast({
      title: 'User Reported',
      description: 'Thank you for helping keep our community safe',
    });
  };

  const handleDeleteChat = (userId: string) => {
    toast({
      title: 'Chat Deleted',
      description: 'Chat history has been deleted',
    });
  };

  const handleAttachment = (type: 'image' | 'video' | 'file') => {
    toast({
      title: 'Attachment Feature',
      description: `${type} attachment feature coming soon!`,
    });
  };

  const handleVoiceMessage = () => {
    toast({
      title: 'Voice Message',
      description: 'Voice message feature coming soon!',
    });
  };

  const handleEmoji = () => {
    toast({
      title: 'Emoji Picker',
      description: 'Emoji picker feature coming soon!',
    });
  };

  return (
    <div className="h-screen flex">
      {/* Chat List */}
      <div className="w-80 border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          {filteredChats.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No conversations found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarImage src={chat.user.avatar} />
                      <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {chat.user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{chat.user.name}</h3>
                      <div className="flex items-center space-x-2">
                        {chat.type === 'match' && (
                          <Badge variant="secondary" className="text-xs">Match</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <Badge className="bg-primary text-white text-xs">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>
      
      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={selectedChat.user.avatar} />
              <AvatarFallback>{selectedChat.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{selectedChat.user.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedChat.user.online ? (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Online</span>
                  </span>
                ) : (
                  'Last seen recently'
                )}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleBlockUser(selectedChat.id)}>
                Block User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleReportUser(selectedChat.id)}>
                Report User
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteChat(selectedChat.id)}
                className="text-red-600"
              >
                Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isMe
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.isMe ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="space-y-3">
            {/* Error Message */}
            {messageError && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{messageError}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleAttachment('file')}
                className="hover:bg-gray-100"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleAttachment('image')}
                className="hover:bg-gray-100"
              >
                <Image className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleAttachment('video')}
                className="hover:bg-gray-100"
              >
                <Video className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleVoiceMessage}
                className="hover:bg-gray-100"
              >
                <Mic className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleEmoji}
                className="hover:bg-gray-100"
              >
                <Smile className="w-4 h-4" />
              </Button>
              
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  if (messageError) setMessageError('');
                }}
                onKeyPress={handleKeyPress}
                className="flex-1"
                maxLength={1000}
              />
              
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || isSending}
                size="icon"
                className="hover:bg-primary-dark"
              >
                {isSending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {/* Character Count */}
            <div className="text-xs text-muted-foreground text-right">
              {newMessage.length}/1000 characters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};