import { HabitStats } from "@/types/stats.types";

export default function CurrentStats({
    currentStats,
} : {
    currentStats: HabitStats; 
}) {

  return (
    <>
        <div>
            <table>
                <thead>
                    <tr>
                        <th align='left'>Statistic</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total Count</td>
                        <td>{currentStats.total}</td>
                    </tr>
                    <tr>
                        <td>Max Daily Count&nbsp;</td>
                        <td>{currentStats.max}</td>
                    </tr>
                    <tr>
                        <td>Min Daily Count</td>
                        <td>{currentStats.min}</td>
                    </tr>
                    <tr>
                        <td>Current Streak</td>
                        <td>{currentStats.streak}</td>
                    </tr>
                    <tr>
                        <td>7-Day Total</td>
                        <td>{currentStats.weekTotal}</td>
                    </tr>
                    <tr>
                        <td>Month Total</td>
                        <td>{currentStats.monthTotal}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
  )
}
