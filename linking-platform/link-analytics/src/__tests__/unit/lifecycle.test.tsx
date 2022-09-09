import React from 'react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

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
    it('fires a `link created` event with custom attributes', () => {
      const { onEvent, result } = setup();
      act(() => {
        result.current.linkCreated(
          { url: 'test.com', smartLinkId: 'xyz' },
          null,
          { extensionKey: 'test-key' },
        );
      });
      expect(onEvent).toBeCalledWith(
        expect.objectContaining({
          hasFired: true,
          payload: expect.objectContaining({
            action: 'created',
            actionSubject: 'link',
            attributes: {
              smartLinkId: 'xyz',
              extensionKey: 'test-key',
            },
            packageName: '@atlaskit/link-analytics',
          }),
        }),
        ANALYTICS_CHANNEL,
      );
    });

    it('supports deriving attributes from a source event', () => {
      const sourceEvent = new UIAnalyticsEvent({
        context: [
          {
            componentName: 'LinkPicker',
          },
          {
            attributes: {
              linkState: 'newLink',
              submitMethod: 'paste',
            },
          },
        ],
        payload: {
          action: 'submitted',
          actionSubject: 'form',
        },
      });

      const { onEvent, result } = setup();
      act(() => {
        result.current.linkCreated(
          { url: 'test.com', smartLinkId: 'xyz' },
          sourceEvent,
        );
      });
      expect(onEvent).toBeCalledWith(
        expect.objectContaining({
          hasFired: true,
          payload: expect.objectContaining({
            action: 'created',
            actionSubject: 'link',
            attributes: {
              sourceEvent: 'form submitted',
              smartLinkId: 'xyz',
              linkState: 'newLink',
              submitMethod: 'paste',
            },
            packageName: '@atlaskit/link-analytics',
          }),
        }),
        ANALYTICS_CHANNEL,
      );
    });

    it('supports custom attributes + attributes from a source event', () => {
      const sourceEvent = new UIAnalyticsEvent({
        context: [
          {
            componentName: 'LinkPicker',
          },
          {
            attributes: {
              linkState: 'newLink',
              submitMethod: 'paste',
            },
          },
        ],
        payload: {
          action: 'submitted',
          actionSubject: 'form',
          actionSubjectId: 'linkPicker',
        },
      });

      const { onEvent, result } = setup();

      act(() => {
        result.current.linkCreated(
          { url: 'test.com', smartLinkId: 'xyz' },
          sourceEvent,
        );
      });

      expect(onEvent).toBeCalledWith(
        expect.objectContaining({
          hasFired: true,
          payload: expect.objectContaining({
            action: 'created',
            actionSubject: 'link',
            eventType: 'track',
            attributes: {
              sourceEvent: 'form submitted (linkPicker)',
              smartLinkId: 'xyz',
              linkState: 'newLink',
              submitMethod: 'paste',
            },
            packageName: '@atlaskit/link-analytics',
          }),
        }),
        ANALYTICS_CHANNEL,
      );
    });
  });
});
