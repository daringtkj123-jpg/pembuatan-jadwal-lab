import React, { useState } from 'react';
import { User } from '../types';
import { LogIn, Lock, User as UserIcon, X } from 'lucide-react';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  onClose: () => void;
}

export const Login: React.FC<LoginProps> = ({ users, onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 bg-blue-900 text-center relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
                <X size={24} />
            </button>
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <LogIn className="text-blue-900 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Login Sistem</h2>
            <p className="text-blue-200 text-sm mt-1">SMK Bina Nusantara</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
                    {error}
                </div>
            )}
            
            <div className="space-y-4">
                <div className="relative">
                    <UserIcon className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Username"
                        required
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Password"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform"
            >
                Masuk
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4">
                Hubungi administrator jika lupa password.
            </p>
        </form>
      </div>
    </div>
  );
};