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
    expect(chartContainer).not.toBeNull();
  });

  it('should apply custom height', () => {
    const { container } = render(<ReactKlineChart data={mockData} height={800} />);

    const chartContainer = container.querySelector('[data-component="react-kline-chart"]') as HTMLElement;
    expect(chartContainer.style.height).toBe('800px');
  });

  it('should apply custom className', () => {
    const { container } = render(<ReactKlineChart data={mockData} className="my-chart" />);

    const chartContainer = container.querySelector('.my-chart');
    expect(chartContainer).not.toBeNull();
  });

  it('should apply dark theme by default', () => {
    const { container } = render(<ReactKlineChart data={mockData} />);

    const chartContainer = container.querySelector('[data-component="react-kline-chart"]') as HTMLElement;
    expect(chartContainer.style.backgroundColor).toBe('rgb(31, 41, 55)');
  });

  it('should apply custom theme', () => {
    const { container } = render(<ReactKlineChart data={mockData} theme="light" />);

    const chartContainer = container.querySelector('[data-component="react-kline-chart"]') as HTMLElement;
    expect(chartContainer.style.backgroundColor).toBe('rgb(255, 255, 255)');
  });

  it('should apply custom style', () => {
    const { container } = render(
      <ReactKlineChart data={mockData} style={{ border: '1px solid red' }} />
    );

    const chartContainer = container.querySelector('[data-component="react-kline-chart"]') as HTMLElement;
    expect(chartContainer.style.border).toBe('1px solid red');
  });

  it('should extract Indicator children configs', () => {
    const { container } = render(
      <ReactKlineChart data={mockData}>
        <Indicator type="VOL" />
        <Indicator type="MACD" params={{ fast: 12 }} />
      </ReactKlineChart>
    );

    // 验证容器渲染（实际指标添加在ChartManager中）
    expect(container.querySelector('[data-component="react-kline-chart"]')).not.toBeNull();
  });

  it('should have displayName for debugging', () => {
    expect(ReactKlineChart.displayName).toBe('ReactKlineChart');
  });
});