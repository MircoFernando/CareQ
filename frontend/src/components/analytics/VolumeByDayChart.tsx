import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Card from '../common/Card';

interface VolumeItem {
  date: string;
  count: number;
}

interface VolumeByDayChartProps {
  data?: VolumeItem[];
  className?: string;
}

const DEFAULT_VOLUME_DATA: VolumeItem[] = [
  { date: 'Mon', count: 112 },
  { date: 'Tue', count: 145 },
  { date: 'Wed', count: 130 },
  { date: 'Thu', count: 162 },
  { date: 'Fri', count: 185 },
  { date: 'Sat', count: 90 },
  { date: 'Sun', count: 45 },
];

export const VolumeByDayChart: React.FC<VolumeByDayChartProps> = ({
  data = DEFAULT_VOLUME_DATA,
  className = '',
}) => {
  return (
    <Card className={`bg-white border border-primary/10 shadow-md p-5 rounded-2xl ${className}`}>
      <div className="flex flex-col mb-4 select-none">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Patient Volume Trends</h3>
        <p className="text-[10px] text-text-secondary mt-0.5">
          Daily volume of checked-in patient tokens over the past week.
        </p>
      </div>

      <div className="h-[280px] w-full text-xs font-semibold">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1A8C7A" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#1A8C7A" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="date"
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
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontFamily: 'inherit',
                fontSize: '11px',
              }}
            />
            <Area
              type="monotone"
              name="Patients Served"
              dataKey="count"
              stroke="#1A8C7A"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorVolume)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default VolumeByDayChart;
