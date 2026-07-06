// packages/lib/src/indicators/vol.ts

import { registerIndicator } from '../core/indicator-registry';

registerIndicator({
  name: 'VOL',
  displayName: '成交量',
  defaultParams: {},
  paramsSchema: [],
  create: () => ({
    name: 'VOL',
  }),
});