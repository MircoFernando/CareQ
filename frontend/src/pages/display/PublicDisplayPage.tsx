import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueue } from '../../hooks/useQueue';
import { useStations } from '../../hooks/useStations';
import { departmentService } from '../../services/departmentService';
import { useSocket } from '../../hooks/useSocket';
import { ROOMS, SOCKET_EVENTS } from '../../lib/socket';
import DisplayBoard from '../../components/display/DisplayBoard';
import CalledTokenAnnounce from '../../components/display/CalledTokenAnnounce';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import AppLogo from '../../components/common/AppLogo';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert, ArrowLeft, Volume2, Sparkles, VolumeX } from 'lucide-react';
import { TokenDetail } from '../../types/queue.types';

export const PublicDisplayPage: React.FC = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const navigate = useNavigate();

  const [activeAnnounce, setActiveAnnounce] = useState<{ tokenNumber: string; stationName: string } | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Load department details
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getDepartments(),
  });

  const department = departments.find((d) => d.id === deptId);

  // Hook into live queue
  const { queueItems, isLoading: queueLoading } = useQueue(deptId || null);

  // Hook into live stations to compute currently serving tokens
  const { stations, isLoading: stationsLoading } = useStations(deptId || null);

  // Hook into socket room for public queue displays
  const roomName = deptId ? ROOMS.deptQueue(deptId) : undefined;
  const { subscribe } = useSocket(roomName);

  // Compute serving tokens from active station details
  const servingTokens: TokenDetail[] = stations
    .filter((s) => s.currentServedTokenId && s.currentServedTokenNumber)
    .map((s) => ({
      tokenId: s.currentServedTokenId!,
      tokenNumber: s.currentServedTokenNumber!,
      stationName: s.name,
      stationId: s.id,
      patientName: 'Serving',
      patientPhone: '***',
      priority: 2 as const,
      position: 0,
      waitMinutes: 0,
      estimatedWaitMinutes: 0,
      issuedAt: new Date().toISOString(),
      status: 'CALLED' as const,
      departmentId: deptId || '',
      calledAt: new Date().toISOString(),
      completedAt: null,
    }));

  // Compute waiting tokens as TokenDetail objects
  const waitingTokens: TokenDetail[] = queueItems.map((item) => ({
    ...item,
    status: 'WAITING' as const,
    departmentId: deptId || '',
    patientPhone: '***',
    stationId: null,
    calledAt: null,
    completedAt: null,
  }));

  // Listen to live 'display:called' socket events for real-time overlay announcements!
  useEffect(() => {
    if (!deptId) return;

    const unsubDisplay = subscribe(SOCKET_EVENTS.DISPLAY_CALLED, (data: any) => {
      // Show full-screen called announcement
      setActiveAnnounce({
        tokenNumber: data.tokenNumber,
        stationName: data.stationName,
      });
    });

    return () => {
      unsubDisplay();
    };
  }, [deptId, subscribe]);

  const handleCloseAnnounce = () => {
    setActiveAnnounce(null);
  };

  // Initial user interaction triggers to enable Chrome/Safari Audio Context autoplays
  const handleEnableAudio = () => {
    setAudioEnabled(true);
    // Simple synthesized blip to confirm activation
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
  };

  if (queueLoading || stationsLoading) {
    return (
      <div className="min-h-screen bg-primary-dark flex flex-col items-center justify-center p-4">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-white/50 font-bold mt-3 animate-pulse">Launching Public Waiting Display...</span>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-primary-dark flex flex-col items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center bg-white border border-red-100 shadow-2xl rounded-3xl flex flex-col items-center select-none">
          <div className="p-3 bg-red-50 border border-red-200 text-red-500 rounded-2xl mb-4">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-lg font-black text-text-primary">Display Offline</h2>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
            The clinic code provided is invalid or the queue system is deactivated.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <ArrowLeft size={14} />
            <span>Go to Portal Login</span>
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark flex flex-col justify-between p-6 overflow-hidden">
      
      {/* Top Waiting Room Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6 select-none">
        <div className="flex items-center gap-3">
          <AppLogo textClassName="text-white text-lg" iconClassName="bg-white/10 text-white" />
          <span className="h-6 w-[1px] bg-white/20 shrink-0" />
          <div className="flex flex-col text-left">
            <h1 className="text-base font-black text-white tracking-wide">{department.name}</h1>
            <span className="text-[10px] text-white/40 font-semibold uppercase mt-0.5 tracking-wider">
              Waiting Room Display Board
            </span>
          </div>
        </div>

        {/* Browser Sound Synthesis Enabler */}
        <div className="flex items-center gap-3">
          {!audioEnabled ? (
            <button
              onClick={handleEnableAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-white border border-secondary/20 rounded-xl text-[10px] font-black uppercase tracking-wider animate-pulse hover:shadow-lg transition-all"
            >
              <VolumeX size={14} />
              <span>Enable Audio Voice</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-emerald-400 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider">
              <Volume2 size={14} className="animate-pulse" />
              <span>Audio Active</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-white/50 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
            <Sparkles size={12} className="text-secondary shrink-0" />
            <span>Live Sync Active</span>
          </div>
        </div>
      </div>

      {/* Main Grid display content */}
      <div className="flex-1 flex flex-col justify-center">
        <DisplayBoard
          servingTokens={servingTokens}
          waitingTokens={waitingTokens}
          departmentName={department.name}
        />
      </div>

      {/* Footer scrolling ticket info */}
      <div className="border-t border-white/10 pt-5 mt-6 flex justify-between items-center text-[10px] font-bold text-white/40 select-none uppercase tracking-widest">
        <span>CareQ OPD smart queue monitor</span>
        <span className="animate-pulse">Please match token with your designated station</span>
        <span>Local Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      {/* Giant Full-Screen Announcement Overlay pop-up */}
      {audioEnabled && activeAnnounce && (
        <CalledTokenAnnounce
          tokenNumber={activeAnnounce.tokenNumber}
          stationName={activeAnnounce.stationName}
          isActive={!!activeAnnounce}
          onClose={handleCloseAnnounce}
        />
      )}
    </div>
  );
};

export default PublicDisplayPage;
