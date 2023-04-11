import React from 'react';

import '@atlaskit/link-test-helpers/jest';

import { IntlProvider } from 'react-intl-next';
import { screen } from '@testing-library/react';
import { render, fireEvent, act } from '@testing-library/react';

import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { CardClient } from '@atlaskit/link-provider';
import * as userAgent from '@atlaskit/linking-common/user-agent';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { CardAppearance, Provider, TitleBlock } from '../../..';
import { Card } from '../../Card';
import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import { fakeFactory, mocks } from '../../../utils/mocks';

mockSimpleIntersectionObserver();

jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock(
  'react-transition-group/Transition',
  () => (data: any) => data.children,
);

jest.mock('@atlaskit/linking-common/user-agent', () => ({
  browser: jest.fn(() => ({
    mac: false,
    safari: false,
  })),
}));

type TestCaseOptions = {
  /**
   * Callback to fire after render but before clicking
   */
  beforeClick?: () => Promise<void>;
  /**
   * Link selector to target an element to click
   */
  selector?: () => Promise<HTMLElement>;
  /**
   * Expected context to be seen on the event
   */
  context?: Record<string, unknown>[];
  /**
   * Feature flags to supply to the smart card provider
   */
  featureFlags?: React.ComponentProps<typeof Provider>['featureFlags'];
};

const PACKAGE_CONTEXT = {
  componentName: 'smart-cards',
  packageName: '@atlaskit/smart-card',
  packageVersion: '999.9.9',
};

const HOVER_CARD_CONTEXT = {
  attributes: {
    display: 'hoverCardPreview',
  },
  source: 'smartLinkPreviewHoverCard',
};

describe('`link clicked`', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockPostData: jest.Mock;
  let mockWindowOpen: jest.Mock;

  beforeEach(() => {
    mockWindowOpen = jest.fn();
    mockFetch = jest.fn(async () => ({
      ...mocks.success,
      // set preview to about:blank so it doesn't try and load the iframe
      data: { ...mocks.success.data, preview: { href: 'about:blank' } },
    }));
    mockPostData = jest.fn(async () => mocks.actionSuccess);
    mockClient = new (fakeFactory(mockFetch, mockPostData))();
    global.open = mockWindowOpen;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  /**
   * Each case here defines a link instance to test
   * These cases have different behaviour to hover card + flex UI
   * Browser behaviour is sometimes hijacked
   */
  describe.each<[CardAppearance | 'block(flexible)', TestCaseOptions?]>([
    ['inline', { selector: () => screen.findByTestId('card-resolved-view') }],
    ['block'],
    [
      'block(flexible)',
      {
        featureFlags: { enableFlexibleBlockCard: true },
        beforeClick: async () => {
          await screen.findByTestId('smart-block-title-resolved-view');
        },
        context: [PACKAGE_CONTEXT],
      },
    ],
    ['embed'],
  ])('with `%s` appearance and options %j', (testCase, options) => {
    const setup = async (
      props: Partial<React.ComponentProps<typeof Card>> = {},
    ) => {
      const spy = jest.fn();
      const { selector, beforeClick, featureFlags } = options ?? {};

      const getCardProps = () => {
        switch (testCase) {
          case 'block(flexible)':
            return {
              appearance: 'block',
            } as const;
          default:
            return {
              appearance: testCase,
            };
        }
      };

      render(
        <AnalyticsListener onEvent={spy} channel={ANALYTICS_CHANNEL}>
          <IntlProvider locale="en">
            <Provider client={mockClient} featureFlags={featureFlags}>
              <Card
                testId="card"
                url="https://atlassian.com"
                {...props}
                {...getCardProps()}
              />
            </Provider>
          </IntlProvider>
        </AnalyticsListener>,
      );

      await beforeClick?.();

      const link = selector
        ? await selector()
        : await screen.findByRole('link');

      const fireOnClick = (options?: Parameters<typeof fireEvent.click>[1]) => {
        fireEvent.click(link, options);
      };

      const fireOnMouseDown = (
        options?: Parameters<typeof fireEvent.mouseDown>[1],
      ) => {
        fireEvent.mouseDown(link, options);
      };

      return {
        spy,
        fireOnClick,
        fireOnMouseDown,
      };
    };

    describe('left click', () => {
      it('should fire with `clickOutcome` = `clickThrough` by default', async () => {
        const { spy, fireOnClick } = await setup();

        fireOnClick();

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'clickThrough',
                keysHeld: [],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `prevented` if the event default behaviour is prevented', async () => {
        const { spy, fireOnClick } = await setup({
          onClick: (e) => {
            e.preventDefault();
          },
        });

        fireOnClick();

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'prevented',
                keysHeld: [],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      /**
       * This is not the default behaviour but hijacked behaviour
       */
      it('should fire with `clickOutcome` = `clickThrough` if the alt key is held', async () => {
        const { spy, fireOnClick } = await setup();

        fireOnClick({
          altKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'clickThrough',
                keysHeld: ['alt'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `prevented` if the alt key is held but an `onClick` is supplied', async () => {
        const { spy, fireOnClick } = await setup({ onClick: jest.fn() });

        fireOnClick({
          altKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'prevented',
                keysHeld: ['alt'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      /**
       * This is not the default behaviour but hijacked behaviour
       */
      it('should fire with `clickOutcome` = `clickThrough` if the shift key is held', async () => {
        const { spy, fireOnClick } = await setup();

        fireOnClick({
          shiftKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'clickThrough',
                keysHeld: ['shift'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `prevented` if the shift key is held and `onClick` is provided', async () => {
        const { spy, fireOnClick } = await setup({
          onClick: jest.fn(),
        });

        fireOnClick({
          shiftKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'prevented',
                keysHeld: ['shift'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `prevented` if the shift key is held but an `onClick` is supplied', async () => {
        const { spy, fireOnClick } = await setup({ onClick: jest.fn() });

        fireOnClick({
          shiftKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'prevented',
                keysHeld: ['shift'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `prevented` if the meta key is held but an `onClick` is supplied', async () => {
        const { spy, fireOnClick } = await setup({ onClick: jest.fn() });

        fireOnClick({
          metaKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'prevented',
                keysHeld: ['meta'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `prevented` if the ctrl key is held but an `onClick` is supplied', async () => {
        const { spy, fireOnClick } = await setup({ onClick: jest.fn() });

        fireOnClick({
          ctrlKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'prevented',
                keysHeld: ['ctrl'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` if the ctrl key is held (NOT macOS) and no `onClick` is provided', async () => {
        jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: false } as any);

        const { spy, fireOnClick } = await setup();

        fireOnClick({
          ctrlKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'clickThroughNewTabOrWindow',
                keysHeld: ['ctrl'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `clickThroughNewTab` if the ctrl key is held on macOS (if onClick is triggered and `onClick` is NOT provided)', async () => {
        jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: true } as any);

        const { spy, fireOnClick } = await setup();

        fireOnClick({
          ctrlKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'clickThroughNewTabOrWindow',
                keysHeld: ['ctrl'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      /**
       * This doesn't typically occur in practice, ctrl+left click on mac defaults to a right click outcome (context menu)
       * but it won't actually cause `onClick` to be triggered, `onMouseDown` will be triggered but the button will be 0 (left click)
       * and we are ignoring left clicks for `onMouseDown`
       *
       * Outcome here is prevented because of the hi-jack logic which prevents click through if there is an `onClick` provided
       */
      it('should fire with `clickOutcome` = `prevented` if the ctrl key is held on macOS (if onClick is triggered and `onClick` is provided)', async () => {
        jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: true } as any);

        const { spy, fireOnClick } = await setup({ onClick: jest.fn() });

        fireOnClick({
          ctrlKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'prevented',
                keysHeld: ['ctrl'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });
    });

    describe('middle click', () => {
      it('should fire with `clickOutcome` = `clickThroughNewTab` when middle clicking', async () => {
        const { spy, fireOnMouseDown } = await setup();

        fireOnMouseDown({
          button: 1,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'middle',
                clickOutcome: 'clickThroughNewTabOrWindow',
                keysHeld: [],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });
    });

    describe('right click', () => {
      it('should fire with `clickOutcome` = `contextMenu` when right clicking', async () => {
        const { spy, fireOnMouseDown } = await setup();

        fireOnMouseDown({
          button: 2,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'right',
                clickOutcome: 'contextMenu',
                keysHeld: [],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });
    });
  });

  /**
   * These cases exhibit normal click through behaviour
   * There is no exception logic that hi-jack clicks
   */
  describe.each<['hoverCard' | 'flexible', TestCaseOptions?]>([
    [
      'hoverCard',
      {
        selector: () => screen.findByTestId('smart-element-link'),
        beforeClick: async () => {
          const card = await screen.findByTestId('card-resolved-view');
          fireEvent.mouseEnter(card);
          act(() => {
            jest.advanceTimersByTime(300);
          });
        },
        context: [PACKAGE_CONTEXT, HOVER_CARD_CONTEXT],
      },
    ],
    [
      'flexible',
      {
        selector: async () => {
          await screen.findByTestId('smart-block-title-resolved-view');
          return screen.findByTestId('smart-element-link');
        },
        context: [PACKAGE_CONTEXT],
      },
    ],
  ])('with `%s` appearance with options %j', (testCase, options) => {
    const setup = async (
      props: Partial<React.ComponentProps<typeof Card>> = {},
    ) => {
      const spy = jest.fn();
      const { selector, beforeClick, featureFlags } = options ?? {};

      const getCardProps = () => {
        switch (testCase) {
          case 'hoverCard':
            return {
              appearance: 'inline',
              showHoverPreview: true,
            } as const;
          case 'flexible':
            return {
              appearance: 'inline',
              children: [<TitleBlock />],
            } as const;
          default:
            throw new Error('Unhandled test case');
        }
      };

      render(
        <AnalyticsListener onEvent={spy} channel={ANALYTICS_CHANNEL}>
          <IntlProvider locale="en">
            <Provider client={mockClient} featureFlags={featureFlags}>
              <Card
                testId="card"
                url="about:blank"
                {...props}
                {...getCardProps()}
              />
            </Provider>
          </IntlProvider>
        </AnalyticsListener>,
      );

      await beforeClick?.();

      const link = selector
        ? await selector()
        : await screen.findByRole('link');

      const fireOnClick = (options?: Parameters<typeof fireEvent.click>[1]) => {
        fireEvent.click(link, options);
      };

      const fireOnMouseDown = (
        options?: Parameters<typeof fireEvent.mouseDown>[1],
      ) => {
        fireEvent.mouseDown(link, options);
      };

      return {
        spy,
        fireOnClick,
        fireOnMouseDown,
      };
    };

    describe('left click', () => {
      it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` by default (we render target="_blank")', async () => {
        const { spy, fireOnClick } = await setup();

        fireOnClick();

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            context: options?.context,
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'clickThroughNewTabOrWindow',
                keysHeld: [],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `prevented` if the event default behaviour is prevented', async () => {
        const { spy, fireOnClick } = await setup({
          onClick: (e) => {
            e.preventDefault();
          },
        });

        fireOnClick();

        /**
         * In the case of flex UI the onClick handler is passed to the title
         * preventing clickthrough
         *
         * In the case of hoverCard the onClick handler is not provided to the title block
         *
         * In the case of the new flexible block card
         * the event there is no behaviour hi-jacking
         */
        const getTestCaseClickOutcome = () => {
          switch (testCase) {
            case 'hoverCard':
              return 'clickThroughNewTabOrWindow';
            case 'flexible':
              return 'prevented';
          }
        };

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            context: options?.context,
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: getTestCaseClickOutcome(),
                keysHeld: [],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `alt` if the alt key is held', async () => {
        const { spy, fireOnClick } = await setup();

        fireOnClick({
          altKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            context: options?.context,
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'alt',
                keysHeld: ['alt'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `alt` if the alt key is held but an `onClick` is supplied', async () => {
        const { spy, fireOnClick } = await setup({ onClick: jest.fn() });

        fireOnClick({
          altKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            context: options?.context,
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'alt',
                keysHeld: ['alt'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` if the shift key is held', async () => {
        const { spy, fireOnClick } = await setup();

        fireOnClick({
          shiftKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            context: options?.context,
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'clickThroughNewTabOrWindow',
                keysHeld: ['shift'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` if the shift key is held and `onClick` is provided', async () => {
        const { spy, fireOnClick } = await setup({
          onClick: jest.fn(),
        });

        fireOnClick({
          shiftKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            context: options?.context,
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'clickThroughNewTabOrWindow',
                keysHeld: ['shift'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` if the shift key is held but an `onClick` is supplied (windows)', async () => {
        jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: false } as any);

        const { spy, fireOnClick } = await setup({ onClick: jest.fn() });

        fireOnClick({
          shiftKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            context: options?.context,
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'clickThroughNewTabOrWindow',
                keysHeld: ['shift'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `clickThrough` if the meta key is held but an `onClick` is supplied (windows)', async () => {
        jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: false } as any);

        const { spy, fireOnClick } = await setup({ onClick: jest.fn() });

        fireOnClick({
          metaKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            context: options?.context,
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'clickThrough',
                keysHeld: ['meta'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` if the ctrl key is held but an `onClick` is supplied (windows)', async () => {
        jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: false } as any);

        const { spy, fireOnClick } = await setup({ onClick: jest.fn() });

        fireOnClick({
          ctrlKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            context: options?.context,
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'clickThroughNewTabOrWindow',
                keysHeld: ['ctrl'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `clickThrough` if the ctrl key is held (NOT macOS) and no `onClick` is provided', async () => {
        jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: false } as any);

        const { spy, fireOnClick } = await setup();

        fireOnClick({
          ctrlKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            context: options?.context,
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'clickThroughNewTabOrWindow',
                keysHeld: ['ctrl'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `clickThroughNewTab` if the ctrl key is held on macOS (if onClick is triggered and `onClick` is NOT provided)', async () => {
        jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: true } as any);

        const { spy, fireOnClick } = await setup();

        fireOnClick({
          ctrlKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            context: options?.context,
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'clickThrough',
                keysHeld: ['ctrl'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });

      it('should fire with `clickOutcome` = `clickThroughNewTab` if the ctrl key is held on macOS (if onClick is triggered and `onClick` is provided)', async () => {
        jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: true } as any);

        const { spy, fireOnClick } = await setup({ onClick: jest.fn() });

        fireOnClick({
          ctrlKey: true,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            context: options?.context,
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'left',
                clickOutcome: 'clickThrough',
                keysHeld: ['ctrl'],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });
    });

    describe('middle click', () => {
      it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` when middle clicking', async () => {
        const { spy, fireOnMouseDown } = await setup();

        fireOnMouseDown({
          button: 1,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            context: options?.context,
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'middle',
                clickOutcome: 'clickThroughNewTabOrWindow',
                keysHeld: [],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });
    });

    describe('right click', () => {
      it('should fire with `clickOutcome` = `contextMenu` when right clicking', async () => {
        const { spy, fireOnMouseDown } = await setup();

        fireOnMouseDown({
          button: 2,
        });

        expect(spy).toBeFiredWithAnalyticEventOnce(
          {
            context: options?.context,
            payload: {
              action: 'clicked',
              actionSubject: 'link',
              eventType: 'ui',
              attributes: {
                clickType: 'right',
                clickOutcome: 'contextMenu',
                keysHeld: [],
              },
            },
          },
          ANALYTICS_CHANNEL,
        );
      });
    });
  });
});
