// packages/lib/src/components/presets/main-chart.tsx

import { ReactKlineChart } from '../react-kline-chart';
import type { KLineData, Signal, ThemeProp, MAParams } from '../../types';

interface MainChartProps {
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
 * 预设组件：只有主图
 * 包含蜡烛图 + MA均线，无副图指标
 */
export function MainChart({
  data,
  signals,
  theme,
  maParams = { periods: [5, 20] },
  height = 400,
  className,
}: MainChartProps) {
  return (
    <ReactKlineChart
      data={data}
      signals={signals}
      theme={theme}
      maParams={maParams}
      height={height}
      className={className}
    >
      {/* 不添加任何副图指标 */}
    </ReactKlineChart>
  );
}

MainChart.displayName = 'MainChart';
