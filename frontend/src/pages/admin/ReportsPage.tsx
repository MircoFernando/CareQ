import React, { useState } from 'react';
import { analyticsService } from '../../services/analyticsService';
import Card from '../../components/common/Card';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Calendar, FileDown, FileSpreadsheet, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReportsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const blob = await analyticsService.generateReport(selectedDate);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CareQ_Operational_Report_${selectedDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Successfully compiled and downloaded PDF report!');
    } catch (err: any) {
      toast.error('Failed to generate operational PDF report.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleExportCsv = async () => {
    setIsExportingCsv(true);
    try {
      const blob = await analyticsService.exportCsv();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CareQ_Data_Export_${selectedDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Successfully compiled and exported CSV queue logs!');
    } catch (err: any) {
      toast.error('Failed to export CSV dataset logs.');
    } finally {
      setIsExportingCsv(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Reports Header */}
      <PageHeader
        title="Operational Report Compilation Desk"
        subtitle="Download clinic statistics, check-in timelines, and SLA performance sheets."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Compilation Controls */}
        <Card className="bg-white border border-primary/10 shadow-md p-6 rounded-3xl md:col-span-1 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-text-primary uppercase tracking-widest border-b border-border-default pb-3.5 flex items-center gap-1.5">
              <Calendar className="text-primary" size={16} />
              <span>Compilation Date Filter</span>
            </h3>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">Target Date</label>
              <div className="relative w-full">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/50 z-10">
                  <Calendar size={18} />
                </span>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-11 rounded-xl border-border-default focus:border-primary"
                />
              </div>
            </div>
            
            <p className="text-[10px] text-text-secondary font-medium leading-relaxed">
              Reports compile clinical metrics, doctor station efficiency, and SLA warnings up to midnight of the target date.
            </p>
          </div>

          <div className="border-t border-border-default pt-5 mt-6 space-y-3">
            {/* PDF Report compiler */}
            <Button
              variant="primary"
              onClick={handleDownloadPdf}
              isLoading={isGeneratingPdf}
              className="w-full rounded-xl flex items-center justify-center gap-1.5 py-3 font-bold shadow-md"
            >
              <FileDown size={14} />
              <span>Generate PDF Summary</span>
            </Button>

            {/* CSV Log exporter */}
            <Button
              variant="secondary"
              onClick={handleExportCsv}
              isLoading={isExportingCsv}
              className="w-full rounded-xl flex items-center justify-center gap-1.5 py-3 font-bold border-border-default hover:bg-bg-secondary"
            >
              <FileSpreadsheet size={14} />
              <span>Export CSV Queue Logs</span>
            </Button>
          </div>
        </Card>

        {/* Right Side: Available Reports Logs (2 cols) */}
        <Card className="bg-white border border-primary/10 shadow-md p-6 rounded-3xl md:col-span-2 space-y-4">
          <h3 className="text-xs font-black text-text-primary uppercase tracking-widest border-b border-border-default pb-3.5 flex items-center gap-1.5">
            <BarChart2 className="text-primary" size={16} />
            <span>Available Historical Compilation Runs</span>
          </h3>

          <div className="space-y-3">
            {/* Quick logs of recent runs */}
            {[
              { title: 'Weekly Throughput Review (Run #042)', type: 'PDF', date: '2026-05-20', size: '2.1 MB' },
              { title: 'SLA Breach Alarms Audit (Run #041)', type: 'CSV', date: '2026-05-19', size: '420 KB' },
              { title: 'Doctor Efficiency Scores (Run #040)', type: 'PDF', date: '2026-05-18', size: '1.8 MB' },
            ].map((run, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-bg-secondary hover:bg-bg-tertiary border border-border-default/40 rounded-2xl flex items-center justify-between gap-3 transition-colors text-xs font-semibold"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl shrink-0 ${run.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {run.type === 'PDF' ? <FileDown size={16} /> : <FileSpreadsheet size={16} />}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-text-primary truncate">{run.title}</span>
                    <span className="text-[9px] text-text-secondary mt-0.5 font-bold uppercase tracking-wider">{run.date} • {run.size}</span>
                  </div>
                </div>

                <button 
                  onClick={handleDownloadPdf}
                  className="text-[10px] font-black text-primary hover:underline"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
};

export default ReportsPage;
