import React from 'react';
import Card from '../common/Card';

interface TokenCardProps {
  tokenNumber: string;
  departmentName?: string;
  className?: string;
}

export const TokenCard: React.FC<TokenCardProps> = ({ tokenNumber, departmentName, className = '' }) => {
  return (
    <Card className={`text-center animate-call-reveal bg-white border border-primary/20 shadow-md ${className}`}>
      <div className="flex flex-col select-none py-6">
        {departmentName && (
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            {departmentName}
          </span>
        )}
        <span className="text-7xl font-black text-primary tracking-tighter mt-4 select-all">
          {tokenNumber}
        </span>
        <span className="text-xs text-text-secondary mt-4 font-semibold">
          Your OPD Digital Token Number
        </span>
      </div>
    </Card>
  );
};
export default TokenCard;
