// packages/lib/src/indicators/index.ts

// 导出各个指标模块（导入即自动注册）
export { } from './vol';
export { } from './macd';
export { } from './kdj';
export { } from './rsi';
export { } from './cci';

// 自动注册所有内置指标
import './vol';
import './macd';
import './kdj';
import './rsi';
import './cci';