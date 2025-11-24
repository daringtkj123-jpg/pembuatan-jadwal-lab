import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { UserManagement } from './components/UserManagement';
import { SCHOOL_INFO, INITIAL_BOOKINGS, ROMBELS, INITIAL_USERS } from './constants';
import { UserState, Booking, User } from './types';
import { MapPin, Phone, Mail, Users, Monitor, Server, Scissors, Coffee } from 'lucide-react';

const Home: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <div className="animate-in fade-in duration-500">
    <div className="bg-blue-900 text-white py-20 rounded-b-3xl shadow-xl relative overflow-hidden">
       <div className="absolute inset-0 bg-[url('https://picsum.photos/1200/600?blur=2')] opacity-20 bg-cover bg-center"></div>
       <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">SMK Bina Nusantara</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-8">{SCHOOL_INFO.description}</p>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition-transform hover:scale-105 shadow-lg"
          >
             Lihat Jadwal Lab
          </button>
       </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Monitor className="text-blue-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Fasilitas Lengkap</h3>
                <p className="text-gray-600">2 Laboratorium Komputer modern dengan spesifikasi tinggi untuk kebutuhan praktik.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">4 Konsentrasi Keahlian</h3>
                <p className="text-gray-600">Mencetak lulusan kompeten di bidang Otomotif, Jaringan, Busana, dan Perhotelan.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Server className="text-purple-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sistem Terintegrasi</h3>
                <p className="text-gray-600">Penjadwalan berbasis digital yang transparan dan mudah diakses oleh seluruh warga sekolah.</p>
            </div>
        </div>
    </div>
  </div>
);

const SchoolProfile: React.FC = () => (
  <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-48 bg-blue-800 relative">
              <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-black/60 to-transparent w-full">
                 <h2 className="text-3xl font-bold text-white">{SCHOOL_INFO.name}</h2>
              </div>
          </div>
          <div className="p-8">
              <div className="flex flex-col gap-4 text-gray-600 mb-8">
                  <div className="flex items-start gap-3">
                      <MapPin className="text-red-500 mt-1 flex-shrink-0" />
                      <span>{SCHOOL_INFO.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <Phone className="text-blue-500 flex-shrink-0" />
                      <span>(0260) 1234567</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <Mail className="text-yellow-500 flex-shrink-0" />
                      <span>info@smkbinus.sch.id</span>
                  </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-4">Konsentrasi Keahlian</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                 <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="p-2 bg-blue-100 rounded mr-3"><Server size={20} className="text-blue-600"/></div>
                     <div>
                         <p className="font-bold text-gray-800">TJKT</p>
                         <p className="text-xs text-gray-500">9 Rombel (X, XI, XII)</p>
                     </div>
                 </div>
                 <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="p-2 bg-red-100 rounded mr-3"><Monitor size={20} className="text-red-600"/></div>
                     <div>
                         <p className="font-bold text-gray-800">TKR</p>
                         <p className="text-xs text-gray-500">9 Rombel (X, XI, XII)</p>
                     </div>
                 </div>
                 <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="p-2 bg-pink-100 rounded mr-3"><Scissors size={20} className="text-pink-600"/></div>
                     <div>
                         <p className="font-bold text-gray-800">Busana</p>
                         <p className="text-xs text-gray-500">3 Rombel (X, XI, XII)</p>
                     </div>
                 </div>
                 <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="p-2 bg-yellow-100 rounded mr-3"><Coffee size={20} className="text-yellow-600"/></div>
                     <div>
                         <p className="font-bold text-gray-800">Perhotelan</p>
                         <p className="text-xs text-gray-500">3 Rombel (X, XI, XII)</p>
                     </div>
                 </div>
              </div>
          </div>
      </div>
  </div>
);

const StudentProfile: React.FC = () => {
    // Group rombels by department for better display
    const grouped = ROMBELS.reduce((acc, curr) => {
        if (!acc[curr.department]) acc[curr.department] = [];
        acc[curr.department].push(curr);
        return acc;
    }, {} as Record<string, typeof ROMBELS>);

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Rombongan Belajar</h2>
            <div className="grid gap-8">
                {Object.entries(grouped).map(([dept, classes]) => (
                    <div key={dept} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">{dept}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {classes.map(cls => (
                                <div key={cls.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start">
                                        <div className="font-bold text-gray-800 group-hover:text-blue-700">{cls.name}</div>
                                        <div className="text-xs bg-white px-2 py-1 rounded border border-gray-200">{cls.studentCount} Siswa</div>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">Wali Kelas: -</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [user, setUser] = useState<UserState>({ 
    isLoggedIn: false, 
    role: 'guest', 
    name: 'Tamu' 
  });
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (loggedInUser: User) => {
      setUser({
          isLoggedIn: true,
          role: loggedInUser.role,
          name: loggedInUser.name,
          username: loggedInUser.username
      });
      setShowLogin(false);
      if (loggedInUser.role === 'admin') setCurrentPage('dashboard');
  };

  const handleLogout = () => {
      setUser({ isLoggedIn: false, role: 'guest', name: 'Tamu' });
      setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setShowLogin(true)}
      />
      
      <main className="pt-6 px-4 sm:px-6 lg:px-8">
        {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
        {currentPage === 'profile' && <SchoolProfile />}
        {currentPage === 'students' && <StudentProfile />}
        {currentPage === 'dashboard' && <Dashboard bookings={bookings} setBookings={setBookings} user={user} />}
        {currentPage === 'users' && user.role === 'admin' && <UserManagement users={users} setUsers={setUsers} />}
      </main>
      
      {showLogin && (
        <Login 
            users={users} 
            onLogin={handleLogin} 
            onClose={() => setShowLogin(false)} 
        />
      )}

      <footer className="bg-gray-900 text-gray-400 text-center py-8 mt-auto no-print">
         <div className="max-w-7xl mx-auto px-4">
            <p>&copy; {new Date().getFullYear()} SMK Bina Nusantara. All rights reserved.</p>
            <p className="text-xs mt-2">Developed for efficient educational resource management.</p>
         </div>
      </footer>
    </div>
  );
};

export default App;