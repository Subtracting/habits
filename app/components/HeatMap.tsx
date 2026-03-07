import React, { useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import type { Option } from '@/types/option.types';
import type { DaysState } from '@/types/days.types';
import InfoPopup from './InfoPopup';
import { toLocalDateString } from '../utils/habitCalculations';

type HeatMapProps = {
  selectedOption: Option | null
  days: DaysState
  updateDays:(dateToUpdate: Date, count: number, selectedOptionValue: string) => void;
  selectedYear: number
  selectedMinValue: number
  selectedMaxValue: number
}

export default function HeatMap({
    selectedOption,
    days,
    updateDays, 
    selectedYear,
    selectedMinValue,
    selectedMaxValue,
}: HeatMapProps) {
    const [infoPopupData, setInfoPopupData] = useState<{date: string, count: number} | null>(null);

    const baseValues = selectedOption ? days[selectedOption.value] || [] : [];
    const allDates = Array.from({ length: 365 }, (_, i) => {
        const d = new Date(`${selectedYear}-01-01`);
        d.setDate(d.getDate() + i);
        return toLocalDateString(d);
    });

    const valueMap = new Map(baseValues.map(v => [v.date, v.count]));

    const valuesWithToday = allDates.map(date => ({
        date,
        count: valueMap.get(date) ?? 0,
    }));


    const handleClick = (date: string, count: number) => {
        setInfoPopupData({ date, count });
    };

    return (
        <>
          <CalendarHeatmap
            startDate={`${selectedYear - 1}-12-31`}
            endDate={`${selectedYear}-12-31`}
            values={valuesWithToday}
            onClick={(value) => {
              if (value) handleClick(value.date, value.count);
            }}
            classForValue={(value) => {
              if (!value || value.count  == 0) return 'color-empty';
              const range = selectedMaxValue - selectedMinValue;
              if (range <= 0) return value.count > 0 ? 'color-scale-1' : 'color-scale-10';
              const normalized = (value.count - selectedMinValue) / range;
              const idx = Math.min(10, Math.max(1, Math.ceil(normalized * 10)));
              return `color-scale-${idx}`;
            }}

            transformDayElement={(element, value) =>
                React.cloneElement(element as React.ReactElement<React.SVGProps<SVGRectElement>>, {
                    onClick: () => handleClick(value!.date, value!.count),
                        style: { cursor: 'pointer' },
                })
            }


            />
            {infoPopupData && (
                <InfoPopup
                infoDate={infoPopupData.date}
                infoCount={infoPopupData.count}
                selectedOptionValue={selectedOption?.value ?? ''}
                updateDays={updateDays}
                onClose={() => setInfoPopupData(null)}
                />

            )}
            </>
    );
}
