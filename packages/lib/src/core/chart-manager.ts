import { init, dispose, Chart } from 'klinecharts';
import { indicatorRegistry } from './indicator-registry';
import type { KLineData, Signal, ThemeConfig, IndicatorConfig, MAParams } from '../types';

/**
 * 图表管理器
 * 封装 klinecharts 的初始化、更新、销毁逻辑
 */
export class ChartManager {
  private chart: Chart | null = null;
  private container: HTMLDivElement | null = null;
  private indicatorPaneIds: Map<string, string> = new Map(); // 记录指标的paneId

  /**
   * 初始化图表
   */
  init(container: HTMLDivElement, theme: ThemeConfig): void {
    this.container = container;

    this.chart = init(container, {
      layout: {
        panes: [{ type: 'candle' }],
      },
      styles: this.buildStyles(theme),
    });
  }

  /**
   * 设置K线数据
   */
  setData(data: KLineData[]): void {
    if (!this.chart) return;

    const chartData = data.map(item => ({
      timestamp: item.timestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
      turnover: item.turnover,
    }));

    this.chart.setSymbol({ ticker: 'STOCK', pricePrecision: 2, volumePrecision: 0 });
    this.chart.setPeriod({ span: 1, type: 'day' });
    this.chart.setDataLoader({
      getBars: ({ callback }) => {
        callback(chartData, { forward: false, backward: false });
      },
    });
  }

  /**
   * 设置MA均线(主图)
   */
  setMA(params: MAParams): void {
    if (!this.chart) return;

    const defaultColors = ['#ffffff', '#ff6600', '#00ff00', '#ff00ff', '#ffff00'];

    this.chart.createIndicator(
      {
        name: 'MA',
        calcParams: params.periods,
        styles: {
          lines: params.periods.map((_, idx) => ({
            style: 'solid',
            color: params.colors?.[idx] || defaultColors[idx] || defaultColors[0],
            size: 2,
          })),
        },
      },
      { pane: { id: 'candle_pane' } }
    );
  }

  /**
   * 添加指标(副图)
   */
  addIndicator(config: IndicatorConfig): void {
    if (!this.chart || !config.visible) return;

    const definition = indicatorRegistry.get(config.type);
    if (!definition) {
      console.error(`Indicator "${config.type}" not found in registry`);
      return;
    }

    const params = { ...definition.defaultParams, ...config.params };
    const indicatorConfig = definition.create(params);

    const paneId = this.chart.createIndicator(indicatorConfig);
    if (paneId) {
      this.indicatorPaneIds.set(config.type, paneId);
    }
  }

  /**
   * 清除所有指标(副图)
   */
  clearIndicators(): void {
    if (!this.chart) return;

    // klinecharts v10: 通过 removeIndicator 移除
    this.indicatorPaneIds.forEach((paneId, name) => {
      this.chart!.removeIndicator({ name });
    });
    this.indicatorPaneIds.clear();
  }

  /**
   * 设置买卖信号点
   */
  setSignals(signals: Signal[]): void {
    if (!this.chart) return;

    signals.forEach(signal => {
      this.chart!.createOverlay({
        name: 'simpleAnnotation',
        points: [{ timestamp: signal.timestamp, value: signal.price }],
        styles: {
          text: {
            color: '#ffffff',
            backgroundColor: signal.type === 'buy' ? '#ef4444' : '#22c55e',
            borderRadius: 4,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 4,
            paddingBottom: 4,
          },
        },
        extendData: signal.text || (signal.type === 'buy' ? '买' : '卖'),
      });
    });
  }

  /**
   * 更新主题
   */
  updateTheme(theme: ThemeConfig): void {
    if (!this.chart) return;
    this.chart.setStyles(this.buildStyles(theme));
  }

  /**
   * 销毁图表
   */
  destroy(): void {
    if (this.container) {
      dispose(this.container);
      this.chart = null;
      this.container = null;
      this.indicatorPaneIds.clear();
    }
  }

  /**
   * 构建样式配置
   */
  private buildStyles(theme: ThemeConfig): any {
    return {
      grid: theme.grid || { show: false },
      candle: {
        type: 'candle_solid',
        priceMark: {
          last: {
            show: true,
            upColor: theme.upColor,
            downColor: theme.downColor,
          },
        },
        bar: {
          upColor: theme.upColor,
          downColor: theme.downColor,
          upBorderColor: theme.upColor,
          downBorderColor: theme.downColor,
          upWickColor: theme.upColor,
          downWickColor: theme.downColor,
          noChangeColor: theme.noChangeColor,
          noChangeBorderColor: theme.noChangeColor,
          noChangeWickColor: theme.noChangeColor,
        },
      },
      indicator: {
        ohlc: {
          upColor: theme.upColor,
          downColor: theme.downColor,
          noChangeColor: theme.noChangeColor,
        },
        bars: [{
          upColor: theme.upColor,
          downColor: theme.downColor,
          noChangeColor: theme.noChangeColor,
        }],
      },
    };
  }
}
