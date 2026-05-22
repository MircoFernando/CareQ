import React, { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { departmentService } from '../../services/departmentService';
import WaitTimeTrendChart from '../../components/analytics/WaitTimeTrendChart';
import VolumeByDayChart from '../../components/analytics/VolumeByDayChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import PageHeader from '../../components/common/PageHeader';
import Select from '../../components/common/Select';
import { useQuery } from '@tanstack/react-query';
import { Calendar, RefreshCw, BarChart2, TrendingUp, Landmark } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>('ALL');

  // Load departments list for filtering
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getDepartments(),
  });

  // Fetch live wait trends hourly
  const { 
    waitTrends, 
    isLoading, 
    refetchTrends, 
    isRefetching 
  } = useAnalytics('trends', selectedDeptId === 'ALL' ? null : selectedDeptId);

  const handleDeptFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeptId(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center select-none">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-text-secondary font-bold mt-3 animate-pulse">Synchronizing Clinic Analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Analytics Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <PageHeader
          title="Clinical Queue Analytics"
          subtitle="Visualize clinic wait-time trends, consultation durations, and patient registration throughput."
        />

        <div className="flex items-center gap-3.5 self-start md:self-auto">
          {/* Clinic selection dropdown */}
          <div className="w-[180px] shrink-0">
            <div className="relative w-full">
              <Select
                value={selectedDeptId}
                onChange={handleDeptFilterChange}
                options={[
                  { value: 'ALL', label: 'All Clinics' },
                  ...departments.map((d) => ({ value: d.id, label: d.name })),
                ]}
                className="pl-8 rounded-xl py-1.5 text-xs font-semibold focus:border-primary border-border-default bg-white"
              />
              <div className="absolute left-2.5 top-[9px] text-primary pointer-events-none">
                <Landmark size={14} />
              </div>
            </div>
          </div>

          <button
            onClick={() => refetchTrends()}
            className="p-2.5 border border-border-default hover:bg-white bg-bg-secondary rounded-xl text-text-secondary transition-colors"
            title="Refresh Historical Analytics"
            disabled={isRefetching}
          >
            <RefreshCw size={15} className={`${isRefetching ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-500'}`} />
          </button>
        </div>
      </div>

      {/* Main Analytics Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Hourly wait trends area chart */}
        <WaitTimeTrendChart data={waitTrends} className="shadow-md" />

        {/* Daily Patient Volume gradient area chart */}
        <VolumeByDayChart className="shadow-md" />

      </div>

      {/* Historical summary cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 select-none">
        
        <Card className="bg-white border border-primary/10 shadow-md p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-primary-light text-primary rounded-xl shrink-0">
            <TrendingUp size={22} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Peak Waiting Hour</span>
            <span className="text-lg font-black text-text-primary mt-1">11:00 AM - 12:30 PM</span>
          </div>
        </Card>

        <Card className="bg-white border border-primary/10 shadow-md p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-500 rounded-xl shrink-0">
            <BarChart2 size={22} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Highest Throughput</span>
            <span className="text-lg font-black text-text-primary mt-1">General OPD (56/hr)</span>
          </div>
        </Card>

        <Card className="bg-white border border-primary/10 shadow-md p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-500 rounded-xl shrink-0">
            <Calendar size={22} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Weekly High-Volume Day</span>
            <span className="text-lg font-black text-text-primary mt-1">Friday (185 Patients)</span>
          </div>
        </Card>

      </div>

    </div>
  );
};

export default AnalyticsPage;
