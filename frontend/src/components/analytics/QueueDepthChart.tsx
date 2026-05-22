import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import Card from '../common/Card';

interface QueueDepthItem {
  departmentName: string;
  waiting: number;
}

interface QueueDepthChartProps {
  data: QueueDepthItem[];
  className?: string;
}

export const QueueDepthChart: React.FC<QueueDepthChartProps> = ({
  data = [],
  className = '',
}) => {
  // Beautiful HSL derived hospital brand colors
  const COLORS = ['#1A8C7A', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <Card className={`bg-white border border-primary/10 shadow-md p-5 rounded-2xl ${className}`}>
      <div className="flex flex-col mb-4 select-none">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Queue Depth by Department</h3>
        <p className="text-[10px] text-text-secondary mt-0.5">
          Live volume of patients currently waiting in line across clinics.
        </p>
      </div>

      <div className="h-[280px] w-full text-xs font-semibold">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barSize={32}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="departmentName"
              stroke="#94A3B8"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#94A3B8"
              tickLine={false}
              axisLine={false}
              dx={-5}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: '#F8FAFC', radius: 8 }}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontFamily: 'inherit',
                fontSize: '11px',
              }}
            />
            <Bar
              dataKey="waiting"
              name="Waiting Patients"
              radius={[8, 8, 0, 0]}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default QueueDepthChart;
