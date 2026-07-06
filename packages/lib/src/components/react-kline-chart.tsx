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
