import { ComputedDatum, ResponsiveBar } from '@nivo/bar'
import { useEffect, useState } from 'react'
import { BarItem } from '../types'
import { formatAddress, formatPercentage } from '../utils'

interface BarChartProps {
  data: BarItem[]
  keys?: string[]
  totalPowerCast?: number
}

const BarChart: React.FC<BarChartProps> = ({ data, keys, totalPowerCast }) => {
  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy="choice"
      maxValue={'auto'}
      padding={0.3}
      margin={{ bottom: 22 }}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      valueFormat={(value) =>
        totalPowerCast
          ? formatPercentage(value / totalPowerCast) + '%'
          : String(value)
      }
      colors={{ scheme: 'paired' }}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisLeft={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
    />
  )
}

export default BarChart
