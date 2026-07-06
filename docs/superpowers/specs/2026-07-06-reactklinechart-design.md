# ReactKlineChart 组件设计文档

**日期**: 2026-07-06
**状态**: 设计完成，待实现

---

## 1. 概述

### 1.1 目标

将 klinecharts 封装为一个通用的 React 组件库 `ReactKlineChart`，提供：

- 纯展示组件，所有数据通过 props 传入
- 组合式 API，通过子组件声明式配置
- 内置 5 个常用指标（VOL、MACD、KDJ、RSI、CCI），支持自定义扩展
- 预设主题 + 自定义颜色覆盖
- 预设便捷组件供快速使用

### 1.2 核心特性

- ✅ 蜡烛图 + MA均线
- ✅ 副图支持常用指标：MACD、KDJ、RSI、CCI、成交量
- ✅ 每个指标可配置参数、显示隐藏
- ✅ 配色：涨为红色/跌为绿色（可配置）
- ✅ 主图支持买/卖点标记（纯展示，无交互）
- ✅ 副图支持排序（通过子组件声明顺序）
- ✅ 可扩展：支持注册自定义指标

---

## 2. 架构设计

### 2.1 组件层次结构

```
ReactKlineChart (主组件)
├── ChartContainer (内部容器组件)
│   ├── CandlePane (主图：蜡烛图 + MA均线 + 买卖点)
│   └── IndicatorPanes (副图区域)
│       ├── VOLPane
│       ├── MACDPane
│       ├── KDJPane
│       ├── RSIPane
│       ├── CCIPane
│       └── CustomPane...
├── Indicator (声明式子组件，用于配置)
└── ThemeProvider (主题上下文)
```

### 2.2 文件结构

```
packages/lib/src/
├── index.tsx                    # 主入口，导出所有公开API
├── components/
│   ├── react-kline-chart.tsx    # 主组件
│   ├── indicator.tsx            # 指标声明组件
│   └── presets/                 # 预设便捷组件
│       ├── main-chart.tsx       # 只有主图
│       └── simple-chart.tsx     # 主图+成交量+MACD
├── core/
│   ├── chart-manager.ts         # 图表管理器（封装klinecharts）
│   ├── indicator-registry.ts    # 指标注册中心
│   └── theme-manager.ts         # 主题管理
├── indicators/                  # 内置指标实现
│   ├── index.ts
│   ├── vol.ts
│   ├── macd.ts
│   ├── kdj.ts
│   ├── rsi.ts
│   └── cci.ts
├── themes/                      # 内置主题
│   ├── index.ts
│   ├── dark.ts
│   └── light.ts
├── types/                       # TypeScript类型定义
│   └── index.ts
└── utils/
    └── helpers.ts
```

### 2.3 核心模块

**IndicatorRegistry（指标注册中心）**
- 单例模式，管理所有可用指标
- 内置指标在模块加载时自动注册
- 提供 `registerIndicator()` 方法供用户注册自定义指标
- 提供 `getIndicator()` 方法获取指标配置

**ChartManager（图表管理器）**
- 封装 klinecharts 的初始化、更新、销毁逻辑
- 管理主图和副图的生命周期
- 处理数据更新、指标添加/移除、主题切换

**ThemeManager（主题管理）**
- 提供 4 个预设主题：dark、light、red-green、green-red
- 支持预设主题 + 自定义颜色覆盖

---

## 3. 类型定义

### 3.1 数据类型

```typescript
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
  /** 显示顺序（可选，默认按声明顺序） */
  order?: number;
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
```

### 3.2 组件 Props 类型

```typescript
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
```

---

## 4. 核心 API

### 4.1 主组件

```tsx
<ReactKlineChart 
  data={klineData}
  signals={signals}
  theme="dark"
  maParams={{ periods: [5, 20], colors: ['#fff', '#ff6600'] }}
  height={600}
  className="my-chart"
>
  {/* 副图按声明顺序排列 */}
  <Indicator type="VOL" />
  <Indicator type="MACD" params={{ fast: 12, slow: 26, signal: 9 }} />
  <Indicator type="KDJ" visible={false} />
</ReactKlineChart>
```

### 4.2 Indicator 子组件

```tsx
<Indicator type="MACD" params={{ fast: 12, slow: 26, signal: 9 }} visible={true} />
```

- `type`: 指标类型名称（内置或自定义注册的）
- `params`: 指标参数（可选，使用默认值）
- `visible`: 是否显示（默认 true）

### 4.3 预设便捷组件

```tsx
// 只有主图
<MainChart data={klineData} theme="light" />

// 主图 + 成交量 + MACD
<SimpleChart data={klineData} signals={signals} />
```

### 4.4 注册自定义指标

```tsx
import { registerIndicator } from '@jswork/react-klinecharts';

registerIndicator({
  name: 'BOLL',
  displayName: '布林带',
  defaultParams: { period: 20, stdDev: 2 },
  paramsSchema: [
    { key: 'period', label: '周期', type: 'number', defaultValue: 20, min: 1, max: 100 },
    { key: 'stdDev', label: '标准差', type: 'number', defaultValue: 2, min: 1, max: 10 },
  ],
  create: (params) => ({
    name: 'BOLL',
    calcParams: [params.period as number, params.stdDev as number],
  }),
});
```

---

## 5. 内置指标

| 指标 | 名称 | 默认参数 |
|------|------|----------|
| VOL | 成交量 | 无 |
| MACD | MACD指标 | `{ fast: 12, slow: 26, signal: 9 }` |
| KDJ | KDJ指标 | `{ n: 9, m1: 3, m2: 3 }` |
| RSI | RSI指标 | `{ period: 14 }` |
| CCI | CCI指标 | `{ period: 14 }` |

---

## 6. 内置主题

| 主题 | 涨颜色 | 跌颜色 | 背景 |
|------|--------|--------|------|
| dark | #ef4444 (红) | #22c55e (绿) | #1f2937 |
| light | #ef4444 (红) | #22c55e (绿) | #ffffff |
| red-green | #ef4444 (红) | #22c55e (绿) | #1f2937 |
| green-red | #22c55e (绿) | #ef4444 (红) | #1f2937 |

---

## 7. 导出 API

```typescript
// 主组件
export { ReactKlineChart } from './components/react-kline-chart';
export { Indicator } from './components/indicator';

// 预设组件
export { MainChart } from './components/presets/main-chart';
export { SimpleChart } from './components/presets/simple-chart';

// 注册方法
export { registerIndicator, indicatorRegistry } from './core/indicator-registry';

// 类型定义
export type {
  KLineData,
  Signal,
  IndicatorParams,
  IndicatorConfig,
  IndicatorDefinition,
  MAParams,
  ThemeConfig,
  PresetTheme,
  ThemeProp,
} from './types';
```

---

## 8. 测试策略

### 8.1 单元测试

- **IndicatorRegistry**: 注册、获取、覆盖警告
- **ThemeManager**: 预设主题解析、自定义覆盖

### 8.2 组件测试

- **Indicator**: 确认返回 null
- **ReactKlineChart**: 容器渲染、样式应用、主题应用

### 8.3 集成测试

- 多指标组合渲染
- 预设组件工作正常
- 自定义指标注册和使用

---

## 9. 实现注意事项

1. **klinecharts 版本**: 使用 v10.0.0-beta3
2. **组件命名**: 文件名使用 kebab-case（如 `react-kline-chart.tsx`）
3. **性能优化**: 使用 `useMemo` 缓存主题解析和子组件配置提取
4. **清理逻辑**: 组件卸载时必须调用 `dispose()` 清理图表实例
5. **类型安全**: 所有公开 API 都需要完整的 TypeScript 类型定义

---

## 10. 参考实现

参考项目: `/Users/afei/github/aric-notes/klinecharts-notes`

参考项目已实现：
- StockChart 组件
- IndicatorSettings 配置面板
- useIndicatorParams hook
- 类型定义

本设计在此基础上进行抽象和重构，形成通用组件库。
