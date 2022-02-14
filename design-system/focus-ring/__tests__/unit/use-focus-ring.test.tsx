import React from 'react';

import { act, render } from '@testing-library/react';

import { useFocusRing } from '../../src';
import type { FocusState } from '../../src/types';

/**
 * @returns The getByTestId() fn and the hook state
 */
function setup(initialFocus?: FocusState) {
  const returnVal: ReturnType<typeof useFocusRing> = {} as any;
  function DummyComponent() {
    const focusHook = useFocusRing(initialFocus);
    Object.assign(returnVal, focusHook);
    return (
      <button {...focusHook.focusProps} data-testid="test" type="button" />
    );
  }
  const { getByTestId } = render(<DummyComponent />);
  return [getByTestId, returnVal] as const;
}

describe('Focus Ring', () => {
  it('can accept a different default state', () => {
    const [, focusHook] = setup('on');
    expect(focusHook.focusState).toEqual('on');
  });

  it('will update the focus state when focus changes', () => {
    const [getByTestId, focusHook] = setup();

    expect(focusHook.focusState).toEqual('off');
    const element = getByTestId('test');
    element.focus();
    expect(focusHook.focusState).toEqual('on');

    element.blur();
    expect(focusHook.focusState).toEqual('off');
  });

  it('can programmatically update the focus state by directly calling the event handlers', () => {
    const [, focusHook] = setup();

    expect(focusHook.focusState).toEqual('off');
    act(() => {
      // @ts-ignore
      focusHook.focusProps.onFocus();
    });

    expect(focusHook.focusState).toEqual('on');

    act(() => {
      // @ts-ignore
      focusHook.focusProps.onBlur();
    });
    expect(focusHook.focusState).toEqual('off');
  });
});
