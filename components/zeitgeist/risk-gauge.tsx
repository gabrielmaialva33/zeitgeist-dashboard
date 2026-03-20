'use client'

import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface RiskGaugeProps {
  score: number
  label?: string
}

export function RiskGauge({ score, label = 'Global Risk' }: RiskGaugeProps) {
  const color = score >= 75 ? '#ef4444' : score >= 50 ? '#f59e0b' : score >= 25 ? '#06b6d4' : '#10b981'

  const options: ApexCharts.ApexOptions = {
    chart: { type: 'radialBar', background: 'transparent' },
    plotOptions: {
      radialBar: {
        hollow: { size: '65%' },
        track: { background: '#1f2937' },
        dataLabels: {
          name: { color: '#9ca3af', fontSize: '12px', offsetY: 20 },
          value: {
            color: '#f9fafb',
            fontSize: '32px',
            fontWeight: '700',
            offsetY: -15,
            formatter: (val) => String(Math.round(val)),
          },
        },
      },
    },
    colors: [color],
    labels: [label],
    stroke: { lineCap: 'round' },
    theme: { mode: 'dark' },
  }

  return <Chart type="radialBar" series={[score]} options={options} height={220} width={220} />
}
