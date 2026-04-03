import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, doc, signInWithPopup, googleProvider, signOut } from './lib/firebase';
import { setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import Chat from './components/Chat';
import Login from './components/Login';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, loading, error] = useAuthState(auth);
  const [isProfileReady, setIsProfileReady] = useState(false);

  useEffect(() => {
    if (user) {
      const ensureUserProfile = async () => {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName || 'Anonymous',
            photoURL: user.photoURL || null,
            email: user.email || '',
            role: 'user',
            createdAt: serverTimestamp(),
          });
        }
        setIsProfileReady(true);
      };
      ensureUserProfile();
    } else {
      setIsProfileReady(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 p-4 text-center">
        <div className="max-w-md p-6 bg-white rounded-xl shadow-sm border border-red-100">
          <h1 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h1>
          <p className="text-neutral-600 mb-4">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-blue-100">
      {user && isProfileReady ? (
        <Chat user={user} onSignOut={() => signOut(auth)} />
      ) : (
        <Login onSignIn={() => signInWithPopup(auth, googleProvider)} />
      )}
    </div>
  );
}
