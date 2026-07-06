// packages/lib/__tests__/components/indicator.test.tsx

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Indicator } from '../../src/components/indicator';

describe('Indicator', () => {
  it('should render nothing', () => {
    const { container } = render(<Indicator type="MACD" />);
    expect(container.firstChild).toBeNull();
  });

  it('should accept type prop', () => {
    const { container } = render(<Indicator type="VOL" />);
    expect(container.firstChild).toBeNull();
  });

  it('should accept params prop', () => {
    const { container } = render(
      <Indicator type="MACD" params={{ fast: 12, slow: 26 }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should accept visible prop', () => {
    const { container } = render(<Indicator type="KDJ" visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('should have displayName for debugging', () => {
    expect(Indicator.displayName).toBe('Indicator');
  });
});
