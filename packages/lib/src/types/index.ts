/**
 * K线数据结构
 */
export interface KLineData {
  /** 时间戳(毫秒) */
  timestamp: number;
  /** 开盘价 */
  open: number;
  /** 收盘价 */
  close: number;
  /** 最高价 */
  high: number;
  /** 最低价 */
  low: number;
  /** 成交量 */
  volume: number;
  /** 成交额（可选） */
  turnover?: number;
}

/**
 * 买卖信号点
 */
export interface Signal {
  /** 信号类型 */
  type: 'buy' | 'sell';
  /** 时间戳(毫秒) */
  timestamp: number;
  /** 价格 */
  price: number;
  /** 信号文本（可选，默认为"买"/"卖"） */
  text?: string;
}

/**
 * 指标参数（通用）
 */
export interface IndicatorParams {
  [key: string]: number | boolean | string;
}

/**
 * 指标配置
 */
export interface IndicatorConfig {
  /** 指标类型名称 */
  type: string;
  /** 指标参数 */
  params?: IndicatorParams;
  /** 是否显示 */
  visible?: boolean;
}

/**
 * 指标参数模式定义
 */
export interface IndicatorParamSchema {
  /** 参数名 */
  key: string;
  /** 显示名称 */
  label: string;
  /** 参数类型 */
  type: 'number' | 'boolean' | 'string';
  /** 默认值 */
  defaultValue: number | boolean | string;
  /** 最小值（number类型） */
  min?: number;
  /** 最大值（number类型） */
  max?: number;
}

/**
 * 指标定义（用于注册）
 */
export interface IndicatorDefinition {
  /** 指标名称 */
  name: string;
  /** 指标显示名称 */
  displayName: string;
  /** 默认参数 */
  defaultParams?: IndicatorParams;
  /** 参数说明 */
  paramsSchema?: IndicatorParamSchema[];
  /** klinecharts 指标创建函数 */
  create: (params: IndicatorParams) => any;
}

/**
 * MA均线参数
 */
export interface MAParams {
  /** MA周期数组，如[5, 20, 60] */
  periods: number[];
  /** 各条线的颜色（可选） */
  colors?: string[];
}

/**
 * 主题配置
 */
export interface ThemeConfig {
  /** 涨颜色 */
  upColor: string;
  /** 跌颜色 */
  downColor: string;
  /** 无变化颜色 */
  noChangeColor: string;
  /** 背景色 */
  backgroundColor: string;
  /** 网格配置 */
  grid?: {
    show: boolean;
    color?: string;
  };
  /** 文字颜色 */
  textColor?: string;
}

/**
 * 预设主题名称
 */
export type PresetTheme = 'dark' | 'light' | 'red-green' | 'green-red';

/**
 * 完整主题配置（预设 + 自定义覆盖）
 */
export type ThemeProp = PresetTheme | {
  /** 基于预设主题 */
  preset?: PresetTheme;
  /** 自定义颜色覆盖 */
  colors?: Partial<ThemeConfig>;
};

/**
 * ReactKlineChart 主组件 Props
 */
export interface ReactKlineChartProps {
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
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 子元素（Indicator组件） */
  children?: React.ReactNode;
}

/**
 * Indicator 子组件 Props
 */
export interface IndicatorProps {
  /** 指标类型 */
  type: string;
  /** 指标参数 */
  params?: IndicatorParams;
  /** 是否显示 */
  visible?: boolean;
}
