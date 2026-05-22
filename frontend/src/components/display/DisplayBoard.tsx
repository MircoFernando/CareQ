import React from 'react';
import Card from '../common/Card';
import PriorityBadge from '../queue/PriorityBadge';
import { Volume2, Users, Clock, ArrowRight } from 'lucide-react';
import { TokenDetail } from '../../types/queue.types';

interface DisplayBoardProps {
  servingTokens: TokenDetail[];
  waitingTokens: TokenDetail[];
  departmentName?: string;
  className?: string;
}

export const DisplayBoard: React.FC<DisplayBoardProps> = ({
  servingTokens = [],
  waitingTokens = [],
  departmentName = 'General OPD',
  className = '',
}) => {
  // Take up to 6 currently serving tokens
  const activeServing = servingTokens.slice(0, 6);
  // Take up to 12 waiting tokens
  const activeWaiting = waitingTokens.filter((t) => t.status === 'WAITING').slice(0, 12);

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 select-none ${className}`}>
      {/* NOW SERVING - Left Columns (2 cols wide) */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="flex items-center justify-between bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-md">
          <h2 className="text-lg font-black tracking-wider uppercase flex items-center gap-2">
            <Volume2 className="animate-bounce shrink-0" size={24} />
            <span>Now Serving / දැන් කැඳවනු ලැබේ</span>
          </h2>
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full border border-white/10 shrink-0">
            {departmentName}
          </span>
        </div>

        {activeServing.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-border-default bg-white rounded-3xl min-h-[400px]">
            <Users size={48} className="text-text-secondary mb-4 animate-pulse" />
            <h3 className="text-lg font-bold text-text-primary">Waiting for Doctors to Call</h3>
            <p className="text-xs text-text-secondary mt-1 max-w-sm">
              There are currently no active patient tokens called in this clinic.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {activeServing.map((token) => (
              <Card
                key={token.tokenId}
                className="bg-white border-2 border-primary/20 shadow-xl overflow-hidden rounded-3xl animate-call-reveal flex flex-col justify-between"
              >
                {/* Visual pulse line */}
                <div className="h-2.5 bg-gradient-to-r from-secondary to-amber-400 animate-pulse" />

                <div className="p-6 text-center flex-1 flex flex-col justify-center py-8">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-secondary">
                    Token / අංකය
                  </span>
                  <h3 className="text-6xl font-black text-primary tracking-tighter mt-3 select-all">
                    {token.tokenNumber}
                  </h3>
                </div>

                <div className="bg-primary/5 border-t border-primary/10 px-6 py-4 flex items-center justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                      Proceed To / පිවිසෙන්න
                    </span>
                    <span className="text-sm font-black text-text-primary select-all">
                      {token.stationName || 'Consultation Station'}
                    </span>
                  </div>
                  <div className="p-2 bg-primary-light text-primary rounded-xl">
                    <ArrowRight size={18} className="stroke-[2.5]" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* WAITING LIST - Right Column (1 col wide) */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between bg-primary text-white px-6 py-4 rounded-2xl shadow-md">
          <h2 className="text-sm font-black tracking-wider uppercase flex items-center gap-2">
            <Clock size={18} />
            <span>Waiting List / පොරොත්තු ලේඛනය</span>
          </h2>
          <span className="text-xs font-black bg-white/20 px-2.5 py-0.5 rounded-full shrink-0">
            {waitingTokens.length} Waiting
          </span>
        </div>

        <Card className="bg-white border border-primary/10 shadow-lg rounded-3xl p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-text-secondary border-b border-border-default pb-3 mb-2 px-2">
            <span>Token</span>
            <span>Priority</span>
            <span className="text-right">Est. Wait</span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px] pr-1">
            {activeWaiting.length === 0 ? (
              <div className="text-center py-12 text-xs text-text-secondary select-none font-bold">
                No upcoming patients in queue.
              </div>
            ) : (
              activeWaiting.map((token) => (
                <div
                  key={token.tokenId}
                  className="flex items-center justify-between p-3 bg-bg-secondary hover:bg-bg-tertiary border border-border-default/40 rounded-2xl transition-all"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-black text-text-primary select-all">
                      {token.tokenNumber}
                    </span>
                    <span className="text-[9px] text-text-secondary font-medium uppercase mt-0.5">
                      Position: #{token.position}
                    </span>
                  </div>

                  <PriorityBadge priority={token.priority} />

                  <span className="text-xs font-bold text-text-primary text-right">
                    {token.estimatedWaitMinutes} mins
                  </span>
                </div>
              ))
            )}
          </div>

          {waitingTokens.length > 12 && (
            <div className="pt-3 border-t border-border-default text-center text-[10px] font-bold text-text-secondary uppercase select-none animate-pulse">
              + {waitingTokens.length - 12} more patients waiting in queue
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DisplayBoard;
