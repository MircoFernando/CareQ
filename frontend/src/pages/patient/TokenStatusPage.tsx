import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToken } from '../../hooks/useToken';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import AppLogo from '../../components/common/AppLogo';
import TokenCard from '../../components/token/TokenCard';
import PositionIndicator from '../../components/token/PositionIndicator';
import TokenStatusBanner from '../../components/token/TokenStatusBanner';
import { ShieldAlert, ArrowLeft, RefreshCw, Calendar, CheckCircle } from 'lucide-react';

export const TokenStatusPage: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();
  
  const { 
    token, 
    events = [], 
    isLoading, 
    isError 
  } = useToken(tokenId || null);

  const handleBackToRegister = () => {
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-4 select-none">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-text-secondary font-bold mt-3 animate-pulse">Synchronizing Token State...</span>
      </div>
    );
  }

  if (isError || !token) {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center bg-white border border-red-100 shadow-xl rounded-3xl flex flex-col items-center select-none">
          <div className="p-3 bg-red-50 border border-red-200 text-red-500 rounded-2xl mb-4">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-lg font-black text-text-primary">Token Expired or Invalid</h2>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
            We were unable to locate this token in our OPD system. It may have been completed, canceled, or entered into long-term history records.
          </p>
          <button
            onClick={handleBackToRegister}
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
    <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-between p-4 py-8">
      {/* Mobile Top Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 px-1 select-none">
        <AppLogo />
        <button
          onClick={() => window.location.reload()}
          className="p-2 border border-border-default hover:bg-white rounded-xl text-text-secondary transition-colors"
          title="Refresh Queue State"
        >
          <RefreshCw size={14} className="hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* Main Status Panel */}
      <div className="w-full max-w-md space-y-5 flex-1 flex flex-col justify-center">
        {/* Status Indicator Banner */}
        <TokenStatusBanner 
          status={token.status} 
          stationName={token.stationName} 
        />

        {/* Big Token Number Hero Card */}
        <TokenCard 
          tokenNumber={token.tokenNumber} 
          departmentName={token.departmentName || 'OPD Service'} 
        />

        {/* Position and Estimated Wait Counters */}
        <PositionIndicator 
          position={token.status === 'WAITING' ? token.position : 0} 
          estimatedWaitMinutes={token.estimatedWaitMinutes} 
        />

        {/* Token Milestones Timeline */}
        {events.length > 0 && (
          <Card className="bg-white border border-primary/10 shadow-md p-5 rounded-2xl select-none">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-text-secondary border-b border-border-default pb-3.5 mb-4 flex items-center gap-1">
              <Calendar size={12} />
              <span>Queue Progression Milestones</span>
            </h4>

            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-border-default">
              {events.map((evt) => {
                
                const getEventStyle = () => {
                  switch (evt.eventType) {
                    case 'TOKEN_ISSUED':
                      return { iconColor: 'bg-primary text-white border-primary/10', title: 'Token Checked In' };
                    case 'PATIENT_CALLED':
                      return { iconColor: 'bg-secondary text-white border-secondary/10', title: 'Called to Station' };
                    case 'IN_CONSULTATION_STARTED':
                      return { iconColor: 'bg-emerald-500 text-white border-emerald-500/10', title: 'Consultation Started' };
                    case 'CONSULTATION_COMPLETED':
                      return { iconColor: 'bg-slate-400 text-white border-slate-400/10', title: 'Consultation Completed' };
                    case 'SLA_BREACHED':
                      return { iconColor: 'bg-red-500 text-white border-red-500/10', title: 'SLA Limit Exceeded' };
                    default:
                      return { iconColor: 'bg-bg-tertiary text-text-secondary border-border-default', title: evt.eventType.replace('_', ' ') };
                  }
                };

                const styleConfig = getEventStyle();

                return (
                  <div key={evt.id} className="flex gap-4 relative pl-1.5">
                    <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center border text-[8px] font-bold shrink-0 z-10 ${styleConfig.iconColor}`}>
                      <CheckCircle size={8} className="stroke-[3]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-text-primary leading-none">
                        {styleConfig.title}
                      </span>
                      <span className="text-[9px] text-text-secondary mt-1 font-semibold">
                        {new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        {evt.actorName && ` • by ${evt.actorName}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      {/* Footer Mobile Helper */}
      <div className="w-full max-w-md text-center mt-8 select-none">
        <p className="text-[9px] text-text-secondary leading-relaxed max-w-xs mx-auto">
          System automatically updates live in the browser. Standard SMS alerts will be dispatched at your call event.
        </p>
      </div>
    </div>
  );
};

export default TokenStatusPage;
