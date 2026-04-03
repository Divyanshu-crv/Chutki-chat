import { useState, useEffect, useRef } from 'react';
import { db, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, handleFirestoreError, OperationType } from '../lib/firebase';
import { getAiResponse } from '../lib/gemini';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { LogOut, User, Sparkles, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatProps {
  user: any;
  onSignOut: () => void;
}

export default function Chat({ user, onSignOut }: ChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isAiMode, setIsAiMode] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = 'messages';
    const q = query(collection(db, path), orderBy('timestamp', 'asc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const messageData = {
      text,
      senderId: user.uid,
      senderName: user.displayName,
      senderPhoto: user.photoURL,
      timestamp: serverTimestamp(),
      isAiResponse: false,
    };

    try {
      const path = 'messages';
      await addDoc(collection(db, path), messageData);

      if (isAiMode) {
        setIsTyping(true);
        const aiResponse = await getAiResponse(text, useThinking);
        
        await addDoc(collection(db, path), {
          text: aiResponse,
          senderId: 'ai-assistant',
          senderName: useThinking ? 'Nexus Pro' : 'Nexus Flash',
          senderPhoto: null,
          timestamp: serverTimestamp(),
          isAiResponse: true,
          isThinking: useThinking,
        });
        setIsTyping(false);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'messages');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-white shadow-2xl shadow-neutral-200/50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full border-2 border-blue-100" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h2 className="font-bold text-neutral-900 leading-tight">{user.displayName}</h2>
            <p className="text-xs text-neutral-500">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 mr-4 px-3 py-1.5 bg-neutral-50 rounded-full border border-neutral-100">
            <button
              onClick={() => setIsAiMode(!isAiMode)}
              className={`p-1 rounded-md transition-colors ${isAiMode ? 'text-blue-600 bg-blue-50' : 'text-neutral-400 hover:text-neutral-600'}`}
              title="Toggle AI Response"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-neutral-200 mx-1" />
            <button
              onClick={() => setUseThinking(!useThinking)}
              className={`p-1 rounded-md transition-colors ${useThinking ? 'text-purple-600 bg-purple-50' : 'text-neutral-400 hover:text-neutral-600'}`}
              title="Toggle Thinking Mode"
            >
              <BrainCircuit className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onSignOut}
            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-neutral-50/30"
      >
        <MessageList messages={messages} currentUserId={user.uid} />
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-neutral-400 text-sm"
          >
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
            </div>
            Nexus is thinking...
          </motion.div>
        )}
      </div>

      {/* Input */}
      <footer className="p-4 bg-white border-t border-neutral-100">
        <div className="sm:hidden flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => setIsAiMode(!isAiMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isAiMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-neutral-100 text-neutral-600'}`}
          >
            <Sparkles className="w-4 h-4" />
            AI Mode
          </button>
          <button
            onClick={() => setUseThinking(!useThinking)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${useThinking ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-neutral-100 text-neutral-600'}`}
          >
            <BrainCircuit className="w-4 h-4" />
            Thinking
          </button>
        </div>
        <MessageInput onSendMessage={handleSendMessage} />
      </footer>
    </div>
  );
}
