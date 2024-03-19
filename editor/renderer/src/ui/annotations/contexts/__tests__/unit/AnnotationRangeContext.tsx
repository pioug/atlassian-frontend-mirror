import { renderHook, act } from '@testing-library/react-hooks';
import type { ReactNode } from 'react';
import React from 'react';

import {
  AnnotationRangeProvider,
  useAnnotationRangeDispatch,
  useAnnotationRangeState,
} from '../../AnnotationRangeContext';

type Props = {
  children?: ReactNode;
};

describe('Annotations: AnnotationRangeContext', () => {
  const range = new Range();

  it('should not have setHoverTarget callback when comments on media is disabled', () => {
    const wrapper = ({ children }: Props) => (
      <AnnotationRangeProvider allowCommentsOnMedia={false}>
        {children}
      </AnnotationRangeProvider>
    );
    const { result } = renderHook(() => useAnnotationRangeDispatch(), {
      wrapper,
    });

    expect(result.current.setHoverTarget).not.toBeDefined();
  });

  it('should have setHoverTarget callback when comments on media is enabled', () => {
    const wrapper = ({ children }: Props) => (
      <AnnotationRangeProvider allowCommentsOnMedia={true}>
        {children}
      </AnnotationRangeProvider>
    );
    const { result } = renderHook(() => useAnnotationRangeDispatch(), {
      wrapper,
    });

    expect(result.current.setHoverTarget).toBeDefined();
  });

  it('should set range as selection type when using setRange', () => {
    const wrapper = ({ children }: Props) => (
      <AnnotationRangeProvider allowCommentsOnMedia={true}>
        {children}
      </AnnotationRangeProvider>
    );
    const { result } = renderHook(
      () => ({ ...useAnnotationRangeState(), ...useAnnotationRangeDispatch() }),
      { wrapper },
    );

    expect(result.current.range).toBe(null);
    expect(result.current.type).toBe(null);

    act(() => {
      result.current.setRange(range);
    });

    expect(result.current.range).toBe(range);
    expect(result.current.type).toBe('selection');
  });

  it('should clear selection range when using clearSelectionRange', () => {
    const wrapper = ({ children }: Props) => (
      <AnnotationRangeProvider allowCommentsOnMedia={true}>
        {children}
      </AnnotationRangeProvider>
    );
    const { result } = renderHook(
      () => ({ ...useAnnotationRangeState(), ...useAnnotationRangeDispatch() }),
      { wrapper },
    );

    act(() => {
      result.current.setRange(range);
    });

    expect(result.current.range).toBe(range);
    expect(result.current.type).toBe('selection');

    act(() => {
      result.current.clearSelectionRange();
    });

    expect(result.current.range).toBe(null);
    expect(result.current.type).toBe(null);
  });

  it('should not clear selection range when using clearHoverSelection', () => {
    const wrapper = ({ children }: Props) => (
      <AnnotationRangeProvider allowCommentsOnMedia={true}>
        {children}
      </AnnotationRangeProvider>
    );
    const { result } = renderHook(
      () => ({ ...useAnnotationRangeState(), ...useAnnotationRangeDispatch() }),
      { wrapper },
    );

    act(() => {
      result.current.setRange(range);
    });

    expect(result.current.range).toBe(range);
    expect(result.current.type).toBe('selection');

    act(() => {
      result.current.clearHoverRange();
    });

    expect(result.current.range).toBe(range);
    expect(result.current.type).toBe('selection');
  });
});
