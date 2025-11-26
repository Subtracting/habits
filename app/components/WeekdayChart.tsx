"use client"

import { WeekDaysData } from '@/types/weekdays.types';
import { BarChart, Bar, Rectangle, XAxis, Tooltip } from 'recharts';

type WeekdayChartProps = {
  weekdays: WeekDaysData[] 
};

type CustomBarShapeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: WeekDaysData & { rank: number };
};

const RANK_COLORS = [
  "#d6e685", "#c6e48b", "#9be9a8", "#7bc96f", "#5aa959", 
  "#40a346", "#338a3e", "#267030", "#1a5622", "#0d3c14"
];

const assignRanks = (data: WeekDaysData[]) => {
  if (!data?.length) return [];
  
  const uniqueCounts = [...new Set(data.map(d => d.count))].sort((a, b) => b - a);
  const countToRank = new Map(uniqueCounts.map((count, i) => [count, i + 1]));
  
  return data.map(item => ({
    ...item,
    rank: countToRank.get(item.count) || RANK_COLORS.length + 1,
  }));
};

const CustomBarShape = (props: CustomBarShapeProps) => {
  const { x, y, width, height, payload } = props;
  const color = RANK_COLORS[payload ? payload.rank - 1 : 0] || RANK_COLORS[RANK_COLORS.length - 1];
  
  return <Rectangle x={x} y={y} width={width} height={height} fill={color} opacity={0.8}/>;
};

export default function WeekdayChart({ weekdays }: WeekdayChartProps) {
  const rankedWeekdays = assignRanks(weekdays);
  
  return (
    <BarChart
      style={{ width: '50%', maxWidth: '500px', aspectRatio: 1.618 }}
      responsive
      data={rankedWeekdays}
      margin={{ top: 25, right: 25, left: 0, bottom: 25 }}
    >
      <XAxis dataKey="weekday" fontSize={12} />
      <Tooltip 
        cursor={false} 
        contentStyle={{ backgroundColor: "black" }} 
        formatter={(value: number) => [`Count: ${value}`]}
      />
      <Bar 
        dataKey="count" 
        shape={<CustomBarShape/>} 
        activeBar={<Rectangle fill="white" stroke="white" />} 
      />
    </BarChart>
  );
}
