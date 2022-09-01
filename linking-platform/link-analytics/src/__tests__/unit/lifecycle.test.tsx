import React from 'react';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import { act, renderHook } from '@testing-library/react-hooks';

import { useSmartLinkLifecycleAnalytics } from '../../lifecycle';

describe('useSmartLinkLifecycleAnalytics', () => {
  const ANALYTICS_CHANNEL = 'media';
  const setup = () => {
    const onEvent = jest.fn();
    const renderResult = renderHook(() => useSmartLinkLifecycleAnalytics(), {
      wrapper: ({ children }: React.PropsWithChildren<{}>) => (
        <AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={onEvent}>
          {children}
        </AnalyticsListener>
      ),
    });
    return { onEvent, ...renderResult };
  };

  describe('createSmartLink', () => {
    it('fires a `smartLink created` event with attributes', () => {
      const { onEvent, result } = setup();
      act(() => {
        result.current.createSmartLink(
          { url: 'test.com', smartLinkId: 'xyz' },
          { extensionKey: 'test-key' },
        );
      });
      expect(onEvent).toBeCalledWith(
        expect.objectContaining({
          hasFired: true,
          payload: expect.objectContaining({
            action: 'created',
            actionSubject: 'smartLink',
            attributes: {
              extensionKey: 'test-key',
            },
          }),
        }),
        ANALYTICS_CHANNEL,
      );
    });
  });
});
