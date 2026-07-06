// packages/lib/src/indicators/macd.ts

import { registerIndicator } from '../core/indicator-registry';

registerIndicator({
  name: 'MACD',
  displayName: 'MACD指标',
  defaultParams: { fast: 12, slow: 26, signal: 9 },
  paramsSchema: [
    { key: 'fast', label: '快线', type: 'number', defaultValue: 12, min: 1, max: 100 },
    { key: 'slow', label: '慢线', type: 'number', defaultValue: 26, min: 1, max: 100 },
    { key: 'signal', label: '信号线', type: 'number', defaultValue: 9, min: 1, max: 100 },
  ],
  create: (params) => ({
    name: 'MACD',
    calcParams: [params.fast as number, params.slow as number, params.signal as number],
  }),
});