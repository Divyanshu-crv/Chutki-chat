import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-3 bg-neutral-50 p-2 rounded-2xl border border-neutral-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 bg-transparent border-none focus:ring-0 p-2 text-neutral-800 resize-none max-h-[120px] min-h-[40px] leading-relaxed"
      />
      
      <button
        type="submit"
        disabled={!text.trim()}
        className={cn(
          "p-2.5 rounded-xl transition-all duration-200 shadow-sm",
          text.trim() 
            ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-200" 
            : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
        )}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
