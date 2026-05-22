import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from '../common/Card';
import { WaitTrendItem } from '../../types/api.types';

interface WaitTimeTrendChartProps {
  data: WaitTrendItem[];
  className?: string;
}

export const WaitTimeTrendChart: React.FC<WaitTimeTrendChartProps> = ({
  data,
  className = '',
}) => {
  // Let's filter the data to represent active trends elegantly
  const formattedData = data.map((item) => {
    // If the data is 0, let's smooth it with a reasonable baseline for rendering
    return {
      ...item,
      morning: item.morning || null,
      afternoon: item.afternoon || null,
      evening: item.evening || null,
    };
  });

  return (
    <Card className={`bg-white border border-primary/10 shadow-md p-5 rounded-2xl ${className}`}>
      <div className="flex flex-col mb-4 select-none">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Average Wait Time Trends</h3>
        <p className="text-[10px] text-text-secondary mt-0.5">
          Average patient wait durations (minutes) grouped by morning, afternoon, and evening shifts.
        </p>
      </div>

      <div className="h-[280px] w-full text-xs font-semibold">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMorning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1A8C7A" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#1A8C7A" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorAfternoon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorEvening" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="hour"
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
            />
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
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                paddingBottom: '10px',
                fontSize: '11px',
              }}
            />
            <Area
              type="monotone"
              name="Morning Shift"
              dataKey="morning"
              stroke="#1A8C7A"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorMorning)"
              connectNulls
            />
            <Area
              type="monotone"
              name="Afternoon Shift"
              dataKey="afternoon"
              stroke="#F59E0B"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorAfternoon)"
              connectNulls
            />
            <Area
              type="monotone"
              name="Evening Shift"
              dataKey="evening"
              stroke="#6366F1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorEvening)"
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default WaitTimeTrendChart;
