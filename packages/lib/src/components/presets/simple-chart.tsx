// packages/lib/src/components/presets/simple-chart.tsx

import { ReactKlineChart } from '../react-kline-chart';
import { Indicator } from '../indicator';
import type { KLineData, Signal, ThemeProp, MAParams } from '../../types';

interface SimpleChartProps {
  /** K线数据 */
  data: KLineData[];
  /** 买卖信号点（可选） */
  signals?: Signal[];
  /** 主题配置 */
  theme?: ThemeProp;
  /** MA均线配置（可选） */
  maParams?: MAParams;
  /** 图表高度 */
  height?: number | string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 预设组件：主图 + 成交量 + MACD
 * 包含蜡烛图 + MA均线 + VOL + MACD
 */
export function SimpleChart({
  data,
  signals,
  theme,
  maParams = { periods: [5, 20] },
  height = 600,
  className,
}: SimpleChartProps) {
  return (
    <ReactKlineChart
      data={data}
      signals={signals}
      theme={theme}
      maParams={maParams}
      height={height}
      className={className}
    >
      {/* 副图按顺序：VOL在上，MACD在下 */}
      <Indicator type="VOL" />
      <Indicator type="MACD" params={{ fast: 12, slow: 26, signal: 9 }} />
    </ReactKlineChart>
  );
}

SimpleChart.displayName = 'SimpleChart';
