import React from 'react';

import '@atlaskit/link-test-helpers/jest';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { SmartCardProvider, useFeatureFlag } from '@atlaskit/link-provider';
import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/dom';

import { ANALYTICS_CHANNEL } from '../../consts';
import { useSmartLinkLifecycleAnalytics } from '../../lifecycle';
import { fakeFactory, mocks } from '../__fixtures__/mocks';

jest.mock('@atlaskit/link-provider', () => {
  const originalModule = jest.requireActual('@atlaskit/link-provider');
  return {
    ...originalModule,
    useFeatureFlag: jest.fn(),
  };
});

const PACKAGE_METADATA = {
  packageName: '@atlaskit/link-analytics',
  packageVersion: '999.9.9',
};

describe('useSmartLinkLifecycleAnalytics', () => {
  beforeEach(() => {
    (useFeatureFlag as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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
    { action: string; actionSubject: string; eventType: string },
  ][] = [
    [
      'link created',
      'linkCreated',
      { action: 'created', actionSubject: 'link', eventType: 'track' },
    ],
    [
      'link deleted',
      'linkDeleted',
      { action: 'deleted', actionSubject: 'link', eventType: 'track' },
    ],
    [
      'link updated',
      'linkUpdated',
      { action: 'updated', actionSubject: 'link', eventType: 'track' },
    ],
  ];

  const expectedResolvedAttributes = {
    extensionKey: 'object-provider',
    displayCategory: 'smartLink',
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
        expect(onEvent).toBeFiredWithAnalyticEventOnce(
          {
            context: [PACKAGE_METADATA],
            payload: {
              ...payload,
              attributes: {
                smartLinkId: 'xyz',
                customAttribute: 'test-attribute',
              },
            },
          },
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
        expect(onEvent).toBeFiredWithAnalyticEventOnce(
          {
            context: [PACKAGE_METADATA],
            payload: {
              ...payload,
              actionSubject: 'link',
              attributes: {
                sourceEvent: 'form submitted',
                smartLinkId: 'xyz',
                linkState: 'newLink',
                submitMethod: 'paste',
              },
            },
          },
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
        expect(onEvent).toBeFiredWithAnalyticEventOnce(
          {
            context: [PACKAGE_METADATA],
            payload: {
              ...payload,
              attributes: {
                sourceEvent: 'form submitted (linkPicker)',
                smartLinkId: 'xyz',
                linkState: 'newLink',
                submitMethod: 'paste',
              },
            },
          },
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
        expect(onEvent).toBeFiredWithAnalyticEventOnce(
          {
            hasFired: true,
            context: [PACKAGE_METADATA],
            payload: {
              ...payload,
              nonPrivacySafeAttributes: {
                domainName: 'sub.test.com',
              },
            },
          },
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
          expect(onEvent).toBeFiredWithAnalyticEventOnce(
            {
              context: [PACKAGE_METADATA],
              payload: {
                ...payload,
                attributes: {
                  smartLinkId: 'xyz',
                  ...expectedResolvedAttributes,
                },
              },
            },
            ANALYTICS_CHANNEL,
          );
        });
      });
    });
  });
});
