import React from 'react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { act, renderHook } from '@testing-library/react-hooks';

import { useSmartLinkLifecycleAnalytics } from '../../lifecycle';
import { linkCreatedPayload, linkDeletedPayload } from '../../analytics';

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

  const cases: [
    string,
    'linkCreated' | 'linkDeleted',
    { action: string; actionSubject: string },
  ][] = [
    ['link created', 'linkCreated', linkCreatedPayload],
    ['link deleted', 'linkDeleted', linkDeletedPayload],
  ];

  describe.each(cases)('%s', (name, method, payload) => {
    it(`fires a ${name} event with custom attributes`, () => {
      const { onEvent, result } = setup();
      act(() => {
        result.current[method]({ url: 'test.com', smartLinkId: 'xyz' }, null, {
          extensionKey: 'test-key',
        });
      });

      expect(onEvent).toBeCalledWith(
        expect.objectContaining({
          hasFired: true,
          payload: expect.objectContaining({
            ...payload,
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

    it(`${name} supports deriving attributes from a source event`, () => {
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
        result.current[method](
          { url: 'test.com', smartLinkId: 'xyz' },
          sourceEvent,
        );
      });

      expect(onEvent).toBeCalledWith(
        expect.objectContaining({
          hasFired: true,
          payload: expect.objectContaining({
            ...payload,
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

    it(`${name} supports custom attributes + attributes from a source event`, () => {
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
        result.current[method](
          { url: 'test.com', smartLinkId: 'xyz' },
          sourceEvent,
        );
      });

      expect(onEvent).toBeCalledWith(
        expect.objectContaining({
          hasFired: true,
          payload: expect.objectContaining({
            ...payload,
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
