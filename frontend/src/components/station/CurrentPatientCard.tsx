import React, { useState } from 'react';
import { TokenDetail } from '../../types/queue.types';
import Card from '../common/Card';
import PriorityBadge from '../queue/PriorityBadge';
import ConsultationTimer from './ConsultationTimer';
import Button from '../common/Button';
import Input from '../common/Input';
import { Thermometer, Heart, Activity, FileText, CheckCircle, ShieldAlert, Sparkles, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

interface CurrentPatientCardProps {
  patient: TokenDetail | null;
  onComplete: (vitals: any, notes: string) => Promise<void>;
  onNoShow: () => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export const CurrentPatientCard: React.FC<CurrentPatientCardProps> = ({
  patient,
  onComplete,
  onNoShow,
  isLoading = false,
  className = '',
}) => {
  const [temperature, setTemperature] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [pulse, setPulse] = useState('');
  const [notes, setNotes] = useState('');

  if (!patient) {
    return (
      <Card className={`flex flex-col items-center justify-center text-center p-12 bg-white border border-dashed border-border-default rounded-3xl min-h-[400px] select-none ${className}`}>
        <div className="p-4 bg-primary-light text-primary rounded-full mb-4 animate-pulse">
          <User size={36} className="stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">No Active Patient</h3>
        <p className="text-xs text-text-secondary mt-1 max-w-xs">
          Select or call the next patient from the queue sidebar to start consultation.
        </p>
      </Card>
    );
  }

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patient.status !== 'IN_CONSULTATION') {
      toast.error('Patient consultation has not started yet. Make sure status is In Consultation.');
      return;
    }
    
    onComplete(
      {
        temperature: temperature.trim(),
        bloodPressure: bloodPressure.trim(),
        pulse: pulse.trim(),
      },
      notes.trim()
    );
  };

  const isConsultationActive = patient.status === 'IN_CONSULTATION';

  return (
    <Card className={`bg-white border border-primary/10 shadow-xl overflow-hidden rounded-3xl select-none ${className}`}>
      {/* Header Info */}
      <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl flex flex-col items-center shadow-inner">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/75">Token</span>
            <span className="text-3xl font-black tracking-tight">{patient.tokenNumber}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight truncate">{patient.patientName}</h2>
              <PriorityBadge priority={patient.priority} />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/80 mt-1.5 font-medium">
              <span className="flex items-center gap-1">
                <Phone size={13} />
                {patient.patientPhone}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/40"></span>
              <span>Checked in: {new Date(patient.issuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {/* Live Timer */}
        <ConsultationTimer
          startedAt={patient.calledAt}
          isActive={isConsultationActive}
          className="bg-white/10 border-white/20 text-white shrink-0 self-start md:self-auto"
        />
      </div>

      {/* Workspace Panel */}
      <form onSubmit={handleCompleteSubmit} className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Temperature */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Thermometer size={14} className="text-primary" />
              <span>Temperature (°C)</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. 36.8"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              disabled={!isConsultationActive || isLoading}
              className="rounded-xl border-border-default focus:border-primary font-mono text-sm"
            />
          </div>

          {/* BP */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={14} className="text-primary" />
              <span>Blood Pressure</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. 120/80"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
              disabled={!isConsultationActive || isLoading}
              className="rounded-xl border-border-default focus:border-primary font-mono text-sm"
            />
          </div>

          {/* Pulse */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Heart size={14} className="text-primary" />
              <span>Pulse Rate (bpm)</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. 72"
              value={pulse}
              onChange={(e) => setPulse(e.target.value)}
              disabled={!isConsultationActive || isLoading}
              className="rounded-xl border-border-default focus:border-primary font-mono text-sm"
            />
          </div>
        </div>

        {/* Assessment Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={14} className="text-primary" />
            <span>Clinical Assessment & Prescription Notes</span>
          </label>
          <textarea
            placeholder="Document vital observations, primary symptoms, diagnosed condition, and recommended medications/prescriptions..."
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={!isConsultationActive || isLoading}
            className="w-full text-sm font-medium border border-border-default rounded-2xl p-4 bg-bg-secondary focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 resize-none leading-relaxed"
          />
        </div>

        {/* Actions bar */}
        <div className="border-t border-border-default pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-text-secondary font-medium">
            Status: <span className="font-bold text-text-primary">{patient.status}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Missed No Show */}
            {patient.status === 'CALLED' && (
              <Button
                type="button"
                variant="secondary"
                onClick={onNoShow}
                isLoading={isLoading}
                className="border-red-200 hover:bg-red-50 text-red-600 rounded-xl"
              >
                <ShieldAlert size={16} className="mr-1.5" />
                No Show / Missed
              </Button>
            )}

            {/* Complete Consultation */}
            {isConsultationActive ? (
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="px-6 py-2.5 rounded-xl shadow-md"
              >
                <CheckCircle size={16} className="mr-1.5" />
                Complete Consultation
              </Button>
            ) : (
              patient.status === 'CALLED' && (
                <div className="text-sm font-bold text-secondary animate-pulse flex items-center gap-1">
                  <Sparkles size={16} />
                  <span>Start consultation via the Station Action Bar!</span>
                </div>
              )
            )}
          </div>
        </div>
      </form>
    </Card>
  );
};

export default CurrentPatientCard;
