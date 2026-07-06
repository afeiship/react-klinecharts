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

  beforeEach(async () => {
    vi.clearAllMocks();
    // 清空并重新注册内置指标（模拟实际使用场景）
    indicatorRegistry.clear();
    // 重新导入以注册指标
    await import('../../src/indicators');
  });

  it('should render chart with multiple indicators', () => {
    const { container } = render(
      <ReactKlineChart data={mockData} signals={mockSignals}>
        <Indicator type="VOL" />
        <Indicator type="MACD" />
        <Indicator type="KDJ" />
      </ReactKlineChart>
    );

    expect(container.querySelector('[data-component="react-kline-chart"]')).not.toBeNull();
  });

  it('should render chart with hidden indicator', () => {
    const { container } = render(
      <ReactKlineChart data={mockData}>
        <Indicator type="VOL" />
        <Indicator type="MACD" visible={false} />
      </ReactKlineChart>
    );

    expect(container.querySelector('[data-component="react-kline-chart"]')).not.toBeNull();
  });

  it('should work with MainChart preset', () => {
    const { container } = render(<MainChart data={mockData} theme="light" />);

    expect(container.querySelector('[data-component="react-kline-chart"]')).not.toBeNull();
  });

  it('should work with SimpleChart preset', () => {
    const { container } = render(<SimpleChart data={mockData} signals={mockSignals} />);

    expect(container.querySelector('[data-component="react-kline-chart"]')).not.toBeNull();
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

    expect(container.querySelector('[data-component="react-kline-chart"]')).not.toBeNull();
  });
});
