import type { IndicatorDefinition } from '../types';

/**
 * 指标注册中心（单例模式）
 */
class IndicatorRegistry {
  private indicators: Map<string, IndicatorDefinition> = new Map();

  /**
   * 注册指标
   */
  register(definition: IndicatorDefinition): void {
    if (this.indicators.has(definition.name)) {
      console.warn(`Indicator "${definition.name}" already registered, will be overwritten.`);
    }
    this.indicators.set(definition.name, definition);
  }

  /**
   * 获取指标定义
   */
  get(name: string): IndicatorDefinition | undefined {
    return this.indicators.get(name);
  }

  /**
   * 检查指标是否存在
   */
  has(name: string): boolean {
    return this.indicators.has(name);
  }

  /**
   * 获取所有已注册的指标名称
   */
  getAllNames(): string[] {
    return Array.from(this.indicators.keys());
  }

  /**
   * 清空注册表（仅供测试使用）
   */
  clear(): void {
    this.indicators.clear();
  }
}

// 单例实例
export const indicatorRegistry = new IndicatorRegistry();

/**
 * 注册指标的便捷方法
 */
export const registerIndicator = (definition: IndicatorDefinition) => {
  indicatorRegistry.register(definition);
};