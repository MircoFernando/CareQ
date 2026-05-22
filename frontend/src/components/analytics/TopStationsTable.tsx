import React from 'react';
import Card from '../common/Card';
import { Station } from '../../types/queue.types';
import Badge from '../common/Badge';
import { Award, Zap, AlertTriangle, Users } from 'lucide-react';

interface TopStationsTableProps {
  stations: Station[];
  className?: string;
}

export const TopStationsTable: React.FC<TopStationsTableProps> = ({
  stations = [],
  className = '',
}) => {
  // Sort stations by patients served today or efficiency score descending
  const sortedStations = [...stations].sort(
    (a, b) => (b.efficiencyScore || 0) - (a.efficiencyScore || 0)
  );

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'active';
    if (score >= 80) return 'normal';
    return 'urgent';
  };

  return (
    <Card className={`bg-white border border-primary/10 shadow-md p-5 rounded-2xl select-none ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Award className="text-primary" size={18} />
            <span>Station Efficiency Rankings</span>
          </h3>
          <p className="text-[10px] text-text-secondary mt-0.5">
            Performance stats, total patients served, and SLA breaches per consultation desk.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border-default text-text-secondary font-bold select-none uppercase tracking-wider text-[10px]">
              <th className="py-3 pr-4">Station</th>
              <th className="py-3 px-4">Doctor</th>
              <th className="py-3 px-4 text-center">Served</th>
              <th className="py-3 px-4 text-center">SLA Breaches</th>
              <th className="py-3 pl-4 text-right">Efficiency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default/40 font-medium">
            {sortedStations.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-text-secondary">
                  No active stations logged today.
                </td>
              </tr>
            ) : (
              sortedStations.map((station) => {
                const served = station.patientsServedCountToday || 0;
                const breaches = station.slaBreachCountToday || 0;
                const score = station.efficiencyScore || 85;

                return (
                  <tr
                    key={station.id}
                    className="hover:bg-bg-secondary/40 transition-colors"
                  >
                    <td className="py-3 pr-4 font-bold text-text-primary select-all">
                      {station.name}
                    </td>
                    <td className="py-3 px-4 text-text-secondary font-semibold">
                      {station.activeDoctorName || (
                        <span className="italic text-text-secondary/50 font-normal">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <Users size={12} className="text-primary" />
                        <span className="font-extrabold text-text-primary">{served}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {breaches > 0 ? (
                        <div className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertTriangle size={12} />
                          <span className="font-extrabold">{breaches}</span>
                        </div>
                      ) : (
                        <span className="text-text-secondary/40 font-bold">-</span>
                      )}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <Zap size={12} className="text-secondary" />
                        <Badge variant={getScoreBadgeVariant(score)} className="font-mono font-bold">
                          {score}%
                        </Badge>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TopStationsTable;
