import React from 'react';
import Card from '../../components/common/Card';
import PageHeader from '../../components/common/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { db } from '../../lib/mockServer';
import { Calendar, User } from 'lucide-react';
import Badge from '../../components/common/Badge';

export const AuditLogPage: React.FC = () => {
  // Fetch live events log from mock DB or fallback
  const { data: auditEvents = [] } = useQuery({
    queryKey: ['auditEvents'],
    queryFn: async () => {
      // In demo mode, fetch all logs from the mockServer events
      return db.events;
    },
  });

  const getLogStyle = (type: string) => {
    switch (type) {
      case 'TOKEN_ISSUED':
        return { variant: 'normal' as const, label: 'Token Issued' };
      case 'PRIORITY_CHANGED':
        return { variant: 'urgent' as const, label: 'Priority Changed' };
      case 'PATIENT_CALLED':
        return { variant: 'active' as const, label: 'Patient Called' };
      case 'IN_CONSULTATION_STARTED':
        return { variant: 'active' as const, label: 'In Consultation' };
      case 'CONSULTATION_COMPLETED':
        return { variant: 'normal' as const, label: 'Completed' };
      case 'NO_SHOW':
        return { variant: 'emergency' as const, label: 'No Show Marked' };
      case 'SLA_BREACHED':
        return { variant: 'sla' as const, label: 'SLA Limit Breach' };
      default:
        return { variant: 'normal' as const, label: type.replace('_', ' ') };
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Page Header */}
      <PageHeader
        title="Operations Audit Log Console"
        subtitle="Review security triggers, patient priority modifications, SLA warnings, and clinic events."
      />

      {/* Main Audit Logs Table Container */}
      <Card className="bg-white border border-primary/10 shadow-lg rounded-3xl p-5 md:p-6">
        <div className="flex items-center gap-2 border-b border-border-default pb-4 mb-5">
          <Calendar className="text-primary" size={20} />
          <h2 className="text-sm font-black text-text-primary uppercase tracking-wider">System Event Journal ({auditEvents.length})</h2>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border-default text-text-secondary font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 pr-4">Event Type</th>
                <th className="py-3 px-4">Operator / Actor</th>
                <th className="py-3 px-4">Context Details</th>
                <th className="py-3 pl-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/40 font-medium">
              {auditEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-text-secondary">
                    No system log events recorded today.
                  </td>
                </tr>
              ) : (
                auditEvents.map((evt) => {
                  const style = getLogStyle(evt.eventType);
                  const actor = evt.actorName || 'Clinical Kiosk (System)';
                  
                  // Render a helpful description based on the event payload
                  const getDescription = () => {
                    if (evt.eventType === 'PRIORITY_CHANGED') {
                      return `Priority shifted to ${evt.payload.newPriority === 0 ? 'Emergency' : evt.payload.newPriority === 1 ? 'Urgent' : 'Normal'} - Reason: "${evt.payload.reason || 'None provided'}"`;
                    }
                    if (evt.eventType === 'PATIENT_CALLED') {
                      return `Called patient to ${evt.payload.stationName || 'Station'}`;
                    }
                    if (evt.eventType === 'SLA_BREACHED') {
                      return `Token ${evt.payload.tokenNumber} elapsed wait time reached ${evt.payload.waitMinutes} minutes!`;
                    }
                    if (evt.payload.tokenNumber) {
                      return `Ticket reference: ${evt.payload.tokenNumber}`;
                    }
                    return 'Operation logged successfully.';
                  };

                  return (
                    <tr key={evt.id} className="hover:bg-bg-secondary/40 transition-colors">
                      {/* Event Type Badge */}
                      <td className="py-3.5 pr-4 select-none">
                        <Badge variant={style.variant} className="font-extrabold text-[9px] uppercase tracking-wider">
                          {style.label}
                        </Badge>
                      </td>

                      {/* Operator Name */}
                      <td className="py-3.5 px-4 text-text-secondary select-all">
                        <div className="flex items-center gap-1.5 font-bold">
                          <User size={12} className="text-text-secondary/60 shrink-0" />
                          <span>{actor}</span>
                        </div>
                      </td>

                      {/* Details context */}
                      <td className="py-3.5 px-4 text-text-primary font-semibold select-all">
                        {getDescription()}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 pl-4 text-right text-text-secondary font-mono select-all">
                        {new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};

export default AuditLogPage;
