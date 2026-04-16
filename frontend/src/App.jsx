import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Availability from './pages/Availability';
import Meetings from './pages/Meetings';
import PublicBooking from './pages/PublicBooking';
import { Plus, Calendar, Clock, Settings } from 'lucide-react';

// Updated NavLink for Vertical Sidebar
function NavLink({ to, children, icon: Icon }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`relative flex items-center gap-3 px-6 py-3 text-sm font-semibold transition-all ${
        isActive
          ? 'bg-white/5 text-white'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      {/* Active Indicator (Vertical line on the left) */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
      )}
      
      {Icon && <Icon size={18} className="shrink-0" />}
      {children}
    </Link>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Booking Route (Full Screen) */}
        <Route path="/book/:slug" element={<PublicBooking />} />
        
        {/* Admin Routes with Vertical Sidebar */}
        <Route path="*" element={
          <div className="min-h-screen flex bg-neutral-950 text-gray-100">
            
            {/* --- VERTICAL SIDEBAR --- */}
            <aside className="w-72 border-r border-white/10 bg-neutral-950 flex flex-col sticky top-0 h-screen">
              
              {/* Logo Section */}
              <div className="p-6 mb-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  <span className="text-white">Cal</span>
                  <span className="text-white">.clone</span>
                </h1>
                <p className="mt-1 text-xs text-gray-500 font-medium">Neon-powered scheduling</p>
              </div>

             

              {/* Navigation Links Stacking Vertically */}
              <nav className="flex-1 flex flex-col">
                <NavLink to="/" icon={Calendar}>Event types</NavLink>
                <NavLink to="/meetings" icon={Clock}>Bookings</NavLink>
                <NavLink to="/availability" icon={Settings}>Availability</NavLink>
              </nav>

              {/* Footer / Help (Optional) */}
              <div className="p-6 border-t border-white/10">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Cal.clone</p>
              </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-5xl mx-auto p-10 sm:p-12">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/availability" element={<Availability />} />
                  <Route path="/meetings" element={<Meetings />} />
                </Routes>
              </div>
            </main>

          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
