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
