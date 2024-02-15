import { renderHook } from '@testing-library/react-hooks';

import useOverflowable from '../../internal/use-overflowable';

describe('#useOverflowable', () => {
  it('should return true for overflow and tooltip when button width exceeds truncation width', () => {
    const truncationWidth = 300;
    const ref = { clientWidth: 290 } as any;
    const iconWidthAllowance = 24;

    const actual = renderHook(() =>
      useOverflowable(truncationWidth, ref, iconWidthAllowance),
    );

    const [hasOverflow, showTooltip] = actual.result.current;
    expect(hasOverflow).toBe(true);
    expect(showTooltip).toBe(true);
  });

  it('should return false for overflow and true for tooltip when button width equals truncation width', () => {
    const truncationWidth = 300;
    const ref = { clientWidth: 300 } as any;
    const iconWidthAllowance = 0;

    const actual = renderHook(() =>
      useOverflowable(truncationWidth, ref, iconWidthAllowance),
    );

    const [hasOverflow, showTooltip] = actual.result.current;
    expect(hasOverflow).toBe(false);
    expect(showTooltip).toBe(true);
  });

  it('should return false for overflow and tooltip when truncation width is undefined', () => {
    const truncationWidth = undefined;
    const ref = { clientWidth: 300 } as any;
    const iconWidthAllowance = 0;

    const actual = renderHook(() =>
      useOverflowable(truncationWidth, ref, iconWidthAllowance),
    );

    const [hasOverflow, showTooltip] = actual.result.current;
    expect(hasOverflow).toBe(false);
    expect(showTooltip).toBe(false);
  });

  it('should return false for overflow and tooltip when button width is lower than truncation width', () => {
    const truncationWidth = 400;
    const ref = { clientWidth: 300 } as any;
    const iconWidthAllowance = 48;

    const actual = renderHook(() =>
      useOverflowable(truncationWidth, ref, iconWidthAllowance),
    );

    const [hasOverflow, showTooltip] = actual.result.current;
    expect(hasOverflow).toBe(false);
    expect(showTooltip).toBe(false);
  });

  it('should return true for overflow and tooltip when button width exceeds truncation width, and then false when button width no longer exceeds truncation width', () => {
    let truncationWidth = 300;
    let ref = { clientWidth: 290 } as any;
    let iconWidthAllowance = 24;

    const actual = renderHook(() =>
      useOverflowable(truncationWidth, ref, iconWidthAllowance),
    );

    let hasOverflow = actual.result.current[0];
    let showTooltip = actual.result.current[1];
    expect(hasOverflow).toBe(true);
    expect(showTooltip).toBe(true);

    truncationWidth = 300;
    ref = { clientWidth: 270 } as any;
    iconWidthAllowance = 24;

    actual.rerender();

    hasOverflow = actual.result.current[0];
    showTooltip = actual.result.current[1];
    expect(hasOverflow).toBe(false);
    expect(showTooltip).toBe(false);
  });
});
