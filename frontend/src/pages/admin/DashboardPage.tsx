import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import KpiCard from '../../components/common/KpiCard';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import QueueDepthChart from '../../components/analytics/QueueDepthChart';
import DepartmentPieChart from '../../components/analytics/DepartmentPieChart';
import { Landmark, Users2, Clock, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { kpis, isLoading, refetchDashboard, isRefetching } = useAnalytics('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center select-none">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-text-secondary font-bold mt-3 animate-pulse">Synchronizing Enterprise Dashboard...</span>
      </div>
    );
  }

  // Fallback defaults
  const metrics = kpis || {
    activeQueues: 3,
    activeStations: 5,
    totalPatientsToday: 42,
    avgWaitMinutesToday: 18,
    departmentQueueDepths: [],
    liveAlerts: [],
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <PageHeader
          title="Super Admin Dashboard"
          subtitle="Hospital operations control, live clinic statistics, and queue monitor metrics."
        />

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => refetchDashboard()}
            className="p-2 border border-border-default hover:bg-white bg-bg-secondary rounded-xl text-text-secondary transition-colors"
            title="Refresh Live Statistics"
            disabled={isRefetching}
          >
            <RefreshCw size={15} className={`${isRefetching ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-500'}`} />
          </button>

          <div className="flex items-center gap-1.5 px-4 py-2 bg-primary-light border border-primary/20 rounded-xl text-xs font-bold text-primary-dark">
            <Sparkles size={14} className="text-primary animate-pulse" />
            <span>Sandbox Mode Active</span>
          </div>
        </div>
      </div>

      {/* KPI Stats widgets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none">
        {/* Active Clinics */}
        <KpiCard
          label="Active Queues"
          value={metrics.activeQueues}
          icon={Landmark}
          iconColor="text-primary bg-primary-light"
        />

        {/* Consulting Desk */}
        <KpiCard
          label="Active Stations"
          value={metrics.activeStations}
          icon={Landmark}
          iconColor="text-primary bg-primary-light"
        />

        {/* Checked-in count */}
        <KpiCard
          label="Total Check-ins Today"
          value={metrics.totalPatientsToday}
          icon={Users2}
          iconColor="text-emerald-600 bg-emerald-50"
        />

        {/* Average wait */}
        <KpiCard
          label="Avg Patient Wait"
          value={`${metrics.avgWaitMinutesToday} mins`}
          icon={Clock}
          iconColor={metrics.avgWaitMinutesToday >= 20 ? 'text-amber-600 bg-amber-50' : 'text-slate-600 bg-slate-50'}
        />
      </div>

      {/* Charts panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Queue Depth chart */}
        <QueueDepthChart data={metrics.departmentQueueDepths} className="shadow-md" />
        
        {/* Pie Department distribution donut */}
        <DepartmentPieChart data={metrics.departmentQueueDepths} className="shadow-md" />
      </div>

      {/* Live Alerts and system status log */}
      <Card className="bg-white border border-primary/10 shadow-md p-5 rounded-3xl select-none">
        <h3 className="text-xs font-black text-text-primary uppercase tracking-widest border-b border-border-default pb-3.5 mb-4 flex items-center gap-1.5">
          <ShieldAlert className="text-amber-500" size={16} />
          <span>Live Security & SLA Alert Monitor</span>
        </h3>

        <div className="space-y-3">
          {metrics.liveAlerts.length === 0 ? (
            <div className="text-center py-6 text-xs text-text-secondary font-bold">
              System quiet. No operational SLA alarms logged in the past hour.
            </div>
          ) : (
            metrics.liveAlerts.map((alert, index) => (
              <div
                key={index}
                className="p-3 bg-red-50 border border-red-100 text-red-900 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 hover:scale-[1.005] transition-transform"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping shrink-0" />
                  <span>{alert.message}</span>
                </div>
                <span className="text-[10px] text-red-500 font-bold shrink-0">
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>

    </div>
  );
};

export default DashboardPage;
