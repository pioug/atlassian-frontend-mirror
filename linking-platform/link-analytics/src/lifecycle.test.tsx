import React, { useCallback, useState } from 'react';

import '@atlaskit/link-test-helpers/jest';

import { IntlProvider } from 'react-intl-next';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent, waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react-hooks';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { SmartCardProvider, useFeatureFlag } from '@atlaskit/link-provider';
import { LinkPicker, LinkPickerProps } from '@atlaskit/link-picker';
import { MockLinkPickerPlugin } from '@atlaskit/link-test-helpers/link-picker';

import { ANALYTICS_CHANNEL } from './consts';
import { useSmartLinkLifecycleAnalytics } from './lifecycle';
import { runWhenIdle } from './utils';
import { fakeFactory, mocks } from './__fixtures__/mocks';
import { LifecycleAction } from './types';

jest.mock('@atlaskit/link-provider', () => {
  const originalModule = jest.requireActual('@atlaskit/link-provider');
  return {
    ...originalModule,
    useFeatureFlag: jest.fn(),
  };
});

jest.mock('./utils', () => {
  const originalModule = jest.requireActual('./utils');
  return {
    ...originalModule,
    runWhenIdle: jest.fn(),
  };
});

const PACKAGE_METADATA = {
  packageName: '@atlaskit/link-analytics',
  packageVersion: '999.9.9',
};

describe('useSmartLinkLifecycleAnalytics', () => {
  beforeEach(() => {
    (useFeatureFlag as jest.Mock).mockReturnValue(false);
    (runWhenIdle as jest.Mock).mockImplementation(cb => {
      cb();
      return 123;
    });
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
    LifecycleAction,
    'linkCreated' | 'linkDeleted' | 'linkUpdated',
    { action: string; actionSubject: string; eventType: string },
  ][] = [
    [
      'created',
      'linkCreated',
      { action: 'created', actionSubject: 'link', eventType: 'track' },
    ],
    [
      'deleted',
      'linkDeleted',
      { action: 'deleted', actionSubject: 'link', eventType: 'track' },
    ],
    [
      'updated',
      'linkUpdated',
      { action: 'updated', actionSubject: 'link', eventType: 'track' },
    ],
  ];

  const expectedResolvedAttributes = {
    extensionKey: 'object-provider',
    displayCategory: 'smartLink',
    status: 'resolved',
  };

  const getInputMethodName = (action: LifecycleAction) => {
    switch (action) {
      case 'created':
        return 'creationMethod';
      case 'updated':
        return 'updateMethod';
      case 'deleted':
        return 'deleteMethod';
    }
  };

  describe.each(cases)('%s', (action, method, payload) => {
    const inputMethodAttribute = getInputMethodName(action);

    it(`fires a link ${action} event with custom attributes`, async () => {
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

    it(`link ${action} supports deriving attributes from a source event`, async () => {
      const sourceEvent = new UIAnalyticsEvent({
        context: [
          {
            componentName: 'LinkPicker',
          },
          {
            attributes: {
              linkFieldContentInputMethod: 'paste',
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
                [inputMethodAttribute]: 'linkpicker_paste',
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });
    });

    it(`link ${action} supports custom attributes + attributes from a source event`, async () => {
      const sourceEvent = new UIAnalyticsEvent({
        context: [
          {
            componentName: 'LinkPicker',
          },
          {
            attributes: {
              linkFieldContentInputMethod: 'paste',
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
                [inputMethodAttribute]: 'linkpicker_paste',
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });
    });

    it(`link ${action} derives the URL domain and includes in nonPrivacySafeAttributes`, async () => {
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

  describe('with link picker source event', () => {
    const testIds = {
      urlInputField: 'link-url',
      submit: 'link-picker-insert-button',
    };

    const setup = () => {
      const mockFetch = jest.fn(async () => mocks.success);
      const mockClient = new (fakeFactory(mockFetch))();
      const onEvent = jest.fn();

      const Component = () => {
        const [link, setLink] = useState<{
          url?: string;
          displayText?: string | null;
        }>({});

        const callbacks = useSmartLinkLifecycleAnalytics();
        const onSubmit: LinkPickerProps['onSubmit'] = useCallback(
          (details, sourceEvent) => {
            setLink(details);
            callbacks[link.url ? 'linkUpdated' : 'linkCreated'](
              details,
              sourceEvent,
            );
          },
          [callbacks, link],
        );
        const plugins = [new MockLinkPickerPlugin()];
        return (
          <LinkPicker
            plugins={plugins}
            url={link.url}
            onSubmit={onSubmit}
            onCancel={jest.fn()}
          />
        );
      };

      const renderResult = render(<Component />, {
        wrapper: ({ children }: React.PropsWithChildren<{}>) => (
          <IntlProvider locale="en">
            <SmartCardProvider client={mockClient}>
              <AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={onEvent}>
                {children}
              </AnalyticsListener>
            </SmartCardProvider>
          </IntlProvider>
        ),
      });
      return { onEvent, ...renderResult };
    };

    it('should support deriving `creationMethod` and `updateMethod` as `linkpicker_manual` when typing', async () => {
      const { onEvent } = setup();

      const urlInput = await screen.findByTestId(testIds.urlInputField);
      await userEvent.type(urlInput, 'www.atlassian.com');

      jest.clearAllMocks();
      fireEvent.submit(urlInput);

      await waitFor(() => {
        expect(onEvent).toBeFiredWithAnalyticEventOnce({
          payload: {
            action: 'created',
            actionSubject: 'link',
            attributes: {
              creationMethod: 'linkpicker_manual',
            },
          },
        });
      });

      await userEvent.clear(urlInput);
      await userEvent.type(urlInput, 'www.google.com');
      jest.clearAllMocks();
      fireEvent.submit(urlInput);

      await waitFor(() => {
        expect(onEvent).toBeFiredWithAnalyticEventOnce({
          payload: {
            action: 'updated',
            actionSubject: 'link',
            attributes: {
              updateMethod: 'linkpicker_manual',
            },
          },
        });
      });
    });

    it('should support deriving `creationMethod` and `updateMethod` as `linkpicker_paste` when pasting', async () => {
      const { onEvent } = setup();

      const urlInput = await screen.findByTestId(testIds.urlInputField);
      fireEvent.input(urlInput, {
        inputType: 'insertFromPaste',
        target: { value: 'www.atlassian.com' },
      });

      jest.clearAllMocks();
      fireEvent.submit(urlInput);

      await waitFor(() => {
        expect(onEvent).toBeFiredWithAnalyticEventOnce({
          payload: {
            action: 'created',
            actionSubject: 'link',
            attributes: {
              creationMethod: 'linkpicker_paste',
            },
          },
        });
      });

      await userEvent.clear(urlInput);
      fireEvent.input(urlInput, {
        inputType: 'insertFromPaste',
        target: { value: 'www.google.com' },
      });
      jest.clearAllMocks();
      fireEvent.submit(urlInput);

      await waitFor(() => {
        expect(onEvent).toBeFiredWithAnalyticEventOnce({
          payload: {
            action: 'updated',
            actionSubject: 'link',
            attributes: {
              updateMethod: 'linkpicker_paste',
            },
          },
        });
      });
    });

    it('should support deriving `creationMethod` and `updateMethod` as `linkpicker_searchResult` when selecting search result', async () => {
      const { onEvent } = setup();

      const urlInput = await screen.findByTestId(testIds.urlInputField);
      await userEvent.keyboard('{arrowdown}');
      jest.clearAllMocks();
      await userEvent.keyboard('{enter}');

      await waitFor(() => {
        expect(onEvent).toBeFiredWithAnalyticEventOnce({
          payload: {
            action: 'created',
            actionSubject: 'link',
            attributes: {
              creationMethod: 'linkpicker_searchResult',
            },
          },
        });
      });

      await userEvent.clear(urlInput);
      await userEvent.keyboard('{arrowdown}');
      jest.clearAllMocks();
      await userEvent.keyboard('{enter}');

      await waitFor(() => {
        expect(onEvent).toBeFiredWithAnalyticEventOnce({
          payload: {
            action: 'updated',
            actionSubject: 'link',
            attributes: {
              updateMethod: 'linkpicker_searchResult',
            },
          },
        });
      });
    });
  });

  describe('runWhenIdle', () => {
    const fireEventSpy = jest.spyOn(
      jest.requireActual('./fire-event'),
      'default',
    );

    it('calls `fireEvent` at a later time when run with `runWhenIdle`', async () => {
      const { result } = setup();
      result.current.linkCreated({ url: 'test.com', smartLinkId: 'xyz' });

      expect(runWhenIdle).toBeCalled();
      expect(fireEventSpy).not.toBeCalled();

      await waitFor(() => {
        expect(fireEventSpy).toBeCalled();
      });
    });
  });
});
