import React, { useState, useMemo } from 'react';
import { Booking, LabId, Status, UserState } from '../types';
import { analyzeScheduleWithGemini, generateMockSchedule, AIAnalysisResult } from '../services/geminiService';
import { ROMBELS } from '../constants';
import { Plus, Check, X, Clock, Sparkles, Loader2, Download, Printer, FileText } from 'lucide-react';

interface DashboardProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  user: UserState;
}

export const Dashboard: React.FC<DashboardProps> = ({ bookings, setBookings, user }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({
    teacherName: user.isLoggedIn ? user.name : '',
    labId: LabId.LAB_1,
    date: selectedDate,
    startTime: '08:00',
    endTime: '09:30',
    status: Status.PENDING
  });

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => b.date === selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [bookings, selectedDate]);

  const handleGenerateSchedule = async () => {
      setIsGenerating(true);
      const generated = await generateMockSchedule(selectedDate);
      const nonConflicting = generated.filter(g => 
        !bookings.some(b => b.date === selectedDate && b.labId === g.labId && b.startTime === g.startTime)
      );
      setBookings(prev => [...prev, ...nonConflicting]);
      setIsGenerating(false);
  };

  const handleAnalyze = async () => {
    if (!newBooking.teacherName || !newBooking.subject || !newBooking.rombelId) {
        alert("Please fill in all required fields.");
        return;
    }
    setIsAnalyzing(true);
    const result = await analyzeScheduleWithGemini(bookings, newBooking as Booking);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleSubmitRequest = () => {
    const rombel = ROMBELS.find(r => r.id === newBooking.rombelId);
    const booking: Booking = {
        id: Date.now().toString(),
        ...newBooking as Booking,
        rombelName: rombel?.name || "Unknown Class",
        status: user.role === 'admin' ? Status.APPROVED : Status.PENDING
    };
    setBookings(prev => [...prev, booking]);
    setShowForm(false);
    setNewBooking({
        teacherName: user.isLoggedIn ? user.name : '',
        labId: LabId.LAB_1,
        date: selectedDate,
        startTime: '08:00',
        endTime: '09:30',
        status: Status.PENDING
    });
    setAiAnalysis(null);
  };

  const updateStatus = (id: string, newStatus: Status) => {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const handleDownloadCsv = () => {
      const headers = ["ID", "Tanggal", "Jam Mulai", "Jam Selesai", "Lab", "Kelas", "Mapel", "Guru", "Status"];
      const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + filteredBookings.map(b => {
            return [b.id, b.date, b.startTime, b.endTime, b.labId, b.rombelName, b.subject, b.teacherName, b.status].join(",")
        }).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `rekap_lab_${selectedDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handlePrint = () => {
      window.print();
  };

  // Live Status Logic
  const now = new Date();
  const currentTimeStr = now.toTimeString().slice(0, 5);
  const currentDateStr = now.toISOString().split('T')[0];
  
  const getLiveStatus = (labId: LabId) => {
      const active = bookings.find(b => 
          b.date === currentDateStr && 
          b.labId === labId &&
          b.status === Status.APPROVED &&
          currentTimeStr >= b.startTime && 
          currentTimeStr <= b.endTime
      );
      return active;
  };

  const liveLab1 = getLiveStatus(LabId.LAB_1);
  const liveLab2 = getLiveStatus(LabId.LAB_2);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Print Header */}
      <div className="hidden print-only text-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold">SMK Bina Nusantara</h1>
        <h2 className="text-xl">Jadwal Penggunaan Laboratorium Komputer</h2>
        <p className="text-gray-500">Tanggal: {selectedDate}</p>
      </div>

      {/* Live Status Section - Hide on Print */}
      <section className="no-print">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
             Status Lab Saat Ini
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {[ { id: LabId.LAB_1, active: liveLab1 }, { id: LabId.LAB_2, active: liveLab2 }].map((lab) => (
                 <div key={lab.id} className={`p-6 rounded-xl border-l-4 shadow-sm ${lab.active ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">{lab.id}</h3>
                            <p className={`text-sm font-medium mt-1 ${lab.active ? 'text-red-600' : 'text-green-600'}`}>
                                {lab.active ? 'SEDANG DIGUNAKAN' : 'TERSEDIA'}
                            </p>
                        </div>
                        <div className="bg-white p-2 rounded-full shadow-sm">
                            {lab.active ? <Clock className="text-red-500" /> : <Check className="text-green-500" />}
                        </div>
                    </div>
                    {lab.active && (
                        <div className="mt-4 pt-4 border-t border-red-100">
                            <p className="text-gray-700 font-medium">{lab.active.subject}</p>
                            <p className="text-gray-600 text-sm">{lab.active.rombelName} • {lab.active.teacherName}</p>
                            <p className="text-gray-500 text-xs mt-1">{lab.active.startTime} - {lab.active.endTime}</p>
                        </div>
                    )}
                 </div>
             ))}
          </div>
      </section>

      {/* Schedule Management */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:shadow-none print:border-none print:p-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 no-print">
            <div>
                <h2 className="text-xl font-bold text-gray-800">Jadwal Penggunaan Lab</h2>
                <p className="text-gray-500 text-sm">Kelola dan pantau jadwal harian.</p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
                 <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                 />
                 
                 {user.isLoggedIn && (
                   <>
                     <button 
                        onClick={handleDownloadCsv}
                        className="bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        title="Download Excel/CSV"
                     >
                        <Download size={16} />
                        <span className="hidden sm:inline">Excel</span>
                     </button>
                     <button 
                        onClick={handlePrint}
                        className="bg-gray-600 text-white hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        title="Print / Save PDF"
                     >
                        <Printer size={16} />
                        <span className="hidden sm:inline">PDF/Print</span>
                     </button>
                   </>
                 )}

                 {user.role === 'admin' && (
                    <button 
                        onClick={handleGenerateSchedule}
                        disabled={isGenerating}
                        className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        {isGenerating ? <Loader2 className="animate-spin h-4 w-4"/> : <Sparkles size={16} />}
                        <span className="hidden sm:inline">Auto-Schedule</span>
                    </button>
                 )}
                 
                 {user.isLoggedIn && (
                    <button 
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-md"
                    >
                        <Plus size={16} />
                        Buat Permintaan
                    </button>
                 )}
            </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                        <th className="p-4">Waktu</th>
                        <th className="p-4">Lab</th>
                        <th className="p-4">Kelas (Rombel)</th>
                        <th className="p-4">Mapel & Guru</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right no-print">Aksi</th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                    {filteredBookings.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                                Tidak ada jadwal untuk tanggal ini.
                            </td>
                        </tr>
                    ) : (
                        filteredBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-mono text-gray-600 whitespace-nowrap">
                                    {booking.startTime} - {booking.endTime}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${booking.labId === LabId.LAB_1 ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {booking.labId === LabId.LAB_1 ? 'Lab 1' : 'Lab 2'}
                                    </span>
                                </td>
                                <td className="p-4 font-medium text-gray-800">{booking.rombelName}</td>
                                <td className="p-4">
                                    <div className="font-medium">{booking.subject}</div>
                                    <div className="text-gray-500 text-xs">{booking.teacherName}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold
                                        ${booking.status === Status.APPROVED ? 'bg-green-100 text-green-700' : 
                                          booking.status === Status.PENDING ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right no-print">
                                    {user.role === 'admin' && booking.status === Status.PENDING && (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => updateStatus(booking.id, Status.APPROVED)} className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200">
                                                <Check size={16} />
                                            </button>
                                            <button onClick={() => updateStatus(booking.id, Status.REJECTED)} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50">
                    <h3 className="text-lg font-bold text-blue-900">Pengajuan Jadwal Lab</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guru Pengampu</label>
                        <input 
                            type="text" 
                            value={newBooking.teacherName}
                            onChange={(e) => setNewBooking({...newBooking, teacherName: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                            readOnly
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                            <input 
                                type="text" 
                                value={newBooking.subject}
                                onChange={(e) => setNewBooking({...newBooking, subject: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Contoh: Desain Grafis"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas (Rombel)</label>
                            <select 
                                value={newBooking.rombelId || ''}
                                onChange={(e) => setNewBooking({...newBooking, rombelId: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Pilih Kelas</option>
                                {ROMBELS.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pilihan Lab</label>
                        <div className="flex gap-4">
                            {[LabId.LAB_1, LabId.LAB_2].map(lab => (
                                <label key={lab} className={`flex-1 border rounded-lg p-3 cursor-pointer transition-colors ${newBooking.labId === lab ? 'bg-blue-50 border-blue-500 text-blue-700' : 'hover:bg-gray-50'}`}>
                                    <input 
                                        type="radio" 
                                        name="lab" 
                                        value={lab} 
                                        checked={newBooking.labId === lab}
                                        onChange={() => setNewBooking({...newBooking, labId: lab})}
                                        className="hidden" 
                                    />
                                    <div className="font-medium text-sm text-center">{lab}</div>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
                             <input 
                                type="time" 
                                value={newBooking.startTime}
                                onChange={(e) => setNewBooking({...newBooking, startTime: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                             />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
                             <input 
                                type="time" 
                                value={newBooking.endTime}
                                onChange={(e) => setNewBooking({...newBooking, endTime: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                             />
                        </div>
                    </div>

                    {/* AI Assistant Area */}
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mt-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 text-purple-800 font-medium mb-2">
                                <Sparkles size={16} />
                                Gemini Scheduler Assistant
                            </div>
                            {!aiAnalysis && (
                                <button 
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing}
                                    className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {isAnalyzing ? 'Menganalisa...' : 'Cek Bentrok'}
                                </button>
                            )}
                        </div>
                        
                        {aiAnalysis && (
                            <div className="text-sm space-y-2 animate-in fade-in">
                                {aiAnalysis.isSafe ? (
                                    <div className="flex items-center gap-2 text-green-700">
                                        <Check size={16} />
                                        <span>Jadwal aman! Tidak ada bentrok yang ditemukan.</span>
                                    </div>
                                ) : (
                                    <div className="text-red-700">
                                        <div className="flex items-center gap-2 font-medium mb-1">
                                            <X size={16} />
                                            <span>Terdeteksi Bentrok!</span>
                                        </div>
                                        <ul className="list-disc list-inside pl-2 text-xs opacity-90 space-y-1">
                                            {aiAnalysis.conflicts.map((c, i) => <li key={i}>{c}</li>)}
                                        </ul>
                                        {aiAnalysis.suggestions.length > 0 && (
                                            <div className="mt-2 text-purple-800 bg-purple-100 p-2 rounded">
                                                <span className="font-bold text-xs">Saran AI:</span>
                                                <ul className="list-disc list-inside pl-1 text-xs mt-1">
                                                    {aiAnalysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <button onClick={() => setAiAnalysis(null)} className="text-xs underline text-gray-500 mt-2">Reset Analisa</button>
                            </div>
                        )}
                    </div>

                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Batal</button>
                    <button 
                        onClick={handleSubmitRequest}
                        disabled={isAnalyzing}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md disabled:opacity-50"
                    >
                        Kirim Permintaan
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};