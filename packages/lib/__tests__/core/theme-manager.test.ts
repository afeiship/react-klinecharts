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
