// packages/lib/src/indicators/kdj.ts

import { registerIndicator } from '../core/indicator-registry';

registerIndicator({
  name: 'KDJ',
  displayName: 'KDJ指标',
  defaultParams: { n: 9, m1: 3, m2: 3 },
  paramsSchema: [
    { key: 'n', label: 'N值', type: 'number', defaultValue: 9, min: 1, max: 100 },
    { key: 'm1', label: 'M1值', type: 'number', defaultValue: 3, min: 1, max: 100 },
    { key: 'm2', label: 'M2值', type: 'number', defaultValue: 3, min: 1, max: 100 },
  ],
  create: (params) => ({
    name: 'KDJ',
    calcParams: [params.n as number, params.m1 as number, params.m2 as number],
  }),
});