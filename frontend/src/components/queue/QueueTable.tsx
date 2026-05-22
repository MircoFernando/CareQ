import React from 'react';
import { QueueItem } from '../../types/queue.types';
import QueueRow from './QueueRow';
import Card from '../common/Card';
import { ClipboardCheck } from 'lucide-react';

interface QueueTableProps {
  queue: QueueItem[];
  slaMinutes?: number;
  slaBreaches?: string[];
  onUpdatePriority?: (tokenId: string, priority: 0 | 1 | 2, reason: string) => Promise<any>;
  onUpdateStatus?: (tokenId: string, status: 'NO_SHOW' | 'CALLED') => Promise<any>;
  isStaffActionable?: boolean;
  isDoctorView?: boolean;
}

export const QueueTable: React.FC<QueueTableProps> = ({
  queue,
  slaMinutes = 20,
  slaBreaches = [],
  onUpdatePriority,
  onUpdateStatus,
  isStaffActionable = true,
  isDoctorView = false,
}) => {
  if (queue.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center text-center py-12 animate-slide-up bg-white">
        <div className="p-4 bg-primary-light rounded-full text-primary border border-primary/10 mb-3 shadow-inner">
          <ClipboardCheck size={36} className="stroke-[1.5]" />
        </div>
        <h3 className="text-sm font-bold text-text-primary">Waiting Queue is Clear</h3>
        <p className="text-xs text-text-secondary mt-1 max-w-xs">
          There are no patients currently waiting in this department. All tokens have been resolved or called!
        </p>
      </Card>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden animate-slide-up select-none">
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="min-w-full divide-y divide-border text-left">
          <thead className="bg-bg/60 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-secondary w-16">
                Pos
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-secondary w-32">
                Token
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Patient Name
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-secondary w-28">
                Issued At
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-secondary w-40">
                Elapsed Wait
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-secondary w-44">
                Priority
              </th>
              {isStaffActionable && (
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-secondary text-right w-48">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {queue.map((item) => (
              <QueueRow
                key={item.tokenId}
                item={item}
                slaMinutes={slaMinutes}
                slaBreached={slaBreaches.includes(item.tokenId) || (Math.floor((Date.now() - new Date(item.issuedAt).getTime()) / 60000) > slaMinutes)}
                onUpdatePriority={onUpdatePriority}
                onUpdateStatus={onUpdateStatus}
                isStaffActionable={isStaffActionable}
                isDoctorView={isDoctorView}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-bg/40 px-6 py-3 border-t border-border flex items-center justify-between text-xs text-text-secondary">
        <span>Showing {queue.length} patient{queue.length > 1 ? 's' : ''} in queue</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-orange-100 border border-orange-400"></span> Emergency
          <span className="w-2.5 h-2.5 rounded bg-red-100 border border-red-400 ml-2"></span> SLA Breach
        </span>
      </div>
    </div>
  );
};
export default QueueTable;
