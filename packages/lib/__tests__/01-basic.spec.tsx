/**
 * 基础渲染测试
 * 验证 ReactKlineChart 组件的基本渲染行为，包括：
 * - 默认 className 是否正确应用
 * - 自定义 className 是否能正确合并
 * - 组件是否能正确渲染容器
 */
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactKlineChart } from '../src';

describe('ReactKlineChart', () => {
  const mockData = [
    { timestamp: 1000, open: 100, high: 110, low: 90, close: 105, volume: 1000 },
    { timestamp: 2000, open: 105, high: 115, low: 95, close: 110, volume: 1200 },
  ];

  it('should render with default className', () => {
    const { container } = render(<ReactKlineChart data={mockData} />);
    const chartElement = container.querySelector('[data-component="react-kline-chart"]');
    expect(chartElement).toBeInTheDocument();
    expect(chartElement).toHaveClass('react-kline-chart');
  });

  it('should merge custom className', () => {
    const { container } = render(<ReactKlineChart data={mockData} className="custom-class" />);
    const chartElement = container.querySelector('[data-component="react-kline-chart"]');
    expect(chartElement).toHaveClass('react-kline-chart', 'custom-class');
  });

  it('should apply custom height', () => {
    const { container } = render(<ReactKlineChart data={mockData} height={800} />);
    const chartElement = container.querySelector('[data-component="react-kline-chart"]');
    expect(chartElement).toHaveStyle({ height: '800px' });
  });
});
