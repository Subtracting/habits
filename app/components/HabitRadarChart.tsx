"use client"

import { MonthState } from "@/types/months.types"
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  Tooltip, ResponsiveContainer,
} from "recharts"
import type { Option } from "@/types/option.types"

type RadarChartProps = {
  months: MonthState
  selectedOption: Option | null
}

export default function RadarChartSimple({months, selectedOption}: RadarChartProps) {
  return (
    <div className="rounded-lg w-md p-4">

      <div className="mx-auto aspect-square">
        <ResponsiveContainer>
          <RadarChart 
            margin={{ left: 40, right: 20, top: 20, bottom: 20 }} 
            height={800} 
            data={months ? months[selectedOption ? selectedOption.value: ""] : []}>
            <defs>
              <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9be9a8" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#40c463" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#1a5622" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{ backgroundColor:"black" }}
            />
            <PolarGrid stroke="#fff" opacity={0.1}/>
            <PolarAngleAxis tick={{ fontSize: 13 }} dataKey="month" />
            <Radar
              dataKey="count"
              stroke="#9be9a8"
              fill="url(#countGradient)"
              fillOpacity={1}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

