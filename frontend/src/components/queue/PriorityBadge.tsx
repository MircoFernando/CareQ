import React from 'react';
import Badge from '../common/Badge';
import { Priority } from '../../types/queue.types';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  switch (priority) {
    case 0:
      return (
        <Badge variant="emergency" className={`px-2.5 py-0.5 font-bold ${className}`}>
          ⚠️ P-0 Emergency
        </Badge>
      );
    case 1:
      return (
        <Badge variant="urgent" className={`px-2.5 py-0.5 font-bold ${className}`}>
          ⚡ P-1 Urgent
        </Badge>
      );
    case 2:
      return (
        <Badge variant="normal" className={`px-2.5 py-0.5 font-bold ${className}`}>
          ✓ P-2 Normal
        </Badge>
      );
    default:
      return (
        <Badge variant="normal" className={`px-2.5 py-0.5 font-bold ${className}`}>
          P-2 Normal
        </Badge>
      );
  }
};
export default PriorityBadge;
