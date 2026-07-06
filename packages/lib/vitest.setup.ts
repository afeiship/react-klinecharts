// Test setup file
// Mock klinecharts module globally for all tests
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

vi.mock('klinecharts', () => ({
  init: vi.fn(() => mockChart),
  dispose: vi.fn(),
}));
