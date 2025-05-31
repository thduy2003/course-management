'use client';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  if (!user) return null;

  return (
    <header className="flex items-center justify-end w-full p-4 bg-white rounded-2xl shadow mb-6">
      <div className="flex items-center space-x-3">
        <img src="/avatar.png" alt="Avatar" className="w-12 h-12 rounded-full border" />
        <div className="flex flex-col">
          <span className="font-bold">{user.name}</span>
          <span className="text-sm text-gray-500">{user.role}</span>
        </div>
        <button onClick={handleLogout} className="ml-4 p-2 rounded hover:bg-gray-100 transition">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" stroke="currentColor" />
          </svg>
        </button>
      </div>
    </header>
  );
} 