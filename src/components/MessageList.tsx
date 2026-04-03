import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { User, Sparkles, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';

interface MessageListProps {
  messages: any[];
  currentUserId: string;
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  return (
    <div className="flex flex-col gap-6">
      {messages.map((msg, index) => {
        const isMe = msg.senderId === currentUserId;
        const isAi = msg.senderId === 'ai-assistant';
        
        return (
          <motion.div
            key={msg.id || index}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex items-end gap-3",
              isMe ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar */}
            {!isMe && (
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border shadow-sm",
                isAi ? "bg-blue-50 border-blue-100" : "bg-neutral-100 border-neutral-200"
              )}>
                {isAi ? (
                  msg.isThinking ? <BrainCircuit className="w-4 h-4 text-purple-600" /> : <Sparkles className="w-4 h-4 text-blue-600" />
                ) : (
                  msg.senderPhoto ? (
                    <img src={msg.senderPhoto} alt={msg.senderName} className="w-full h-full rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-4 h-4 text-neutral-500" />
                  )
                )}
              </div>
            )}

            {/* Message Bubble */}
            <div className={cn(
              "max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm",
              isMe ? "bg-blue-600 text-white rounded-br-none" : 
              isAi ? "bg-white border border-blue-100 text-neutral-800 rounded-bl-none" : 
              "bg-white border border-neutral-200 text-neutral-800 rounded-bl-none"
            )}>
              {!isMe && (
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60",
                  isAi ? "text-blue-600" : "text-neutral-500"
                )}>
                  {msg.senderName}
                </p>
              )}
              
              <div className={cn(
                "prose prose-sm max-w-none break-words",
                isMe ? "prose-invert" : "text-neutral-800"
              )}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>

              {msg.timestamp && (
                <p className={cn(
                  "text-[10px] mt-1.5 text-right opacity-50",
                  isMe ? "text-white" : "text-neutral-500"
                )}>
                  {new Date(msg.timestamp?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
