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
