import { ResponsivePie } from '@nivo/pie'
import { ChartItem } from '../types'

interface ResultChartProps {
  data: ChartItem[]
}

const ResultChart: React.FC<ResultChartProps> = ({ data }) => {
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      innerRadius={0.4}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={12}
      colors={{ scheme: 'blues' }}
      borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
      enableArcLinkLabels={false}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabel="label"
      arcLabelsSkipAngle={5}
      arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2.7]] }}
      motionConfig="wobbly"
      legends={[]}
    />
  )
}

export default ResultChart
