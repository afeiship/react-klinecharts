import * as react from 'react';
import react__default from 'react';

/**
 * K线数据结构
 */
interface KLineData {
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
interface Signal {
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
interface IndicatorParams {
    [key: string]: number | boolean | string;
}
/**
 * 指标配置
 */
interface IndicatorConfig {
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
interface IndicatorParamSchema {
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
interface IndicatorDefinition {
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
interface MAParams {
    /** MA周期数组，如[5, 20, 60] */
    periods: number[];
    /** 各条线的颜色（可选） */
    colors?: string[];
}
/**
 * 主题配置
 */
interface ThemeConfig {
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
type PresetTheme = 'dark' | 'light' | 'red-green' | 'green-red';
/**
 * 完整主题配置（预设 + 自定义覆盖）
 */
type ThemeProp = PresetTheme | {
    /** 基于预设主题 */
    preset?: PresetTheme;
    /** 自定义颜色覆盖 */
    colors?: Partial<ThemeConfig>;
};
/**
 * ReactKlineChart 主组件 Props
 */
interface ReactKlineChartProps {
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
interface IndicatorProps {
    /** 指标类型 */
    type: string;
    /** 指标参数 */
    params?: IndicatorParams;
    /** 是否显示 */
    visible?: boolean;
}

/**
 * ReactKlineChart 主组件
 * 提供组合式 API，通过子组件 Indicator 声明式配置副图指标
 */
declare function ReactKlineChart({ data, signals, theme, maParams, height, className, style, children, }: ReactKlineChartProps): react__default.JSX.Element;
declare namespace ReactKlineChart {
    var displayName: string;
}

/**
 * Indicator 组件 - 用于声明式配置副图指标
 *
 * 注意：此组件不渲染任何内容，只是作为配置声明传递给父组件
 * 父组件 ReactKlineChart 会提取其 props 并处理
 */
declare function Indicator(_props: IndicatorProps): null;
declare namespace Indicator {
    var displayName: string;
}

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
declare function MainChart({ data, signals, theme, maParams, height, className, }: MainChartProps): react.JSX.Element;
declare namespace MainChart {
    var displayName: string;
}

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
declare function SimpleChart({ data, signals, theme, maParams, height, className, }: SimpleChartProps): react.JSX.Element;
declare namespace SimpleChart {
    var displayName: string;
}

/**
 * 指标注册中心（单例模式）
 */
declare class IndicatorRegistry {
    private indicators;
    /**
     * 注册指标
     */
    register(definition: IndicatorDefinition): void;
    /**
     * 获取指标定义
     */
    get(name: string): IndicatorDefinition | undefined;
    /**
     * 检查指标是否存在
     */
    has(name: string): boolean;
    /**
     * 获取所有已注册的指标名称
     */
    getAllNames(): string[];
    /**
     * 清空注册表（仅供测试使用）
     */
    clear(): void;
}
declare const indicatorRegistry: IndicatorRegistry;
/**
 * 注册指标的便捷方法
 */
declare const registerIndicator: (definition: IndicatorDefinition) => void;

export { Indicator, type IndicatorConfig, type IndicatorDefinition, type IndicatorParamSchema, type IndicatorParams, type IndicatorProps, type KLineData, type MAParams, MainChart, type PresetTheme, ReactKlineChart, type ReactKlineChartProps, type Signal, SimpleChart, type ThemeConfig, type ThemeProp, indicatorRegistry, registerIndicator };
