'use client';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

import type { Option } from '@/types/option.types';
import type { DaysState } from '@/types/days.types';
import InfoPopup from './InfoPopup';
import { useState } from 'react';

type HeatMapProps = {
  screenWidth: number
  selectedOption: Option | null
  days: DaysState
  selectedMinValue: number
  selectedMaxValue: number
}


export default function HeatMap({
    screenWidth,
    selectedOption,
    days,
    selectedMinValue,
    selectedMaxValue,
    }: HeatMapProps) {

    const [infoPopupData, setInfoPopupData] = useState<{date: string, count: number}>({date: "", count: 0});

    return (
        <>
          <CalendarHeatmap
            horizontal={screenWidth > 786 || screenWidth == 0}
            startDate={new Date('2025-01-01')}
            endDate={new Date('2025-12-31')}
            values={selectedOption ? days[selectedOption.value] || [] : []}
            onClick={(value) => { 
              if (value) {
                  setInfoPopupData({ date: value.date, count: value.count });
              }
            }}
            classForValue={(value) => {
              if (!value) return 'color-empty';

              const range = selectedMaxValue - selectedMinValue;
              if (range <= 0) return value.count > 0 ? 'color-scale-1' : 'color-scale-10';

              const normalized = (value.count - selectedMinValue) / range;
              const idx = Math.min(10, Math.max(1, Math.ceil(normalized * 10)));

              return `color-scale-${idx}`;
            }}
          />

          {infoPopupData.date !== "" && (
              <InfoPopup
                infoDate={infoPopupData.date}
                infoCount={infoPopupData.count}
                onClose={() => setInfoPopupData({date: "", count: 0})}
              />
          )}
      </>
  )
}
