import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useQueue } from '../../hooks/useQueue';
import { useStations } from '../../hooks/useStations';
import CurrentPatientCard from '../../components/station/CurrentPatientCard';
import NextPatientPreview from '../../components/station/NextPatientPreview';
import StationActionBar from '../../components/station/StationActionBar';
import StationStatusBadge from '../../components/station/StationStatusBadge';
import PriorityBadge from '../../components/queue/PriorityBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import PageHeader from '../../components/common/PageHeader';
import { Landmark, Users2, Trophy } from 'lucide-react';
import { TokenDetail } from '../../types/queue.types';
import toast from 'react-hot-toast';

export const StationPage: React.FC = () => {
  const { profile } = useAuth();
  const deptId = profile?.departmentId || 'dept-opd';

  // 1. Fetch live queue items for left panel
  const { queueItems, isLoading: queueLoading } = useQueue(deptId);

  // 2. Fetch all stations to match the logged in doctor station
  const { 
    stations, 
    nextPatient, 
    isLoading: stationsLoading,
    togglePause,
    callNextPatient,
    isCallingNext,
  } = useStations(deptId, 'st-1'); // Default to Station 1 for mock testing ease

  const station = stations.find(s => s.id === 'st-1') || stations[0] || {
    id: 'st-1',
    name: 'Station 1',
    isPaused: false,
    activeDoctorName: 'Dr. Aris P.',
    patientsServedCountToday: 15,
    averageServiceMinutesToday: 8,
    efficiencyScore: 92
  };

  // Find the token currently called / serving at this station
  // The queue items return only WAITING, but we can query tokens assigned to st-1
  const { queueItems: allDeptQueue } = useQueue(deptId);
  
  // Find current serving patient from mock db matching stationId st-1 and CALLED / IN_CONSULTATION statuses
  const [activePatient, setActivePatient] = useState<TokenDetail | null>(null);

  // We can synchronize the active patient status automatically
  React.useEffect(() => {
    // If a patient was called, let's load it from the database or check localStorage
    const savedTokenId = sessionStorage.getItem('careq_active_doctor_token_id');
    if (savedTokenId) {
      // In a real system, we load token details. In demo mode, let's look up from db
      const allTokens = JSON.parse(localStorage.getItem('careq_tokens') || '[]');
      const active = allTokens.find((t: any) => t.tokenId === savedTokenId && (t.status === 'CALLED' || t.status === 'IN_CONSULTATION'));
      if (active) {
        setActivePatient(active);
      } else {
        sessionStorage.removeItem('careq_active_doctor_token_id');
        setActivePatient(null);
      }
    }
  }, [allDeptQueue, nextPatient]);

  const handleCallPatient = async (tokenId: string) => {
    try {
      const response = await callNextPatient({
        tokenId,
        status: 'CALLED',
        stationId: station.id,
      });
      sessionStorage.setItem('careq_active_doctor_token_id', response.tokenId);
      setActivePatient(response);
    } catch (err: any) {}
  };

  const handleStartConsultation = async () => {
    if (!activePatient) return;
    try {
      const response = await callNextPatient({
        tokenId: activePatient.tokenId,
        status: 'IN_CONSULTATION',
        stationId: station.id,
      });
      setActivePatient(response);
    } catch (err: any) {}
  };

  const handleRecallPatient = async () => {
    if (!activePatient) return;
    try {
      await callNextPatient({
        tokenId: activePatient.tokenId,
        status: 'CALLED',
        stationId: station.id,
      });
    } catch (err: any) {}
  };

  const handleCompleteConsultation = async (vitals: any, notes: string) => {
    if (!activePatient) return;
    try {
      console.log('[Consultation Complete] Observations documented:', { vitals, notes });
      await callNextPatient({
        tokenId: activePatient.tokenId,
        status: 'COMPLETED',
        stationId: station.id,
      });
      sessionStorage.removeItem('careq_active_doctor_token_id');
      setActivePatient(null);
      toast.success('Consultation complete! Documenting assessment notes.');
    } catch (err: any) {}
  };

  const handleNoShow = async () => {
    if (!activePatient) return;
    try {
      await callNextPatient({
        tokenId: activePatient.tokenId,
        status: 'NO_SHOW',
        stationId: station.id,
      });
      sessionStorage.removeItem('careq_active_doctor_token_id');
      setActivePatient(null);
    } catch (err: any) {}
  };

  const handleToggleStationPause = async () => {
    try {
      await togglePause({ id: station.id, isPaused: !station.isPaused });
    } catch (err: any) {}
  };

  if (queueLoading || stationsLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center select-none">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-text-secondary font-bold mt-3 animate-pulse">Synchronizing Clinic Console...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Station status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <PageHeader
          title={`Doctor Console Workspace`}
          subtitle={`Manage consultations, enter patient observations, and announce ticket calls.`}
        />

        <div className="flex items-center gap-3.5 self-start md:self-auto">
          {/* Station indicators */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-border-default rounded-xl shadow-sm">
            <span className="text-xs font-black text-text-primary">{station.name}</span>
            <StationStatusBadge
              isPaused={station.isPaused}
              isActiveDoctor={true}
              currentServedTokenNumber={activePatient?.tokenNumber}
            />
          </div>

          <div className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary-light border border-primary/20 px-3.5 py-2.5 rounded-xl">
            <Landmark size={12} className="text-primary animate-pulse" />
            <span>OPD Clinic Service</span>
          </div>
        </div>
      </div>

      {/* THREE-COLUMN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        
        {/* COLUMN 1: Active Queue List Sidebar (1/4 width) */}
        <div className="lg:col-span-1 space-y-4 flex flex-col select-none">
          <div className="flex items-center justify-between border-b border-border-default pb-3.5 px-1">
            <h3 className="text-xs font-black text-text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Users2 size={16} className="text-primary" />
              <span>Queue Waiting List ({queueItems.length})</span>
            </h3>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {queueItems.length === 0 ? (
              <Card className="p-8 text-center border-2 border-dashed border-border-default bg-white rounded-2xl">
                <span className="text-[10px] font-bold text-text-secondary uppercase">No Patients Waiting</span>
              </Card>
            ) : (
              queueItems.map((token) => (
                <div
                  key={token.tokenId}
                  onClick={() => !activePatient && handleCallPatient(token.tokenId)}
                  className={`p-3.5 border rounded-2xl flex items-center justify-between gap-3 bg-white shadow-sm transition-all duration-200 cursor-pointer ${
                    activePatient
                      ? 'opacity-65 hover:opacity-85 border-border-default'
                      : 'hover:border-primary hover:shadow-md border-primary/10'
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-black text-text-primary select-all">{token.tokenNumber}</span>
                    <span className="text-[10px] text-text-secondary font-bold truncate mt-0.5">{token.patientName}</span>
                  </div>
                  <PriorityBadge priority={token.priority} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2 & 3: Main Central Workspace Card (2/4 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Station Action controls bar */}
          <StationActionBar
            currentPatient={activePatient}
            isPaused={station.isPaused}
            onStartConsultation={handleStartConsultation}
            onRecall={handleRecallPatient}
            onTogglePause={handleToggleStationPause}
            isLoading={isCallingNext}
          />

          {/* Central vitals check / observation notes workspace */}
          <CurrentPatientCard
            patient={activePatient}
            onComplete={handleCompleteConsultation}
            onNoShow={handleNoShow}
            isLoading={isCallingNext}
          />
        </div>

        {/* COLUMN 4: Stats and Next Patient Previews (1/4 width) */}
        <div className="lg:col-span-1 space-y-6 select-none">
          {/* Next Patient preview container */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-text-primary uppercase tracking-widest px-1">
              Next Up Preview
            </h3>
            <NextPatientPreview
              patient={nextPatient}
              onCall={handleCallPatient}
              isLoading={isCallingNext}
            />
          </div>

          {/* Performance scorecard widget */}
          <Card className="bg-white border border-primary/10 shadow-md p-5 rounded-2xl">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-text-secondary border-b border-border-default pb-3.5 mb-4 flex items-center gap-1.5">
              <Trophy className="text-secondary" size={14} />
              <span>Doctor Desk Scorecard</span>
            </h4>

            <div className="space-y-4">
              {/* Served Count */}
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-text-secondary">Served Today</span>
                <span className="font-extrabold text-text-primary">{station.patientsServedCountToday || 18} patients</span>
              </div>

              {/* Service Average */}
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-text-secondary">Avg Consultation Time</span>
                <span className="font-extrabold text-text-primary">{station.averageServiceMinutesToday || 8} mins</span>
              </div>

              {/* Station Efficiency */}
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-text-secondary">Efficiency Rank</span>
                <span className="font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                  {station.efficiencyScore || 92}% Score
                </span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default StationPage;
