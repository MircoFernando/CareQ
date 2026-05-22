import React, { useState } from 'react';
import { QueueItem } from '../../types/queue.types';
import { formatDateTime } from '../../lib/utils';
import PriorityBadge from './PriorityBadge';
import WaitTimer from './WaitTimer';
import ConfirmDialog from '../common/ConfirmDialog';
import { UserX, AlertTriangle } from 'lucide-react';
import Badge from '../common/Badge';

interface QueueRowProps {
  item: QueueItem;
  slaMinutes?: number;
  slaBreached?: boolean;
  onUpdatePriority?: (tokenId: string, priority: 0 | 1 | 2, reason: string) => Promise<any>;
  onUpdateStatus?: (tokenId: string, status: 'NO_SHOW' | 'CALLED') => Promise<any>;
  isStaffActionable?: boolean;
  isDoctorView?: boolean;
}

export const QueueRow: React.FC<QueueRowProps> = ({
  item,
  slaMinutes = 20,
  slaBreached = false,
  onUpdatePriority,
  onUpdateStatus,
  isStaffActionable = true,
}) => {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showNoShowModal, setShowNoShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMakeEmergency = async () => {
    if (!onUpdatePriority) return;
    setIsSubmitting(true);
    try {
      await onUpdatePriority(item.tokenId, 0, 'Acute symptoms, urgent clinical presentation');
      setShowEmergencyModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkNoShow = async () => {
    if (!onUpdateStatus) return;
    setIsSubmitting(true);
    try {
      await onUpdateStatus(item.tokenId, 'NO_SHOW');
      setShowNoShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmergency = item.priority === 0;

  // Determine row background color classes according to high-fidelity specs
  const getRowBgClass = () => {
    if (slaBreached) {
      return 'bg-red-50 border-l-4 border-l-red-500 hover:bg-red-100/50';
    }
    if (isEmergency) {
      return 'bg-orange-50 border-l-4 border-l-orange-400 hover:bg-orange-100/50';
    }
    return 'bg-white hover:bg-bg/40 border-l-4 border-l-transparent';
  };

  return (
    <>
      <tr className={`border-b border-border transition-all duration-150 ${getRowBgClass()}`}>
        {/* Position */}
        <td className="px-6 py-4 text-sm font-bold text-text-primary select-none w-16">
          #{item.position}
        </td>

        {/* Token Number */}
        <td className="px-6 py-4 w-32">
          <span className="font-sans font-black text-sm px-3 py-1 bg-slate-100 text-text-primary rounded-md border border-slate-200">
            {item.tokenNumber}
          </span>
        </td>

        {/* Patient Name */}
        <td className="px-6 py-4 text-sm font-semibold text-text-primary">
          {item.patientName}
        </td>

        {/* Check-In Time */}
        <td className="px-6 py-4 text-xs text-text-secondary w-28 select-none">
          {formatDateTime(item.issuedAt)}
        </td>

        {/* Elapsed Wait Timer */}
        <td className="px-6 py-4 w-40 select-none">
          <WaitTimer startedAt={item.issuedAt} slaMinutes={slaMinutes} />
        </td>

        {/* Priority */}
        <td className="px-6 py-4 w-44 select-none">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={item.priority} />
            {slaBreached && (
              <Badge variant="sla">SLA OVERTIME</Badge>
            )}
          </div>
        </td>

        {/* Actions - depending on role view */}
        {isStaffActionable && (
          <td className="px-6 py-4 text-right w-48">
            <div className="flex items-center justify-end gap-2">
              {/* Emergency Action */}
              {item.priority !== 0 && onUpdatePriority && (
                <button
                  onClick={() => setShowEmergencyModal(true)}
                  className="p-1.5 text-emergency hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-200"
                  title="Escalate to Emergency"
                >
                  <AlertTriangle size={16} />
                </button>
              )}

              {/* No Show Action */}
              {onUpdateStatus && (
                <button
                  onClick={() => setShowNoShowModal(true)}
                  className="p-1.5 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-200"
                  title="Mark as No Show"
                >
                  <UserX size={16} />
                </button>
              )}
            </div>
          </td>
        )}
      </tr>

      {/* Emergency Escalate dialog */}
      <ConfirmDialog
        isOpen={showEmergencyModal}
        title="Confirm Emergency Escalation"
        description={`Are you sure you want to escalate patient ${item.patientName} (${item.tokenNumber}) to Emergency (P-0)? This will immediately move them to position #1 in the queue and push notification alerts.`}
        confirmLabel="Escalate Immediately"
        onConfirm={handleMakeEmergency}
        onCancel={() => setShowEmergencyModal(false)}
        isConfirming={isSubmitting}
      />

      {/* No Show dialog */}
      <ConfirmDialog
        isOpen={showNoShowModal}
        title="Confirm Patient No-Show"
        description={`Confirm marking patient ${item.patientName} (${item.tokenNumber}) as No-Show. They will be removed from the active queue.`}
        confirmLabel="Mark as No-Show"
        onConfirm={handleMarkNoShow}
        onCancel={() => setShowNoShowModal(false)}
        isConfirming={isSubmitting}
      />
    </>
  );
};
export default QueueRow;
