// packages/lib/src/indicators/rsi.ts

import { registerIndicator } from '../core/indicator-registry';

registerIndicator({
  name: 'RSI',
  displayName: 'RSI指标',
  defaultParams: { period: 14 },
  paramsSchema: [
    { key: 'period', label: '周期', type: 'number', defaultValue: 14, min: 1, max: 100 },
  ],
  create: (params) => ({
    name: 'RSI',
    calcParams: [params.period as number],
  }),
});