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
