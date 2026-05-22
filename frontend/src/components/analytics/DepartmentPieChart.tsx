import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Card from '../common/Card';

interface DeptRatioItem {
  departmentName: string;
  waiting: number;
}

interface DepartmentPieChartProps {
  data: DeptRatioItem[];
  className?: string;
}

export const DepartmentPieChart: React.FC<DepartmentPieChartProps> = ({
  data = [],
  className = '',
}) => {
  // Let's filter out departments with 0 waiting to prevent weird rendering
  const activeData = data.filter((d) => d.waiting > 0);
  
  // Custom hospital palette
  const COLORS = ['#1A8C7A', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];

  const noData = activeData.length === 0;

  return (
    <Card className={`bg-white border border-primary/10 shadow-md p-5 rounded-2xl ${className}`}>
      <div className="flex flex-col mb-2 select-none">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Patient Distribution</h3>
        <p className="text-[10px] text-text-secondary mt-0.5">
          Ratio of currently waiting patients across active clinic services.
        </p>
      </div>

      <div className="h-[280px] w-full text-xs font-semibold flex items-center justify-center">
        {noData ? (
          <div className="text-center text-text-secondary text-xs py-10 font-bold select-none">
            No patients waiting in any queue.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activeData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="waiting"
                nameKey="departmentName"
              >
                {activeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontFamily: 'inherit',
                  fontSize: '11px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: '11px',
                  paddingTop: '10px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default DepartmentPieChart;
