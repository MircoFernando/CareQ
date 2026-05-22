import React from 'react';
import { NextPatientResponse } from '../../types/api.types';
import Card from '../common/Card';
import PriorityBadge from '../queue/PriorityBadge';
import Button from '../common/Button';
import { ArrowRight, UserPlus, Clock } from 'lucide-react';
import { formatWaitTime } from '../../lib/utils';

interface NextPatientPreviewProps {
  patient: NextPatientResponse | null;
  onCall: (tokenId: string) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export const NextPatientPreview: React.FC<NextPatientPreviewProps> = ({
  patient,
  onCall,
  isLoading = false,
  className = '',
}) => {
  if (!patient) {
    return (
      <Card className={`p-5 bg-bg-secondary border border-border-default border-dashed text-center flex flex-col items-center justify-center rounded-2xl select-none ${className}`}>
        <Clock size={20} className="text-text-secondary mb-2 animate-pulse" />
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Queue is Empty</h4>
        <p className="text-[10px] text-text-secondary mt-0.5">
          No waiting patients in this department queue right now.
        </p>
      </Card>
    );
  }

  return (
    <Card className={`bg-white border border-primary/10 shadow-md p-5 rounded-2xl select-none hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary-light px-2.5 py-1 rounded-full border border-primary/5">
          Next Patient
        </span>
        <PriorityBadge priority={patient.priority} />
      </div>

      <div className="flex items-center gap-3.5 mt-2">
        <div className="bg-bg-tertiary px-3.5 py-2.5 border border-border-default rounded-xl flex flex-col items-center justify-center text-center shrink-0 min-w-[70px]">
          <span className="text-[9px] font-bold text-text-secondary uppercase">Token</span>
          <span className="text-lg font-black text-text-primary tracking-tight leading-none mt-0.5">
            {patient.tokenNumber}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          {/* Masked patient name for public visual lists if needed, but staff sees it. In doctor next preview, we show it clearly */}
          <h4 className="text-sm font-extrabold text-text-primary leading-tight truncate">
            {patient.patientName}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-text-secondary">
            <span>Pos: #{patient.position}</span>
            <span className="h-1 w-1 rounded-full bg-text-secondary/40"></span>
            <span className="flex items-center gap-0.5">
              Waiting: {formatWaitTime(patient.waitMinutes)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-border-default pt-3">
        <Button
          variant="primary"
          onClick={() => onCall(patient.tokenId)}
          isLoading={isLoading}
          className="w-full rounded-xl flex items-center justify-center gap-1 py-2 font-bold"
        >
          <UserPlus size={14} />
          <span>Call Patient Now</span>
          <ArrowRight size={14} className="ml-0.5 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </Card>
  );
};

export default NextPatientPreview;
