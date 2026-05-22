import React from 'react';
import { AlertCircle, Clock, Volume2, UserCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import { TokenStatus } from '../../types/queue.types';
import Card from '../common/Card';

interface TokenStatusBannerProps {
  status: TokenStatus;
  stationName?: string | null;
  className?: string;
}

export const TokenStatusBanner: React.FC<TokenStatusBannerProps> = ({
  status,
  stationName,
  className = '',
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'WAITING':
        return {
          icon: <Clock className="text-primary animate-pulse shrink-0" size={24} />,
          bgClass: 'bg-primary-light border-primary/20',
          title: 'Waiting in Queue',
          description: 'Your token is active. Please wait in the lounge and keep an eye on the display boards.',
          textColor: 'text-primary-dark',
        };
      case 'CALLED':
        return {
          icon: <Volume2 className="text-secondary animate-bounce shrink-0" size={26} />,
          bgClass: 'bg-secondary-light border-secondary/30 animate-pulse border-2',
          title: 'PROCEED TO STATION NOW!',
          description: stationName 
            ? `Your token has been CALLED! Please proceed to ${stationName} immediately.`
            : 'Your token has been CALLED! Please proceed to your assigned station immediately.',
          textColor: 'text-secondary-dark font-extrabold',
        };
      case 'IN_CONSULTATION':
        return {
          icon: <UserCheck className="text-emerald-500 shrink-0" size={24} />,
          bgClass: 'bg-emerald-50 border-emerald-200',
          title: 'In Consultation',
          description: stationName
            ? `You are currently being served at ${stationName}.`
            : 'You are currently being served inside the consultation room.',
          textColor: 'text-emerald-900',
        };
      case 'COMPLETED':
        return {
          icon: <CheckCircle2 className="text-text-secondary shrink-0" size={24} />,
          bgClass: 'bg-bg-tertiary border-border-default',
          title: 'Consultation Finished',
          description: 'Your check-up is complete. Thank you for your patience!',
          textColor: 'text-text-secondary',
        };
      case 'NO_SHOW':
        return {
          icon: <ShieldAlert className="text-red-500 shrink-0" size={24} />,
          bgClass: 'bg-red-50 border-red-200 border-2',
          title: 'Missed Call / No Show',
          description: 'You were not present when your token was called. Please visit the triage counter to resume your position.',
          textColor: 'text-red-900',
        };
      default:
        return {
          icon: <AlertCircle className="text-text-secondary shrink-0" size={24} />,
          bgClass: 'bg-bg-tertiary border-border-default',
          title: 'Status Unknown',
          description: 'Unable to retrieve real-time token status.',
          textColor: 'text-text-secondary',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card className={`border shadow-sm flex items-start gap-4 p-5 rounded-2xl select-none transition-all duration-300 ${config.bgClass} ${className}`}>
      <div className="p-2.5 bg-white/80 backdrop-blur-sm rounded-xl border border-black/5 shrink-0 flex items-center justify-center shadow-sm">
        {config.icon}
      </div>
      <div className="flex flex-col min-w-0">
        <h3 className={`text-base font-bold tracking-tight ${config.textColor}`}>
          {config.title}
        </h3>
        <p className="text-xs text-text-secondary mt-1 font-medium leading-relaxed">
          {config.description}
        </p>
      </div>
    </Card>
  );
};

export default TokenStatusBanner;
