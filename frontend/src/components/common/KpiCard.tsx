import React from 'react';
import Card from './Card';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor = 'text-primary bg-primary-light',
  trend,
}) => {
  return (
    <Card className="flex items-center justify-between hover:shadow-sm transition-all duration-150 animate-slide-up">
      <div className="flex flex-col select-none">
        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">{label}</span>
        <span className="text-3xl font-bold text-text-primary mt-1.5 tracking-tight">{value}</span>
        {trend && (
          <span
            className={cn(
              'text-[10px] font-bold mt-1.5 inline-flex items-center gap-0.5',
              trend.isPositive ? 'text-emerald-600' : 'text-red-500'
            )}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value} since yesterday
          </span>
        )}
      </div>
      {Icon && (
        <div className={cn('p-3 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-black/5', iconColor)}>
          <Icon size={24} className="stroke-[2]" />
        </div>
      )}
    </Card>
  );
};
export default KpiCard;
