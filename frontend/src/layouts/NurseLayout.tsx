import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';

export const NurseLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-bg overflow-hidden font-sans">
      {/* Sidebar - Fixed Left */}
      <Sidebar />

      {/* Main Panel - Scroll Right */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-screen-2xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default NurseLayout;
