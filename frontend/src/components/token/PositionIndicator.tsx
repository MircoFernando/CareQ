import React from 'react';
import Card from '../common/Card';
import { Users2, Clock } from 'lucide-react';
import { formatWaitTime } from '../../lib/utils';

interface PositionIndicatorProps {
  position: number;
  estimatedWaitMinutes: number;
  className?: string;
}

export const PositionIndicator: React.FC<PositionIndicatorProps> = ({
  position,
  estimatedWaitMinutes,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className} select-none`}>
      {/* Position Widget */}
      <Card className="flex items-center gap-3.5 bg-white py-4 px-4 animate-slide-up">
        <div className="p-2.5 bg-primary-light text-primary rounded-xl border border-primary/10 shrink-0">
          <Users2 size={20} className="stroke-[2.5]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Position</span>
          <span className="text-xl font-extrabold text-text-primary mt-0.5 leading-none">
            {position > 0 ? `#${position}` : 'Called'}
          </span>
        </div>
      </Card>

      {/* Wait Time Widget */}
      <Card className="flex items-center gap-3.5 bg-white py-4 px-4 animate-slide-up">
        <div className="p-2.5 bg-primary-light text-primary rounded-xl border border-primary/10 shrink-0">
          <Clock size={20} className="stroke-[2.5]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Est. Wait</span>
          <span className="text-xl font-extrabold text-text-primary mt-0.5 leading-none truncate">
            {position > 0 ? formatWaitTime(estimatedWaitMinutes) : 'Serving Now'}
          </span>
        </div>
      </Card>
    </div>
  );
};
export default PositionIndicator;
