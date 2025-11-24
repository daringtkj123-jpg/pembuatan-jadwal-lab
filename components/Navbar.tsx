import React from 'react';
import { Calendar, Home, School, Users, LogIn, LogOut, UserPlus, FileSpreadsheet } from 'lucide-react';
import { UserState } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: UserState;
  onLogout: () => void;
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, user, onLogout, onLoginClick }) => {
  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home, roles: ['guest', 'teacher', 'admin'] },
    { id: 'profile', label: 'Profil Sekolah', icon: School, roles: ['guest', 'teacher', 'admin'] },
    { id: 'students', label: 'Profil Murid', icon: Users, roles: ['guest', 'teacher', 'admin'] },
    { id: 'dashboard', label: 'Jadwal Lab', icon: Calendar, roles: ['guest', 'teacher', 'admin'] },
    { id: 'users', label: 'Manajemen Akun', icon: UserPlus, roles: ['admin'] },
  ];

  return (
    <nav className="bg-blue-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <School className="h-8 w-8 text-yellow-400 mr-3" />
            <div>
              <span className="block font-bold text-lg leading-tight">SMK Bina Nusantara</span>
              <span className="text-xs text-blue-200">Sistem Penjadwalan Lab</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.filter(item => item.roles.includes(user.role)).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                    ${currentPage === item.id 
                      ? 'bg-blue-800 text-white' 
                      : 'text-blue-100 hover:bg-blue-700'
                    }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
             {user.isLoggedIn ? (
               <>
                 <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-blue-300 capitalize">{user.role}</div>
                 </div>
                 <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-800 hover:bg-red-600 transition-colors text-xs font-bold uppercase tracking-wider"
                    title="Logout"
                 >
                    <LogOut size={14} />
                    Logout
                 </button>
               </>
             ) : (
                <button 
                  onClick={onLoginClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 text-blue-900 hover:bg-yellow-300 transition-colors text-sm font-bold shadow-lg"
                >
                  <LogIn size={16} />
                  Login
                </button>
             )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className="md:hidden bg-blue-800 flex justify-around py-2">
          {navItems.filter(item => item.roles.includes(user.role)).map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`p-2 rounded-full ${currentPage === item.id ? 'bg-blue-900 text-yellow-400' : 'text-white'}`}
            >
              <item.icon size={20} />
            </button>
          ))}
      </div>
    </nav>
  );
};