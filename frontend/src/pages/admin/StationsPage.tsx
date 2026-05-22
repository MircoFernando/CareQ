import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationService } from '../../services/stationService';
import { departmentService } from '../../services/departmentService';
import StationStatusBadge from '../../components/station/StationStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { Stethoscope, Play, Pause, Landmark, User, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const StationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dept-opd');

  // Load departments
  const { data: departments = [], isLoading: deptLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getDepartments(),
  });

  // Load stations for selected department
  const { data: stations = [], isLoading: stationsLoading, refetch } = useQuery({
    queryKey: ['stations', selectedDeptId],
    queryFn: () => stationService.getStations(selectedDeptId),
    enabled: !!selectedDeptId,
  });

  // Toggle station pause status mutation
  const togglePauseMutation = useMutation({
    mutationFn: ({ id, isPaused }: { id: string; isPaused: boolean }) =>
      stationService.updateStationStatus(id, isPaused),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stations', selectedDeptId] });
      toast.success(
        data.isPaused
          ? `Station ${data.name} has been paused.`
          : `Station ${data.name} is now active and online.`
      );
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update station state.');
    },
  });

  const handleTogglePause = async (id: string, isPaused: boolean) => {
    await togglePauseMutation.mutateAsync({ id, isPaused });
  };

  if (deptLoading || stationsLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center select-none">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-text-secondary font-bold mt-3 animate-pulse">Launching Consulting Stations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Stations Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <PageHeader
          title="OPD Consulting Doctor Stations"
          subtitle="Monitor active doctor stations, review patients served counters, and toggle pauses."
        />

        <div className="flex items-center gap-3.5 self-start md:self-auto">
          {/* Clinic filter select */}
          <div className="relative w-[180px] shrink-0">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary z-10">
              <Landmark size={14} />
            </span>
            <Select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
              className="pl-10 rounded-xl py-1.5 text-xs font-semibold focus:border-primary border-border-default bg-white"
            />
          </div>

          <button
            onClick={() => refetch()}
            className="p-2.5 border border-border-default hover:bg-white bg-bg-secondary rounded-xl text-text-secondary transition-colors"
            title="Refresh Stations State"
          >
            <RefreshCw size={15} className="hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Grid list of Station cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 select-none animate-slide-up">
        {stations.length === 0 ? (
          <div className="col-span-full py-16 text-center text-text-secondary text-sm font-bold">
            No doctor stations configured for this OPD department.
          </div>
        ) : (
          stations.map((st) => {
            const hasDoctor = !!st.activeDoctorName;
            
            return (
              <Card
                key={st.id}
                className="bg-white border border-primary/10 shadow-md p-6 rounded-3xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border-default pb-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-primary-light text-primary rounded-xl shrink-0">
                        <Stethoscope size={18} className="stroke-[2.5]" />
                      </div>
                      <h3 className="text-sm font-black text-text-primary select-all">{st.name}</h3>
                    </div>
 
                    <StationStatusBadge
                      isPaused={st.isPaused}
                      isActiveDoctor={hasDoctor}
                      currentServedTokenNumber={st.currentServedTokenNumber}
                    />
                  </div>
 
                  {/* Doctor assignment details */}
                  <div className="space-y-4 py-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                      <User size={14} className="text-text-secondary" />
                      <span>Doctor: </span>
                      <span className="font-extrabold text-text-primary">
                        {st.activeDoctorName || (
                          <span className="italic text-text-secondary/50 font-normal">Desk Closed</span>
                        )}
                      </span>
                    </div>
 
                    {/* Quick Stats list */}
                    <div className="bg-bg-secondary p-3 rounded-2xl space-y-2 border border-border-default/40">
                      <div className="flex justify-between items-center text-[10px] font-bold text-text-secondary">
                        <span>Patients Served</span>
                        <span className="text-text-primary font-extrabold">{st.patientsServedCountToday || 0}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold text-text-secondary">
                        <span>Average Duration</span>
                        <span className="text-text-primary font-extrabold">{st.averageServiceMinutesToday || 0} mins</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold text-text-secondary">
                        <span>Desk Efficiency score</span>
                        <span className="text-emerald-600 font-extrabold">{st.efficiencyScore || 85}%</span>
                      </div>
                    </div>
                  </div>
                </div>
 
                {/* Pause/Resume buttons */}
                {hasDoctor && (
                  <div className="pt-5 border-t border-border-default mt-6">
                    <Button
                      variant={st.isPaused ? 'primary' : 'secondary'}
                      onClick={() => handleTogglePause(st.id, !st.isPaused)}
                      isLoading={togglePauseMutation.isPending && togglePauseMutation.variables?.id === st.id}
                      className={`w-full rounded-xl flex items-center justify-center gap-1 py-2 font-bold ${
                        st.isPaused
                          ? 'bg-amber-500 hover:bg-amber-600 border-amber-500 hover:border-amber-600 text-white shadow-md'
                          : 'border-amber-200 hover:bg-amber-50 text-amber-600'
                      }`}
                    >
                      {st.isPaused ? <Play size={14} /> : <Pause size={14} />}
                      <span>{st.isPaused ? 'Resume Doctor Station' : 'Pause Doctor Station'}</span>
                    </Button>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

    </div>
  );
};

export default StationsPage;
