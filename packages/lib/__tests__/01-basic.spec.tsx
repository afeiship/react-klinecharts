/**
 * 基础渲染测试
 * 验证 ReactKlinecharts 组件的基本渲染行为，包括：
 * - 默认 className 是否正确应用
 * - 自定义 className 是否能正确合并
 * - children 内容是否正常渲染
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReactKlinecharts from '../src';

describe('ReactKlinecharts', () => {
  it('should render with default className', () => {
    render(<ReactKlinecharts>hello</ReactKlinecharts>);
    const el = screen.getByText('hello');
    expect(el).toBeInTheDocument();
    expect(el.closest('[data-component="react-klinecharts"]')).toBeInTheDocument();
  });

  it('should merge custom className', () => {
    const { container } = render(<ReactKlinecharts className="custom-class">test</ReactKlinecharts>);
    expect(container.firstChild).toHaveClass('react-klinecharts', 'custom-class');
  });

  it('should render children', () => {
    render(<ReactKlinecharts>child content</ReactKlinecharts>);
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});
