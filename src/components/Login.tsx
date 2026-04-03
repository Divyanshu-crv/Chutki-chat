import { MessageSquare, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onSignIn: () => void;
}

export default function Login({ onSignIn }: LoginProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl shadow-neutral-200/50 border border-neutral-100 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-blue-50 rounded-2xl">
          <MessageSquare className="w-8 h-8 text-blue-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Nexus Chat</h1>
        <p className="text-neutral-500 mb-8">
          A modern, AI-powered chat experience for everyone.
        </p>

        <button
          onClick={onSignIn}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-200"
        >
          <LogIn className="w-5 h-5" />
          Sign in with Google
        </button>

        <p className="mt-6 text-xs text-neutral-400">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
