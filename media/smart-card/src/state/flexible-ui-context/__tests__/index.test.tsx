import React from 'react';

import { renderHook, RenderHookOptions } from '@testing-library/react-hooks';
import { FlexibleUiContext, useFlexibleUiContext } from '../index';

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
