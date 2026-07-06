// Mock klinecharts for testing
// klinecharts requires canvas which isn't available in jsdom
import { vi } from 'vitest';

const mockChart = {
  setSymbol: vi.fn(),
  setPeriod: vi.fn(),
  setDataLoader: vi.fn(),
  createIndicator: vi.fn(() => 'indicator-id'),
  removeIndicator: vi.fn(),
  createOverlay: vi.fn(),
  setStyles: vi.fn(),
  dispose: vi.fn(),
};

export const init = vi.fn(() => mockChart);
export const dispose = vi.fn();
