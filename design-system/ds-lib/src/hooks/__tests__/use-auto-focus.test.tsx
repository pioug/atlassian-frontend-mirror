import React, { createRef, useRef } from 'react';

import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import useAutoFocus from '../use-auto-focus';

describe('useAutoFocus()', () => {
  const Component = ({ autoFocus }: { autoFocus: boolean }) => {
    const ref = useRef<HTMLButtonElement>(null);
    useAutoFocus(ref, autoFocus);
    return <button ref={ref} id="test" />;
  };

  it('should focus on initial render', () => {
    render(<Component autoFocus />);

    expect(document.activeElement?.id).toEqual('test');
  });

  it('should not focus on initial render', () => {
    render(<Component autoFocus={false} />);

    expect(document.activeElement?.id).not.toEqual('test');
  });

  it('should only focus once', () => {
    const { rerender } = render(<Component autoFocus />);
    document.getElementById('test')?.blur();

    rerender(<Component autoFocus />);

    expect(document.activeElement).toBe(document.body);
  });

  it('should focus with a created ref', () => {
    const Component = ({ autoFocus }: { autoFocus: boolean }) => {
      const ref = createRef<HTMLButtonElement>();
      useAutoFocus(ref, autoFocus);
      return <button ref={ref} id="test" />;
    };

    render(<Component autoFocus />);

    expect(document.activeElement?.id).toEqual('test');
  });

  it('should not blow up for empty calls', () => {
    expect(() => {
      renderHook(() => {
        const ref = createRef<HTMLElement>();

        useAutoFocus(ref, true);
        useAutoFocus(undefined, true);
      });
    }).not.toThrow();
  });
});
