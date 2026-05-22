import React from 'react';
import { Activity } from 'lucide-react';

interface AppLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = '', iconClassName = '', textClassName = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`p-1.5 bg-primary rounded-lg text-white flex items-center justify-center ${iconClassName}`}>
        <Activity size={20} className="stroke-[2.5]" />
      </div>
      <span className={`font-sans font-black tracking-tight text-xl text-text-primary flex items-center ${textClassName}`}>
        Care<span className="text-primary">Q</span>
      </span>
    </div>
  );
};
export default AppLogo;
