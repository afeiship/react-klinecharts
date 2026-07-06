// packages/lib/src/index.tsx

// 导出主组件
export { ReactKlineChart } from './components/react-kline-chart';
export { Indicator } from './components/indicator';

// 导出预设组件
export { MainChart } from './components/presets/main-chart';
export { SimpleChart } from './components/presets/simple-chart';

// 导出注册方法
export { registerIndicator, indicatorRegistry } from './core/indicator-registry';

// 导出类型定义
export type {
  KLineData,
  Signal,
  IndicatorParams,
  IndicatorConfig,
  IndicatorDefinition,
  IndicatorParamSchema,
  MAParams,
  ThemeConfig,
  PresetTheme,
  ThemeProp,
  ReactKlineChartProps,
  IndicatorProps,
} from './types';
