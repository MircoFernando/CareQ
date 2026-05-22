import React from 'react';
import { TokenDetail } from '../../types/queue.types';
import Button from '../common/Button';
import { Play, Pause, RefreshCw, AlertTriangle } from 'lucide-react';

interface StationActionBarProps {
  currentPatient: TokenDetail | null;
  isPaused: boolean;
  onStartConsultation: () => Promise<void>;
  onRecall: () => Promise<void>;
  onTogglePause: () => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export const StationActionBar: React.FC<StationActionBarProps> = ({
  currentPatient,
  isPaused,
  onStartConsultation,
  onRecall,
  onTogglePause,
  isLoading = false,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-primary/10 shadow-lg rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 select-none ${className}`}>
      {/* Left side: Station Status Pause Control */}
      <div className="flex items-center gap-3">
        <Button
          variant={isPaused ? 'primary' : 'secondary'}
          onClick={onTogglePause}
          isLoading={isLoading}
          className={`rounded-xl px-4 py-2 font-bold text-sm ${
            isPaused
              ? 'bg-amber-500 hover:bg-amber-600 border-amber-500 hover:border-amber-600 text-white shadow-md'
              : 'border-border-default hover:bg-amber-50 text-amber-600 border-amber-200'
          }`}
        >
          {isPaused ? <Play size={16} className="mr-1.5" /> : <Pause size={16} className="mr-1.5" />}
          <span>{isPaused ? 'Resume Station' : 'Pause Station'}</span>
        </Button>
        {isPaused && (
          <span className="text-xs text-amber-500 font-bold flex items-center gap-1 animate-pulse">
            <AlertTriangle size={14} />
            <span>Station Paused</span>
          </span>
        )}
      </div>

      {/* Right side: Current patient flow controls */}
      {currentPatient && (
        <div className="flex items-center gap-2">
          {/* Re-call/Announce Button */}
          {currentPatient.status === 'CALLED' && (
            <Button
              variant="secondary"
              onClick={onRecall}
              isLoading={isLoading}
              className="rounded-xl border-secondary/20 text-secondary hover:bg-secondary-light px-3.5 py-2 font-bold text-sm"
            >
              <RefreshCw size={16} className="mr-1.5 animate-spin-slow" />
              <span>Recall Patient</span>
            </Button>
          )}

          {/* Start Consultation Button */}
          {currentPatient.status === 'CALLED' && (
            <Button
              variant="primary"
              onClick={onStartConsultation}
              isLoading={isLoading}
              className="rounded-xl px-4 py-2 bg-emerald-500 hover:bg-emerald-600 border-emerald-500 hover:border-emerald-600 text-white shadow-md font-bold text-sm"
            >
              <Play size={16} className="mr-1.5 fill-current" />
              <span>Start Consultation</span>
            </Button>
          )}

          {/* Currently In Consultation Label */}
          {currentPatient.status === 'IN_CONSULTATION' && (
            <div className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Serving Patient...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StationActionBar;
