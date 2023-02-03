import React from 'react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/dom';

import { useSmartLinkLifecycleAnalytics } from '../../lifecycle';
import {
  linkCreatedPayload,
  linkDeletedPayload,
  linkUpdatedPayload,
} from '../../analytics';
import { SmartCardProvider, useFeatureFlag } from '@atlaskit/link-provider';
import { fakeFactory, mocks } from '../__fixtures__/mocks';

jest.mock('@atlaskit/link-provider', () => {
  const originalModule = jest.requireActual('@atlaskit/link-provider');
  return {
    ...originalModule,
    useFeatureFlag: jest.fn(),
  };
});

describe('useSmartLinkLifecycleAnalytics', () => {
  beforeEach(() => {
    (useFeatureFlag as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const ANALYTICS_CHANNEL = 'media';
  const setup = () => {
    const mockFetch = jest.fn(async () => mocks.success);
    const mockClient = new (fakeFactory(mockFetch))();

    const onEvent = jest.fn();
    const renderResult = renderHook(() => useSmartLinkLifecycleAnalytics(), {
      wrapper: ({ children }: React.PropsWithChildren<{}>) => (
        <SmartCardProvider client={mockClient}>
          <AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={onEvent}>
            {children}
          </AnalyticsListener>
        </SmartCardProvider>
      ),
    });
    return { onEvent, ...renderResult };
  };

  const cases: [
    string,
    'linkCreated' | 'linkDeleted' | 'linkUpdated',
    { action: string; actionSubject: string },
  ][] = [
    ['link created', 'linkCreated', linkCreatedPayload],
    ['link deleted', 'linkDeleted', linkDeletedPayload],
    ['link updated', 'linkUpdated', linkUpdatedPayload],
  ];

  const expectedResolvedAttributes = {
    extensionKey: 'object-provider',
    status: 'resolved',
  };

  describe.each(cases)('%s', (name, method, payload) => {
    it(`fires a ${name} event with custom attributes`, async () => {
      const { onEvent, result } = setup();
      act(() => {
        result.current[method]({ url: 'test.com', smartLinkId: 'xyz' }, null, {
          customAttribute: 'test-attribute',
        });
      });

      await waitFor(() => {
        expect(onEvent).toBeCalledWith(
          expect.objectContaining({
            hasFired: true,
            payload: expect.objectContaining({
              ...payload,
              attributes: {
                smartLinkId: 'xyz',
                customAttribute: 'test-attribute',
              },
              packageName: '@atlaskit/link-analytics',
            }),
          }),
          ANALYTICS_CHANNEL,
        );
      });
    });

    it(`${name} supports deriving attributes from a source event`, async () => {
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

      await waitFor(() => {
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
    });

    it(`${name} supports custom attributes + attributes from a source event`, async () => {
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

      await waitFor(() => {
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

    it(`${name} derives the URL domain and includes in nonPrivacySafeAttributes`, async () => {
      const { onEvent, result } = setup();
      act(() => {
        result.current[method]({
          url: 'sub.test.com/abc/123',
          smartLinkId: 'xyz',
        });
      });

      await waitFor(() => {
        expect(onEvent).toBeCalledWith(
          expect.objectContaining({
            hasFired: true,
            payload: expect.objectContaining({
              ...payload,
              nonPrivacySafeAttributes: {
                domainName: 'sub.test.com',
              },
              packageName: '@atlaskit/link-analytics',
            }),
          }),
          ANALYTICS_CHANNEL,
        );
      });
    });

    describe('when ff: `enableResolveMetadataForLinkAnalytics` is `true`', () => {
      it('should return resolved metadata', async () => {
        (useFeatureFlag as jest.Mock).mockReturnValue(true);
        const { onEvent, result } = setup();
        act(() => {
          result.current[method]({ url: 'test.com', smartLinkId: 'xyz' });
        });

        await waitFor(() => {
          expect(onEvent).toBeCalledWith(
            expect.objectContaining({
              hasFired: true,
              payload: expect.objectContaining({
                ...payload,
                attributes: {
                  smartLinkId: 'xyz',
                  ...expectedResolvedAttributes,
                },
                packageName: '@atlaskit/link-analytics',
              }),
            }),
            ANALYTICS_CHANNEL,
          );
        });
      });
    });
  });
});
