import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../../services/departmentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { Landmark, Sliders, Save, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const ConfigurationPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Load department list
  const { data: departments = [], isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getDepartments(),
  });

  // Update SLA Mutation
  const updateSlaMutation = useMutation({
    mutationFn: ({ id, slaMinutes }: { id: string; slaMinutes: number }) =>
      departmentService.updateDepartmentSla(id, slaMinutes),
    onSuccess: (data) => {
      queryClient.setQueryData(['departments'], (old: any) =>
        (old || []).map((d: any) => (d.id === data.id ? data : d))
      );
      toast.success(`Successfully saved SLA for ${data.name} to ${data.slaMinutes} minutes!`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update SLA configuration.');
    },
  });

  const handleSlaSliderChange = (id: string, value: number) => {
    // Optimistically update local query state so slider feels extremely snappy
    queryClient.setQueryData(['departments'], (old: any) =>
      (old || []).map((d: any) => (d.id === id ? { ...d, slaMinutes: value } : d))
    );
  };

  const handleSaveSla = async (id: string, slaMinutes: number) => {
    await updateSlaMutation.mutateAsync({ id, slaMinutes });
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center select-none">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-text-secondary font-bold mt-3 animate-pulse">Launching Operations Config...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Configuration Header */}
      <PageHeader
        title="Hospital Operations SLA Configuration"
        subtitle="Manage clinical wait-time breach alarms, check-in timeouts, and active OPD services."
      />

      {/* Grid of Department Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 select-none animate-slide-up">
        {departments.map((dept) => (
          <Card
            key={dept.id}
            className="bg-white border border-primary/10 shadow-md p-6 rounded-3xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 border-b border-border-default pb-4 mb-4">
                <div className="p-2.5 bg-primary-light text-primary rounded-xl shrink-0">
                  <Landmark size={20} className="stroke-[2.5]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-sm font-black text-text-primary truncate">{dept.name}</h3>
                  <span className="text-[9px] text-text-secondary font-bold uppercase mt-0.5 tracking-wider">OPD Department Service</span>
                </div>
              </div>

              {/* Slider UI */}
              <div className="space-y-4 py-2">
                <div className="flex justify-between items-center text-xs font-bold text-text-primary">
                  <span className="flex items-center gap-1">
                    <Sliders size={14} className="text-text-secondary" />
                    <span>SLA Breach Threshold</span>
                  </span>
                  <span className="text-primary font-mono text-sm">{dept.slaMinutes} mins</span>
                </div>

                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={dept.slaMinutes}
                  onChange={(e) => handleSlaSliderChange(dept.id, Number(e.target.value))}
                  className="w-full h-1.5 bg-bg-secondary rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none transition-colors"
                />

                <div className="flex justify-between items-center text-[9px] font-bold text-text-secondary select-none">
                  <span>Fast: 5m</span>
                  <span>Standard: 20m</span>
                  <span>Relaxed: 60m</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-5 border-t border-border-default mt-6">
              <Button
                variant="primary"
                onClick={() => handleSaveSla(dept.id, dept.slaMinutes)}
                isLoading={updateSlaMutation.isPending && updateSlaMutation.variables?.id === dept.id}
                className="w-full rounded-xl flex items-center justify-center gap-1.5 py-2.5 font-bold text-xs"
              >
                <Save size={14} />
                <span>Save SLA Setup</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* SLA Alerting Notes */}
      <Card className="bg-white border border-primary/10 shadow-md p-5 rounded-3xl select-none">
        <h4 className="text-xs font-black text-text-primary uppercase tracking-widest border-b border-border-default pb-3.5 mb-3.5 flex items-center gap-1.5">
          <Sparkles className="text-primary" size={15} />
          <span>Queue Breach Mechanics</span>
        </h4>
        <ul className="space-y-3 text-xs text-text-secondary font-medium leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="h-5 w-5 bg-primary-light text-primary font-bold text-[10px] rounded-full flex items-center justify-center shrink-0">1</span>
            <span>If any waiting patient's check-in duration exceeds their department's SLA limit, a red alarm is logged instantly.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-5 w-5 bg-primary-light text-primary font-bold text-[10px] rounded-full flex items-center justify-center shrink-0">2</span>
            <span>Public screens and staff dashboards will display flashes, alert chimes, and highlight the breached row in red borders.</span>
          </li>
        </ul>
      </Card>

    </div>
  );
};

export default ConfigurationPage;
