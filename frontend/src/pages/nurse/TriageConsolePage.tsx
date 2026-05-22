import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useQueue } from '../../hooks/useQueue';
import { useStations } from '../../hooks/useStations';
import { departmentService } from '../../services/departmentService';
import QueueTable from '../../components/queue/QueueTable';
import RegisterForm from '../../components/token/RegisterForm';
import KpiCard from '../../components/common/KpiCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import PageHeader from '../../components/common/PageHeader';
import { Users2, Clock, ShieldAlert, Landmark, Sparkles, MonitorPlay } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export const TriageConsolePage: React.FC = () => {
  const { profile } = useAuth();
  const deptId = profile?.departmentId || 'dept-opd'; // Fallback to general OPD if admin or mock
  
  // Load live waiting list and mutators for priority, status, and registration
  const {
    queueItems,
    stats,
    isLoading: queueLoading,
    registerPatient,
    isRegisteringPatient,
    updatePriority,
    updateStatus,
  } = useQueue(deptId);

  // Load active stations count
  const { stations = [], isLoading: stationsLoading } = useStations(deptId);

  // Query departments list to get the active department name
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getDepartments(),
  });

  const department = departments.find((d) => d.id === deptId);

  const handleInlineRegister = async (formData: { patientName: string; patientPhone: string; departmentId: string }) => {
    try {
      await registerPatient({
        patientName: formData.patientName,
        patientPhone: formData.patientPhone,
      });
      // success toast is fired inside hook
    } catch (err: any) {
      // error handled inside hook
    }
  };

  const handlePriorityChange = async (tokenId: string, priority: 0 | 1 | 2, reason: string) => {
    try {
      await updatePriority({ tokenId, priority, reason });
    } catch (err: any) {}
  };

  const handleStatusChange = async (tokenId: string, status: any) => {
    try {
      await updateStatus({ tokenId, status });
    } catch (err: any) {}
  };

  if (queueLoading || stationsLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center select-none">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-text-secondary font-bold mt-3 animate-pulse">Launching Triage Console...</span>
      </div>
    );
  }

  const activeConsultingCount = stations.filter((s) => !s.isPaused).length;

  return (
    <div className="space-y-6">
      
      {/* Triage Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <PageHeader
          title="Triage & Queue Console"
          subtitle={`Department monitoring dashboard and patient token control portal.`}
        />
        
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Active Clinic Info badge */}
          <div className="flex items-center gap-1.5 px-4 py-2 bg-primary-light border border-primary/20 rounded-xl text-xs font-bold text-primary-dark">
            <Landmark size={14} className="text-primary animate-pulse" />
            <span>Clinic: {department?.name || 'General OPD'}</span>
          </div>

          <a
            href={`/display/${deptId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 border border-border-default bg-white hover:bg-bg-secondary rounded-xl text-xs font-bold text-text-primary transition-colors shadow-sm"
          >
            <MonitorPlay size={14} className="text-text-secondary" />
            <span>Display Monitor</span>
          </a>
        </div>
      </div>

      {/* KPI Stats widgets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none">
        {/* Waiting count */}
        <KpiCard
          label="Patients Waiting"
          value={stats.totalWaiting}
          icon={Users2}
          iconColor="text-primary bg-primary-light"
        />

        {/* Consulting Desk */}
        <KpiCard
          label="Active Consulting"
          value={activeConsultingCount}
          icon={Landmark}
          iconColor="text-primary bg-primary-light"
        />

        {/* Avg Wait Minutes */}
        <KpiCard
          label="Avg Wait Duration"
          value={`${stats.avgWaitMinutesLastHour}m`}
          icon={Clock}
          iconColor="text-emerald-600 bg-emerald-50"
        />

        {/* SLA breaches count */}
        <KpiCard
          label="SLA Breach Alarms"
          value={stats.slaBreachCountToday}
          icon={ShieldAlert}
          iconColor={stats.slaBreachCountToday > 0 ? 'text-amber-600 bg-amber-50' : 'text-slate-600 bg-slate-50'}
        />
      </div>

      {/* Main Workspace Layout Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side Column - Registration Desk Form (1 col) */}
        <div className="xl:col-span-1 space-y-6">
          <RegisterForm
            fixedDepartmentId={deptId}
            onSubmit={handleInlineRegister}
            isLoading={isRegisteringPatient}
            className="shadow-md"
          />

          <Card className="p-5 bg-white border border-primary/10 shadow-md rounded-3xl select-none">
            <h4 className="text-xs font-black text-text-primary uppercase tracking-widest border-b border-border-default pb-3.5 mb-3.5 flex items-center gap-1.5">
              <Sparkles className="text-primary" size={15} />
              <span>Triage Quick Instructions</span>
            </h4>
            <ul className="space-y-3.5 text-xs text-text-secondary font-medium leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 bg-primary-light text-primary font-bold text-[10px] rounded-full flex items-center justify-center shrink-0">1</span>
                <span>Check patient vitals and symptoms immediately upon arrival.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 bg-primary-light text-primary font-bold text-[10px] rounded-full flex items-center justify-center shrink-0">2</span>
                <span>If symptoms are severe, update patient queue priority to <strong>Urgent</strong> or <strong>Emergency</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 bg-primary-light text-primary font-bold text-[10px] rounded-full flex items-center justify-center shrink-0">3</span>
                <span>Emergency tokens bypass the queue and appear at the top of Doctor stations instantly.</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Right Side Column - Main Live Queue Table Grid (2 cols) */}
        <div className="xl:col-span-2">
          <div className="shadow-md rounded-xl overflow-hidden">
            <QueueTable
              queue={queueItems}
              onUpdatePriority={handlePriorityChange}
              onUpdateStatus={handleStatusChange}
              isStaffActionable={true}
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default TriageConsolePage;
