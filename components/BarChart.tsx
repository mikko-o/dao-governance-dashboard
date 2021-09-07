import { ComputedDatum, ResponsiveBar } from '@nivo/bar'
import { useEffect, useState } from 'react'
import { BarItem } from '../types'
import { formatAddress, formatPercentage } from '../utils'

interface BarChartProps {
  data: BarItem[]
  keys?: string[]
  maxValue?: number
}

const BarChart: React.FC<BarChartProps> = ({ data, keys, maxValue }) => {
  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy="choice"
      maxValue={maxValue ?? 'auto'}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      valueFormat={(value) =>
        maxValue ? formatPercentage(value / maxValue) + '%' : String(value)
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
        legend: 'country',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
    />
  )
}

export default BarChart
