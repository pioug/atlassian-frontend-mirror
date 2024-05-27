import React from 'react';

import { renderHook, type RenderHookOptions } from '@testing-library/react-hooks';
import {
  FlexibleUiContext,
  FlexibleUiOptionContext,
  useFlexibleUiContext,
  useFlexibleUiOptionContext,
} from '../index';
import { SmartLinkSize } from '../../../constants';

describe('useFlexibleUiContext', () => {
  it('provides correct context to consumer', () => {
    const context = { title: 'This is title.' };
    const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
      <FlexibleUiContext.Provider value={context}>
        {children}
      </FlexibleUiContext.Provider>
    );

    const { current } = renderHook(() => useFlexibleUiContext(), {
      wrapper,
    }).result;

    expect(current).toEqual(context);
  });
});

describe('useFlexibleUiOptionContext', () => {
  it('provides correct context to consumer', () => {
    const context = { size: SmartLinkSize.Small, zIndex: 20 };
    const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
      <FlexibleUiOptionContext.Provider value={context}>
        {children}
      </FlexibleUiOptionContext.Provider>
    );

    const { current } = renderHook(() => useFlexibleUiOptionContext(), {
      wrapper,
    }).result;

    expect(current).toEqual(context);
  });
});
