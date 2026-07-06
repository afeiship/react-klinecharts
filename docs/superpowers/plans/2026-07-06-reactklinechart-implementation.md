# ReactKlineChart 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一个通用的 React K线图组件库，封装 klinecharts，提供组合式 API、内置指标、主题系统和预设组件。

**Architecture:** 采用组合式组件设计，主组件 `ReactKlineChart` 通过子组件 `Indicator` 声明式配置副图指标。核心模块包括 IndicatorRegistry（指标注册中心）、ChartManager（图表管理器）、ThemeManager（主题管理）。所有内置指标通过统一注册机制提供。

**Tech Stack:** React 18+, TypeScript, klinecharts v10.0.0-beta3, Vitest + React Testing Library

---

## 文件结构

**创建文件清单：**

```
packages/lib/src/
├── types/
│   └── index.ts                  # 所有类型定义
├── core/
│   ├── indicator-registry.ts     # 指标注册中心
│   ├── theme-manager.ts          # 主题管理
│   └── chart-manager.ts          # 图表管理器
├── indicators/
│   ├── index.ts                  # 内置指标导出和自动注册
│   ├── vol.ts                    # VOL成交量指标
│   ├── macd.ts                   # MACD指标
│   ├── kdj.ts                    # KDJ指标
│   ├── rsi.ts                    # RSI指标
│   └── cci.ts                    # CCI指标
├── components/
│   ├── indicator.tsx             # Indicator声明组件
│   ├── react-kline-chart.tsx     # 主组件
│   └── presets/
│       ├── main-chart.tsx        # 预设：只有主图
│       └── simple-chart.tsx      # 预设：主图+成交量+MACD
├── index.tsx                     # 主入口，导出所有API
└── main.tsx                      # 构建入口（已存在，需更新）
```

**测试文件：**

```
packages/lib/__tests__/
├── core/
│   ├── indicator-registry.test.ts
│   └── theme-manager.test.ts
├── components/
│   ├── indicator.test.tsx
│   └── react-kline-chart.test.tsx
└── integration/
    └── chart-with-indicators.test.tsx
```

---

## Task 1: 类型定义

**Files:**
- Create: `packages/lib/src/types/index.ts`
- Test: N/A (类型定义无需测试)

- [ ] **Step 1: 创建类型定义文件**

```typescript
// packages/lib/src/types/index.ts

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
```

- [ ] **Step 2: 验证类型定义**

运行: `cd packages/lib && npx tsc --noEmit src/types/index.ts`
预期: 无错误

- [ ] **Step 3: 提交**

```bash
git add packages/lib/src/types/index.ts
git commit -m "feat: add type definitions for ReactKlineChart

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: IndicatorRegistry 核心模块

**Files:**
- Create: `packages/lib/src/core/indicator-registry.ts`
- Test: Create: `packages/lib/__tests__/core/indicator-registry.test.ts`

- [ ] **Step 1: 编写 IndicatorRegistry 测试**

```typescript
// packages/lib/__tests__/core/indicator-registry.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { indicatorRegistry, registerIndicator } from '../../src/core/indicator-registry';

describe('IndicatorRegistry', () => {
  beforeEach(() => {
    // 清空注册表（为测试提供clear方法）
    indicatorRegistry.clear();
  });

  it('should register an indicator', () => {
    registerIndicator({
      name: 'TEST',
      displayName: 'Test Indicator',
      create: () => ({ name: 'TEST' }),
    });

    expect(indicatorRegistry.has('TEST')).toBe(true);
  });

  it('should get indicator definition', () => {
    registerIndicator({
      name: 'MACD',
      displayName: 'MACD Indicator',
      defaultParams: { fast: 12 },
      create: () => ({ name: 'MACD' }),
    });

    const def = indicatorRegistry.get('MACD');
    expect(def?.displayName).toBe('MACD Indicator');
    expect(def?.defaultParams).toEqual({ fast: 12 });
  });

  it('should return undefined for non-existent indicator', () => {
    const def = indicatorRegistry.get('NON_EXISTENT');
    expect(def).toBeUndefined();
  });

  it('should check if indicator exists', () => {
    registerIndicator({
      name: 'KDJ',
      displayName: 'KDJ',
      create: () => ({ name: 'KDJ' }),
    });

    expect(indicatorRegistry.has('KDJ')).toBe(true);
    expect(indicatorRegistry.has('NON_EXISTENT')).toBe(false);
  });

  it('should get all registered indicator names', () => {
    registerIndicator({ name: 'MACD', displayName: 'MACD', create: () => ({}) });
    registerIndicator({ name: 'KDJ', displayName: 'KDJ', create: () => ({}) });

    const names = indicatorRegistry.getAllNames();
    expect(names).toContain('MACD');
    expect(names).toContain('KDJ');
    expect(names.length).toBe(2);
  });

  it('should warn when overwriting existing indicator', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    registerIndicator({ name: 'MACD', displayName: 'MACD', create: () => ({}) });
    registerIndicator({ name: 'MACD', displayName: 'MACD New', create: () => ({}) });

    expect(warnSpy).toHaveBeenCalledWith(
      'Indicator "MACD" already registered, will be overwritten.'
    );

    warnSpy.mockRestore();
  });
});
```

- [ ] **Step 2: 运行测试验证失败**

运行: `cd packages/lib && yarn test:watch`
预期: 测试失败，因为 indicator-registry.ts 不存在

- [ ] **Step 3: 实现 IndicatorRegistry**

```typescript
// packages/lib/src/core/indicator-registry.ts

import type { IndicatorDefinition } from '../types';

/**
 * 指标注册中心（单例模式）
 */
class IndicatorRegistry {
  private indicators: Map<string, IndicatorDefinition> = new Map();

  /**
   * 注册指标
   */
  register(definition: IndicatorDefinition): void {
    if (this.indicators.has(definition.name)) {
      console.warn(`Indicator "${definition.name}" already registered, will be overwritten.`);
    }
    this.indicators.set(definition.name, definition);
  }

  /**
   * 获取指标定义
   */
  get(name: string): IndicatorDefinition | undefined {
    return this.indicators.get(name);
  }

  /**
   * 检查指标是否存在
   */
  has(name: string): boolean {
    return this.indicators.has(name);
  }

  /**
   * 获取所有已注册的指标名称
   */
  getAllNames(): string[] {
    return Array.from(this.indicators.keys());
  }

  /**
   * 清空注册表（仅供测试使用）
   */
  clear(): void {
    this.indicators.clear();
  }
}

// 单例实例
export const indicatorRegistry = new IndicatorRegistry();

/**
 * 注册指标的便捷方法
 */
export const registerIndicator = (definition: IndicatorDefinition) => {
  indicatorRegistry.register(definition);
};
```

- [ ] **Step 4: 运行测试验证通过**

运行: `cd packages/lib && yarn test __tests__/core/indicator-registry.test.ts`
预期: 所有测试通过

- [ ] **Step 5: 提交**

```bash
git add packages/lib/src/core/indicator-registry.ts packages/lib/__tests__/core/indicator-registry.test.ts
git commit -m "feat: implement IndicatorRegistry with tests

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: ThemeManager 核心模块

**Files:**
- Create: `packages/lib/src/core/theme-manager.ts`
- Test: Create: `packages/lib/__tests__/core/theme-manager.test.ts`

- [ ] **Step 1: 编写 ThemeManager 测试**

```typescript
// packages/lib/__tests__/core/theme-manager.test.ts

import { describe, it, expect } from 'vitest';
import { resolveTheme } from '../../src/core/theme-manager';

describe('ThemeManager', () => {
  it('should return dark theme by default', () => {
    const theme = resolveTheme();
    expect(theme.upColor).toBe('#ef4444');
    expect(theme.downColor).toBe('#22c55e');
    expect(theme.backgroundColor).toBe('#1f2937');
  });

  it('should resolve dark preset theme', () => {
    const theme = resolveTheme('dark');
    expect(theme.backgroundColor).toBe('#1f2937');
    expect(theme.grid?.show).toBe(false);
  });

  it('should resolve light preset theme', () => {
    const theme = resolveTheme('light');
    expect(theme.backgroundColor).toBe('#ffffff');
    expect(theme.grid?.show).toBe(true);
  });

  it('should resolve red-green preset theme', () => {
    const theme = resolveTheme('red-green');
    expect(theme.upColor).toBe('#ef4444');
    expect(theme.downColor).toBe('#22c55e');
  });

  it('should resolve green-red preset theme', () => {
    const theme = resolveTheme('green-red');
    expect(theme.upColor).toBe('#22c55e');
    expect(theme.downColor).toBe('#ef4444');
  });

  it('should merge custom colors with preset theme', () => {
    const theme = resolveTheme({
      preset: 'dark',
      colors: { upColor: '#custom' },
    });

    expect(theme.upColor).toBe('#custom');
    expect(theme.downColor).toBe('#22c55e'); // 保持预设值
    expect(theme.backgroundColor).toBe('#1f2937');
  });

  it('should use dark theme as base when no preset specified', () => {
    const theme = resolveTheme({
      colors: { backgroundColor: '#custom-bg' },
    });

    expect(theme.upColor).toBe('#ef4444'); // 来自dark预设
    expect(theme.backgroundColor).toBe('#custom-bg'); // 自定义覆盖
  });
});
```

- [ ] **Step 2: 运行测试验证失败**

运行: `cd packages/lib && yarn test __tests__/core/theme-manager.test.ts`
预期: 测试失败，因为 theme-manager.ts 不存在

- [ ] **Step 3: 实现 ThemeManager**

```typescript
// packages/lib/src/core/theme-manager.ts

import type { ThemeConfig, PresetTheme, ThemeProp } from '../types';

/**
 * 内置预设主题配置
 */
const PRESET_THEMES: Record<PresetTheme, ThemeConfig> = {
  dark: {
    upColor: '#ef4444',
    downColor: '#22c55e',
    noChangeColor: '#888888',
    backgroundColor: '#1f2937',
    grid: { show: false },
    textColor: '#ffffff',
  },
  light: {
    upColor: '#ef4444',
    downColor: '#22c55e',
    noChangeColor: '#888888',
    backgroundColor: '#ffffff',
    grid: { show: true, color: '#e5e7eb' },
    textColor: '#1f2937',
  },
  'red-green': {
    upColor: '#ef4444',
    downColor: '#22c55e',
    noChangeColor: '#888888',
    backgroundColor: '#1f2937',
    grid: { show: false },
  },
  'green-red': {
    upColor: '#22c55e',
    downColor: '#ef4444',
    noChangeColor: '#888888',
    backgroundColor: '#1f2937',
    grid: { show: false },
  },
};

/**
 * 解析主题配置
 * @param prop - 主题属性（预设名称或预设+自定义）
 * @returns 完整的主题配置对象
 */
export function resolveTheme(prop?: ThemeProp): ThemeConfig {
  // 默认使用 dark 主题
  if (!prop) {
    return PRESET_THEMES.dark;
  }

  // 字符串：直接使用预设主题
  if (typeof prop === 'string') {
    return PRESET_THEMES[prop];
  }

  // 对象：预设 + 自定义覆盖
  const base = prop.preset ? PRESET_THEMES[prop.preset] : PRESET_THEMES.dark;
  return {
    ...base,
    ...prop.colors,
  };
}
```

- [ ] **Step 4: 运行测试验证通过**

运行: `cd packages/lib && yarn test __tests__/core/theme-manager.test.ts`
预期: 所有测试通过

- [ ] **Step 5: 提交**

```bash
git add packages/lib/src/core/theme-manager.ts packages/lib/__tests__/core/theme-manager.test.ts
git commit -m "feat: implement ThemeManager with preset themes

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: 内置指标注册

**Files:**
- Create: `packages/lib/src/indicators/vol.ts`
- Create: `packages/lib/src/indicators/macd.ts`
- Create: `packages/lib/src/indicators/kdj.ts`
- Create: `packages/lib/src/indicators/rsi.ts`
- Create: `packages/lib/src/indicators/cci.ts`
- Create: `packages/lib/src/indicators/index.ts`

- [ ] **Step 1: 创建 VOL 指标**

```typescript
// packages/lib/src/indicators/vol.ts

import { registerIndicator } from '../core/indicator-registry';

registerIndicator({
  name: 'VOL',
  displayName: '成交量',
  defaultParams: {},
  paramsSchema: [],
  create: () => ({
    name: 'VOL',
  }),
});
```

- [ ] **Step 2: 创建 MACD 指标**

```typescript
// packages/lib/src/indicators/macd.ts

import { registerIndicator } from '../core/indicator-registry';

registerIndicator({
  name: 'MACD',
  displayName: 'MACD指标',
  defaultParams: { fast: 12, slow: 26, signal: 9 },
  paramsSchema: [
    { key: 'fast', label: '快线', type: 'number', defaultValue: 12, min: 1, max: 100 },
    { key: 'slow', label: '慢线', type: 'number', defaultValue: 26, min: 1, max: 100 },
    { key: 'signal', label: '信号线', type: 'number', defaultValue: 9, min: 1, max: 100 },
  ],
  create: (params) => ({
    name: 'MACD',
    calcParams: [params.fast as number, params.slow as number, params.signal as number],
  }),
});
```

- [ ] **Step 3: 创建 KDJ 指标**

```typescript
// packages/lib/src/indicators/kdj.ts

import { registerIndicator } from '../core/indicator-registry';

registerIndicator({
  name: 'KDJ',
  displayName: 'KDJ指标',
  defaultParams: { n: 9, m1: 3, m2: 3 },
  paramsSchema: [
    { key: 'n', label: 'N值', type: 'number', defaultValue: 9, min: 1, max: 100 },
    { key: 'm1', label: 'M1值', type: 'number', defaultValue: 3, min: 1, max: 100 },
    { key: 'm2', label: 'M2值', type: 'number', defaultValue: 3, min: 1, max: 100 },
  ],
  create: (params) => ({
    name: 'KDJ',
    calcParams: [params.n as number, params.m1 as number, params.m2 as number],
  }),
});
```

- [ ] **Step 4: 创建 RSI 指标**

```typescript
// packages/lib/src/indicators/rsi.ts

import { registerIndicator } from '../core/indicator-registry';

registerIndicator({
  name: 'RSI',
  displayName: 'RSI指标',
  defaultParams: { period: 14 },
  paramsSchema: [
    { key: 'period', label: '周期', type: 'number', defaultValue: 14, min: 1, max: 100 },
  ],
  create: (params) => ({
    name: 'RSI',
    calcParams: [params.period as number],
  }),
});
```

- [ ] **Step 5: 创建 CCI 指标**

```typescript
// packages/lib/src/indicators/cci.ts

import { registerIndicator } from '../core/indicator-registry';

registerIndicator({
  name: 'CCI',
  displayName: 'CCI指标',
  defaultParams: { period: 14 },
  paramsSchema: [
    { key: 'period', label: '周期', type: 'number', defaultValue: 14, min: 1, max: 100 },
  ],
  create: (params) => ({
    name: 'CCI',
    calcParams: [params.period as number],
  }),
});
```

- [ ] **Step 6: 创建指标导出文件（自动注册）**

```typescript
// packages/lib/src/indicators/index.ts

// 导出各个指标模块（导入即自动注册）
export { } from './vol';
export { } from './macd';
export { } from './kdj';
export { } from './rsi';
export { } from './cci';

// 自动注册所有内置指标
import './vol';
import './macd';
import './kdj';
import './rsi';
import './cci';
```

- [ ] **Step 7: 验证指标注册**

运行: `cd packages/lib && npx tsc --noEmit src/indicators/index.ts`
预期: 无错误

- [ ] **Step 8: 提交**

```bash
git add packages/lib/src/indicators/
git commit -m "feat: implement built-in indicators (VOL, MACD, KDJ, RSI, CCI)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: ChartManager 核心模块

**Files:**
- Create: `packages/lib/src/core/chart-manager.ts`
- Modify: `packages/lib/src/core/indicator-registry.ts` (添加clear方法已完成)
- Test: N/A (ChartManager 与 klinecharts 深度耦合，将在集成测试中验证)

- [ ] **Step 1: 实现 ChartManager**

```typescript
// packages/lib/src/core/chart-manager.ts

import { init, dispose, Chart } from 'klinecharts';
import { indicatorRegistry } from './indicator-registry';
import type { KLineData, Signal, ThemeConfig, IndicatorConfig, MAParams } from '../types';

/**
 * 图表管理器
 * 封装 klinecharts 的初始化、更新、销毁逻辑
 */
export class ChartManager {
  private chart: Chart | null = null;
  private container: HTMLDivElement | null = null;
  private indicatorPaneIds: Map<string, string> = new Map(); // 记录指标的paneId

  /**
   * 初始化图表
   */
  init(container: HTMLDivElement, theme: ThemeConfig): void {
    this.container = container;
    
    this.chart = init(container, {
      layout: {
        panes: [{ type: 'candle' }],
      },
      styles: this.buildStyles(theme),
    });
  }

  /**
   * 设置K线数据
   */
  setData(data: KLineData[]): void {
    if (!this.chart) return;
    
    const chartData = data.map(item => ({
      timestamp: item.timestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
      turnover: item.turnover,
    }));

    this.chart.setSymbol({ ticker: 'STOCK', pricePrecision: 2, volumePrecision: 0 });
    this.chart.setPeriod({ span: 1, type: 'day' });
    this.chart.setDataLoader({
      getBars: ({ callback }) => {
        callback(chartData, { forward: false, backward: false });
      },
    });
  }

  /**
   * 设置MA均线（主图）
   */
  setMA(params: MAParams): void {
    if (!this.chart) return;
    
    const defaultColors = ['#ffffff', '#ff6600', '#00ff00', '#ff00ff', '#ffff00'];
    
    this.chart.createIndicator(
      {
        name: 'MA',
        calcParams: params.periods,
        styles: {
          lines: params.periods.map((_, idx) => ({
            style: 'solid',
            color: params.colors?.[idx] || defaultColors[idx] || defaultColors[0],
            size: 2,
          })),
        },
      },
      { pane: { id: 'candle_pane' } }
    );
  }

  /**
   * 添加指标（副图）
   */
  addIndicator(config: IndicatorConfig): void {
    if (!this.chart || !config.visible) return;
    
    const definition = indicatorRegistry.get(config.type);
    if (!definition) {
      console.error(`Indicator "${config.type}" not found in registry`);
      return;
    }

    const params = { ...definition.defaultParams, ...config.params };
    const indicatorConfig = definition.create(params);
    
    const paneId = this.chart.createIndicator(indicatorConfig, false);
    if (paneId) {
      this.indicatorPaneIds.set(config.type, paneId);
    }
  }

  /**
   * 清除所有指标（副图）
   */
  clearIndicators(): void {
    if (!this.chart) return;
    
    // klinecharts v10: 通过 removeIndicator 移除
    this.indicatorPaneIds.forEach((paneId, name) => {
      this.chart!.removeIndicator({ name });
    });
    this.indicatorPaneIds.clear();
  }

  /**
   * 设置买卖信号点
   */
  setSignals(signals: Signal[]): void {
    if (!this.chart) return;
    
    signals.forEach(signal => {
      this.chart!.createOverlay({
        name: 'simpleAnnotation',
        points: [{ timestamp: signal.timestamp, value: signal.price }],
        styles: {
          text: {
            color: '#ffffff',
            backgroundColor: signal.type === 'buy' ? '#ef4444' : '#22c55e',
            borderRadius: 4,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 4,
            paddingBottom: 4,
          },
        },
        extendData: signal.text || (signal.type === 'buy' ? '买' : '卖'),
      });
    });
  }

  /**
   * 更新主题
   */
  updateTheme(theme: ThemeConfig): void {
    if (!this.chart) return;
    this.chart.setStyles(this.buildStyles(theme));
  }

  /**
   * 销毁图表
   */
  destroy(): void {
    if (this.container) {
      dispose(this.container);
      this.chart = null;
      this.container = null;
      this.indicatorPaneIds.clear();
    }
  }

  /**
   * 构建样式配置
   */
  private buildStyles(theme: ThemeConfig): any {
    return {
      grid: theme.grid || { show: false },
      candle: {
        type: 'candle_solid',
        priceMark: {
          last: {
            show: true,
            upColor: theme.upColor,
            downColor: theme.downColor,
          },
        },
        bar: {
          upColor: theme.upColor,
          downColor: theme.downColor,
          upBorderColor: theme.upColor,
          downBorderColor: theme.downColor,
          upWickColor: theme.upColor,
          downWickColor: theme.downColor,
          noChangeColor: theme.noChangeColor,
          noChangeBorderColor: theme.noChangeColor,
          noChangeWickColor: theme.noChangeColor,
        },
      },
      indicator: {
        ohlc: {
          upColor: theme.upColor,
          downColor: theme.downColor,
          noChangeColor: theme.noChangeColor,
        },
        bars: [{
          upColor: theme.upColor,
          downColor: theme.downColor,
          noChangeColor: theme.noChangeColor,
        }],
      },
    };
  }
}
```

- [ ] **Step 2: 验证类型**

运行: `cd packages/lib && npx tsc --noEmit src/core/chart-manager.ts`
预期: 无错误

- [ ] **Step 3: 提交**

```bash
git add packages/lib/src/core/chart-manager.ts
git commit -m "feat: implement ChartManager to wrap klinecharts

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 6: Indicator 组件

**Files:**
- Create: `packages/lib/src/components/indicator.tsx`
- Test: Create: `packages/lib/__tests__/components/indicator.test.tsx`

- [ ] **Step 1: 编写 Indicator 组件测试**

```typescript
// packages/lib/__tests__/components/indicator.test.tsx

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Indicator } from '../../src/components/indicator';

describe('Indicator', () => {
  it('should render nothing', () => {
    const { container } = render(<Indicator type="MACD" />);
    expect(container.firstChild).toBeNull();
  });

  it('should accept type prop', () => {
    const { container } = render(<Indicator type="VOL" />);
    expect(container.firstChild).toBeNull();
  });

  it('should accept params prop', () => {
    const { container } = render(
      <Indicator type="MACD" params={{ fast: 12, slow: 26 }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should accept visible prop', () => {
    const { container } = render(<Indicator type="KDJ" visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('should have displayName for debugging', () => {
    expect(Indicator.displayName).toBe('Indicator');
  });
});
```

- [ ] **Step 2: 运行测试验证失败**

运行: `cd packages/lib && yarn test __tests__/components/indicator.test.tsx`
预期: 测试失败，因为 indicator.tsx 不存在

- [ ] **Step 3: 实现 Indicator 组件**

```typescript
// packages/lib/src/components/indicator.tsx

import type { IndicatorProps } from '../types';

/**
 * Indicator 组件 - 用于声明式配置副图指标
 * 
 * 注意：此组件不渲染任何内容，只是作为配置声明传递给父组件
 * 父组件 ReactKlineChart 会提取其 props 并处理
 */
export function Indicator({ type, params, visible = true }: IndicatorProps) {
  // 不渲染任何内容，返回 null
  return null;
}

// 设置displayName便于调试
Indicator.displayName = 'Indicator';
```

- [ ] **Step 4: 运行测试验证通过**

运行: `cd packages/lib && yarn test __tests__/components/indicator.test.tsx`
预期: 所有测试通过

- [ ] **Step 5: 提交**

```bash
git add packages/lib/src/components/indicator.tsx packages/lib/__tests__/components/indicator.test.tsx
git commit -m "feat: implement Indicator component with tests

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 7: ReactKlineChart 主组件

**Files:**
- Create: `packages/lib/src/components/react-kline-chart.tsx`
- Test: Create: `packages/lib/__tests__/components/react-kline-chart.test.tsx`

- [ ] **Step 1: 编写 ReactKlineChart 组件测试**

```typescript
// packages/lib/__tests__/components/react-kline-chart.test.tsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ReactKlineChart } from '../../src/components/react-kline-chart';
import { Indicator } from '../../src/components/indicator';

// Mock klinecharts
vi.mock('klinecharts', () => ({
  init: vi.fn(() => ({
    setSymbol: vi.fn(),
    setPeriod: vi.fn(),
    setDataLoader: vi.fn(),
    createIndicator: vi.fn(),
    removeIndicator: vi.fn(),
    setStyles: vi.fn(),
    createOverlay: vi.fn(),
  })),
  dispose: vi.fn(),
}));

describe('ReactKlineChart', () => {
  const mockData = [
    { timestamp: 1625097600000, open: 100, high: 105, low: 98, close: 103, volume: 1000000 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render container with correct attributes', () => {
    const { container } = render(<ReactKlineChart data={mockData} />);
    
    const chartContainer = container.querySelector('[data-component="react-kline-chart"]');
    expect(chartContainer).toBeInTheDocument();
  });

  it('should apply custom height', () => {
    const { container } = render(<ReactKlineChart data={mockData} height={800} />);
    
    const chartContainer = container.querySelector('[data-component="react-kline-chart"]');
    expect(chartContainer).toHaveStyle({ height: 800 });
  });

  it('should apply custom className', () => {
    const { container } = render(<ReactKlineChart data={mockData} className="my-chart" />);
    
    const chartContainer = container.querySelector('.my-chart');
    expect(chartContainer).toBeInTheDocument();
  });

  it('should apply dark theme by default', () => {
    const { container } = render(<ReactKlineChart data={mockData} />);
    
    const chartContainer = container.querySelector('[data-component="react-kline-chart"]');
    expect(chartContainer).toHaveStyle({ backgroundColor: '#1f2937' });
  });

  it('should apply custom theme', () => {
    const { container } = render(<ReactKlineChart data={mockData} theme="light" />);
    
    const chartContainer = container.querySelector('[data-component="react-kline-chart"]');
    expect(chartContainer).toHaveStyle({ backgroundColor: '#ffffff' });
  });

  it('should apply custom style', () => {
    const { container } = render(
      <ReactKlineChart data={mockData} style={{ border: '1px solid red' }} />
    );
    
    const chartContainer = container.querySelector('[data-component="react-kline-chart"]');
    expect(chartContainer).toHaveStyle({ border: '1px solid red' });
  });

  it('should extract Indicator children configs', () => {
    const { container } = render(
      <ReactKlineChart data={mockData}>
        <Indicator type="VOL" />
        <Indicator type="MACD" params={{ fast: 12 }} />
      </ReactKlineChart>
    );

    // 验证容器渲染（实际指标添加在ChartManager中）
    expect(container.querySelector('[data-component="react-kline-chart"]')).toBeInTheDocument();
  });

  it('should have displayName for debugging', () => {
    expect(ReactKlineChart.displayName).toBe('ReactKlineChart');
  });
});
```

- [ ] **Step 2: 运行测试验证失败**

运行: `cd packages/lib && yarn test __tests__/components/react-kline-chart.test.tsx`
预期: 测试失败，因为 react-kline-chart.tsx 不存在

- [ ] **Step 3: 实现 ReactKlineChart 组件**

```typescript
// packages/lib/src/components/react-kline-chart.tsx

import React, { useRef, useEffect, useMemo } from 'react';
import { ChartManager } from '../core/chart-manager';
import { resolveTheme } from '../core/theme-manager';
import { Indicator } from './indicator';
import type { ReactKlineChartProps, IndicatorConfig, IndicatorProps } from '../types';

// 默认 MA 参数
const DEFAULT_MA_PARAMS = { periods: [5, 20] };

/**
 * ReactKlineChart 主组件
 * 提供组合式 API，通过子组件 Indicator 声明式配置副图指标
 */
export function ReactKlineChart({
  data,
  signals = [],
  theme,
  maParams = DEFAULT_MA_PARAMS,
  height = 600,
  className,
  style,
  children,
}: ReactKlineChartProps) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager | null>(null);
  
  // 解析主题配置
  const resolvedTheme = useMemo(() => resolveTheme(theme), [theme]);
  
  // 提取子组件Indicator配置
  const indicatorConfigs = useMemo(() => {
    const configs: IndicatorConfig[] = [];
    
    // 遍历children，提取Indicator组件的props
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === Indicator) {
        const { type, params, visible = true } = child.props as IndicatorProps;
        configs.push({ type, params, visible });
      }
    });
    
    return configs;
  }, [children]);

  // 初始化图表
  useEffect(() => {
    if (!containerRef.current) return;

    const manager = new ChartManager();
    manager.init(containerRef.current, resolvedTheme);
    chartManagerRef.current = manager;

    return () => {
      manager.destroy();
      chartManagerRef.current = null;
    };
  }, []);

  // 设置数据
  useEffect(() => {
    if (!chartManagerRef.current) return;
    chartManagerRef.current.setData(data);
  }, [data]);

  // 设置MA均线
  useEffect(() => {
    if (!chartManagerRef.current) return;
    chartManagerRef.current.setMA(maParams);
  }, [maParams]);

  // 设置信号点
  useEffect(() => {
    if (!chartManagerRef.current) return;
    chartManagerRef.current.setSignals(signals);
  }, [signals]);

  // 设置指标（副图）
  useEffect(() => {
    if (!chartManagerRef.current) return;
    
    // 清除现有指标，重新添加
    chartManagerRef.current.clearIndicators();
    
    indicatorConfigs
      .filter(config => config.visible)
      .forEach(config => {
        chartManagerRef.current!.addIndicator(config);
      });
  }, [indicatorConfigs]);

  // 更新主题
  useEffect(() => {
    if (!chartManagerRef.current) return;
    chartManagerRef.current.updateTheme(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <div
      ref={containerRef}
      data-component="react-kline-chart"
      className={className}
      style={{
        height,
        backgroundColor: resolvedTheme.backgroundColor,
        ...style,
      }}
    />
  );
}

// 设置displayName便于调试
ReactKlineChart.displayName = 'ReactKlineChart';
```

- [ ] **Step 4: 运行测试验证通过**

运行: `cd packages/lib && yarn test __tests__/components/react-kline-chart.test.tsx`
预期: 所有测试通过

- [ ] **Step 5: 提交**

```bash
git add packages/lib/src/components/react-kline-chart.tsx packages/lib/__tests__/components/react-kline-chart.test.tsx
git commit -m "feat: implement ReactKlineChart main component with tests

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 8: 预设组件

**Files:**
- Create: `packages/lib/src/components/presets/main-chart.tsx`
- Create: `packages/lib/src/components/presets/simple-chart.tsx`

- [ ] **Step 1: 创建 MainChart 预设组件**

```typescript
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
```

- [ ] **Step 2: 创建 SimpleChart 预设组件**

```typescript
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
```

- [ ] **Step 3: 验证类型**

运行: `cd packages/lib && npx tsc --noEmit src/components/presets/main-chart.tsx src/components/presets/simple-chart.tsx`
预期: 无错误

- [ ] **Step 4: 提交**

```bash
git add packages/lib/src/components/presets/
git commit -m "feat: implement preset components (MainChart, SimpleChart)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 9: 主入口文件

**Files:**
- Modify: `packages/lib/src/index.tsx` (当前是 ReactKlinecharts 组件，需替换为新实现)
- Modify: `packages/lib/src/main.tsx` (构建入口，需更新导出)

- [ ] **Step 1: 更新 index.tsx（主入口）**

```typescript
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
```

- [ ] **Step 2: 更新 main.tsx（构建入口）**

```typescript
// packages/lib/src/main.tsx

// 导出主组件和所有相关模块
export * from './index';
// 确保内置指标自动注册
import './indicators';
```

- [ ] **Step 3: 验证类型**

运行: `cd packages/lib && npx tsc --noEmit src/index.tsx src/main.tsx`
预期: 无错误

- [ ] **Step 4: 提交**

```bash
git add packages/lib/src/index.tsx packages/lib/src/main.tsx
git commit -m "feat: update entry files to export all ReactKlineChart APIs

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 10: 集成测试

**Files:**
- Create: `packages/lib/__tests__/integration/chart-with-indicators.test.tsx`

- [ ] **Step 1: 编写集成测试**

```typescript
// packages/lib/__tests__/integration/chart-with-indicators.test.tsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ReactKlineChart, Indicator, MainChart, SimpleChart, registerIndicator } from '../../src';
import { indicatorRegistry } from '../../src/core/indicator-registry';

// Mock klinecharts
vi.mock('klinecharts', () => ({
  init: vi.fn(() => ({
    setSymbol: vi.fn(),
    setPeriod: vi.fn(),
    setDataLoader: vi.fn(),
    createIndicator: vi.fn(() => 'pane-id'),
    removeIndicator: vi.fn(),
    setStyles: vi.fn(),
    createOverlay: vi.fn(),
  })),
  dispose: vi.fn(),
}));

describe('Chart with Indicators Integration', () => {
  const mockData = [
    { timestamp: 1625097600000, open: 100, high: 105, low: 98, close: 103, volume: 1000000 },
    { timestamp: 1625184000000, open: 103, high: 108, low: 102, close: 107, volume: 1200000 },
  ];

  const mockSignals = [
    { type: 'buy' as const, timestamp: 1625097600000, price: 100 },
    { type: 'sell' as const, timestamp: 1625184000000, price: 107 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // 清空并重新注册内置指标（模拟实际使用场景）
    indicatorRegistry.clear();
    import('../../src/indicators');
  });

  it('should render chart with multiple indicators', () => {
    const { container } = render(
      <ReactKlineChart data={mockData} signals={mockSignals}>
        <Indicator type="VOL" />
        <Indicator type="MACD" />
        <Indicator type="KDJ" />
      </ReactKlineChart>
    );

    expect(container.querySelector('[data-component="react-kline-chart"]')).toBeInTheDocument();
  });

  it('should render chart with hidden indicator', () => {
    const { container } = render(
      <ReactKlineChart data={mockData}>
        <Indicator type="VOL" />
        <Indicator type="MACD" visible={false} />
      </ReactKlineChart>
    );

    expect(container.querySelector('[data-component="react-kline-chart"]')).toBeInTheDocument();
  });

  it('should work with MainChart preset', () => {
    const { container } = render(<MainChart data={mockData} theme="light" />);
    
    expect(container.querySelector('[data-component="react-kline-chart"]')).toBeInTheDocument();
  });

  it('should work with SimpleChart preset', () => {
    const { container } = render(<SimpleChart data={mockData} signals={mockSignals} />);
    
    expect(container.querySelector('[data-component="react-kline-chart"]')).toBeInTheDocument();
  });

  it('should support custom indicator registration', () => {
    registerIndicator({
      name: 'CUSTOM',
      displayName: 'Custom Indicator',
      defaultParams: { period: 10 },
      create: (params) => ({
        name: 'CUSTOM',
        calcParams: [params.period as number],
      }),
    });

    expect(indicatorRegistry.has('CUSTOM')).toBe(true);

    const { container } = render(
      <ReactKlineChart data={mockData}>
        <Indicator type="CUSTOM" params={{ period: 20 }} />
      </ReactKlineChart>
    );

    expect(container.querySelector('[data-component="react-kline-chart"]')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行集成测试验证通过**

运行: `cd packages/lib && yarn test __tests__/integration/chart-with-indicators.test.tsx`
预期: 所有测试通过

- [ ] **Step 3: 提交**

```bash
git add packages/lib/__tests__/integration/chart-with-indicators.test.tsx
git commit -m "feat: add integration tests for chart with indicators

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 11: 构建验证

**Files:**
- Modify: N/A

- [ ] **Step 1: 运行库构建**

运行: `cd packages/lib && yarn build`
预期: 构建成功，生成 dist/main.cjs.js、dist/main.esm.js、dist/main.d.ts

- [ ] **Step 2: 验证导出**

运行: `cd packages/lib && cat dist/main.d.ts | head -50`
预期: 类型定义文件包含所有导出的类型和组件

- [ ] **Step 3: 运行所有测试**

运行: `cd packages/lib && yarn test`
预期: 所有测试通过

- [ ] **Step 4: 提交构建产物**

```bash
git add packages/lib/dist/
git commit -m "chore: build ReactKlineChart library

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 12: 更新示例应用

**Files:**
- Modify: `packages/example/src/app.tsx`

- [ ] **Step 1: 更新示例应用使用新组件**

```typescript
// packages/example/src/app.tsx

import { SimpleChart, registerIndicator, type KLineData, type Signal } from '@jswork/react-klinecharts/src/main';
import '@jswork/react-klinecharts/src/style.scss';

// 模拟K线数据
const mockData: KLineData[] = [
  { timestamp: 1625097600000, open: 100, high: 105, low: 98, close: 103, volume: 1000000 },
  { timestamp: 1625184000000, open: 103, high: 108, low: 102, close: 107, volume: 1200000 },
  { timestamp: 1625270400000, open: 107, high: 110, low: 105, close: 108, volume: 1100000 },
];

// 模拟买卖信号
const mockSignals: Signal[] = [
  { type: 'buy', timestamp: 1625097600000, price: 100, text: '买入' },
  { type: 'sell', timestamp: 1625184000000, price: 107, text: '卖出' },
];

function App() {
  return (
    <div className="m-10 p-4 shadow bg-gray-100 text-gray-800 hover:shadow-md transition-all">
      <div className="badge badge-warning absolute right-0 top-0 m-4">
        Build Time: {BUILD_TIME}
      </div>
      <h1 className="text-2xl font-bold mb-4">ReactKlineChart 示例</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">SimpleChart 预设组件</h2>
        <SimpleChart 
          data={mockData} 
          signals={mockSignals}
          theme="dark"
          height={500}
        />
      </div>
    </div>
  );
}

export default App;
```

- [ ] **Step 2: 运行开发服务器验证**

运行: `yarn dev`
预期: 浏览器打开，显示 K线图

- [ ] **Step 3: 提交示例更新**

```bash
git add packages/example/src/app.tsx
git commit -m "feat: update example app to use ReactKlineChart

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 完成检查清单

完成所有任务后，验证以下内容：

- [ ] 所有测试通过（`cd packages/lib && yarn test`）
- [ ] 构建成功（`cd packages/lib && yarn build`）
- [ ] 类型定义正确导出（`dist/main.d.ts` 包含所有类型）
- [ ] 示例应用正常运行（`yarn dev`）
- [ ] Git 历史清晰，每个任务有独立提交
- [ ] 无 TypeScript 错误（`npx tsc --noEmit`）

---

## 执行提示

**注意事项：**

1. **文件命名**: 使用 kebab-case（如 `react-kline-chart.tsx`）
2. **测试先行**: 每个模块先写测试，再实现
3. **频繁提交**: 每个任务完成后立即提交
4. **Mock klinecharts**: 组件测试需要 mock klinecharts 库
5. **清理注册表**: 测试前清空 IndicatorRegistry 避免污染
6. **参考实现**: 查看 `/Users/afei/github/aric-notes/klinecharts-notes` 的 StockChart.tsx 作为参考