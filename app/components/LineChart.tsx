"use client"

import { DayData } from "@/types/days.types"
import {
  LineChart,
  Line,
  Tooltip,
  YAxis,
  XAxis
} from "recharts"

type LineChartProps = {
  days?: DayData[] 
}

export default function SimpleLineChart({ days }: LineChartProps) {
  const sortedData = [...(days ?? [])].sort((a, b) =>
          a.date.localeCompare(b.date)
        );
  return (
    <div className="rounded-lg">

      <div className="mx-auto">
      <LineChart 
            style={{ width: '400px', height: '400px', aspectRatio: 1.618 }}
            responsive
            margin={{ left: 40, right: 40, top: 40, bottom: 0 }} 
            height={500} 
            data={sortedData}
          >
      <XAxis dataKey="date" angle={-16}
          tickFormatter={(value) => {
            const date = new Date(value);
            const dd = String(date.getDate()).padStart(2, "0");
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            return `${dd}-${mm}`;
          }}
      />
      <YAxis width="auto" />
      <Tooltip 
        contentStyle={{ backgroundColor: "black" }} 
        itemStyle={{ color: "white" }}
        labelStyle={{ color: "grey" }}
      />
      <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
      </div>

    </div>
  )
}
