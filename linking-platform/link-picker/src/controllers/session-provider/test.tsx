import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import {
  INIT_CONTEXT,
  LinkPickerSessionProvider,
  useLinkPickerSessionId,
} from './index';

describe('useLinkPickerSessionId', () => {
  it('should return a default value when there is no context', () => {
    const {
      result: { current: sessionId },
    } = renderHook(() => useLinkPickerSessionId());

    expect(sessionId).toBe(INIT_CONTEXT);
  });

  it('should return consistent sessionId from the LinkPickerSessionProvider across usages', () => {
    const { result } = renderHook(
      () => ({ a: useLinkPickerSessionId(), b: useLinkPickerSessionId() }),
      {
        wrapper: ({ children }: React.PropsWithChildren<{}>) => (
          <LinkPickerSessionProvider>{children}</LinkPickerSessionProvider>
        ),
      },
    );

    expect(result.current.a).not.toBe(INIT_CONTEXT);
    expect(result.current.b).not.toBe(INIT_CONTEXT);
    expect(result.current.a).toBe(result.current.b);
  });
});
