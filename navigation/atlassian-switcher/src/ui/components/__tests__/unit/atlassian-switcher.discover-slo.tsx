import React from 'react';

import AtlassianSwitcher from '../../atlassian-switcher';

import mockCrossFlowSection from '../../../../../test-helpers/mockCrossFlowSection';
import mockSwitchToSection from '../../../../../test-helpers/mockSwitchToSection';

import { mount } from 'enzyme';
import { mockEndpoints } from '@atlaskit/atlassian-switcher-test-utils/src/mocks/mock-endpoints';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { IntlProvider } from 'react-intl';
import { Product } from '../../../../types';
import { enrichFetchError } from '../../../../common/utils/fetch';
import {
  createAvailableProductsProvider,
  createJoinableSitesProvider,
} from '../../../../create-custom-provider';
import { flushAsyncOperations } from '../../../../../test-helpers/flushPromises';
import { createAnalyticsListenerEventsSpy } from '../../../../../test-helpers/createAnalyticsListenerEventsSpy';
import { fetchXflowSettings } from '../../../../common/providers/instance-data-providers';

mockCrossFlowSection();
mockSwitchToSection();
const {
  __setCrossFlowShouldThrowException,
} = require('../../../../cross-flow/components/cross-flow-section');
const {
  __setSwitchToShouldThrowException,
} = require('../../switcher-components/switch-to-section');

const mockNow = jest.fn();

jest.mock('../../../../common/utils/performance-now.ts', () => ({
  now: mockNow,
}));

beforeEach(() => {
  mockNow.mockReset().mockReturnValueOnce(0).mockReturnValue(250);
});

// actionSubject, eventType
type EventExpectation = {
  actionSubject?: string;
  actionSubjectId?: string;
  action?: string;
  eventType?: string;
  attributes?: Record<string, string | boolean | number>;
};

const Selectors = {
  ERROR_BOUNDARY: '[data-testid="error-boundary"]',
  DISCOVER_SECTION: '[data-testid="discover__section"]',
  DISCOVER_SECTION_SUGGESTED_PRODUCT_LINK:
    '[data-testid="suggested-product__link"]',
  JOINABLE_SITES_SECTION: '[data-testid="join__section"]',
  SWITCH_TO_SECTION: '[data-testid="switchTo__section"]',
};

[
  Product.BITBUCKET,
  Product.CONFLUENCE,
  Product.HOME,
  Product.JIRA,
  Product.SITE_ADMIN,
  Product.TRELLO,
  Product.START,
].forEach((product) => {
  describe(`discover section good/bad SLIs in ${product}\'s switcher`, () => {
    type DiscoverMoreSLIScenario = {
      scenarioName: string;
      input: {
        setup: () => void;
        getAvailableproductsProvider: () => ReturnType<
          typeof createAvailableProductsProvider
        >;
        getJoinableSitesProvider: () => ReturnType<
          typeof createJoinableSitesProvider
        >;
      };
      expected: {
        errorBoundaryRendered: boolean;
        suggestedProductsRendered: boolean;
        discoverSectionRendered: boolean;
        discoverErrorBoundaryRendered: boolean;
        switchToRendered: boolean;
        eventsFired: [number, EventExpectation][];
      };
    };
    beforeAll(() => {
      jest.useFakeTimers();
    });
    afterAll(() => {
      jest.useRealTimers();
    });
    beforeEach(() => {
      mockEndpoints(product);
      __setSwitchToShouldThrowException(false);
      __setCrossFlowShouldThrowException(false);
    });
    const discoverMoreSLIScenarios: DiscoverMoreSLIScenario[] = [
      {
        scenarioName:
          'If APS and joinable sites resolve, then discover section renders. Good discover section SLI is fired',
        input: {
          setup: () => {},
          getAvailableproductsProvider: () => createAvailableProductsProvider(),
          getJoinableSitesProvider: () => createJoinableSitesProvider(),
        },
        expected: {
          errorBoundaryRendered: false,
          suggestedProductsRendered: false,
          switchToRendered: true,
          discoverSectionRendered: true,
          discoverErrorBoundaryRendered: false,
          eventsFired: [
            [0, { actionSubject: 'errorBoundary' }],
            [
              1,
              {
                actionSubject: 'atlassianSwitcherDiscoverMore',
                action: 'rendered',
              },
            ],
            [
              0,
              {
                actionSubject: 'atlassianSwitcherDiscoverMore',
                action: 'not_rendered',
              },
            ],
            [1, { actionSubject: 'atlassianSwitcher', action: 'rendered' }],
            [0, { actionSubject: 'atlassianSwitcher', action: 'not_rendered' }],
          ],
        },
      },
      {
        scenarioName:
          'If APS resolves first, but then joinable sites fail, then discover section renders without suggested products. Bad discover section SLI is fired',
        input: {
          setup: () => {},
          getAvailableproductsProvider: () => createAvailableProductsProvider(),
          getJoinableSitesProvider: () =>
            createJoinableSitesProvider(
              () =>
                new Promise((_, reject) => {
                  setTimeout(() => {
                    reject(new Error('Joinable sites fail'));
                  }, 5000);
                }),
            ),
        },
        expected: {
          errorBoundaryRendered: false,
          suggestedProductsRendered: false,
          switchToRendered: true,
          discoverSectionRendered: true,
          discoverErrorBoundaryRendered: false,
          eventsFired: [
            [0, { actionSubject: 'errorBoundary' }],
            [
              0,
              {
                actionSubject: 'atlassianSwitcherDiscoverMore',
                action: 'rendered',
              },
            ],
            [
              1,
              {
                actionSubject: 'atlassianSwitcherDiscoverMore',
                action: 'not_rendered',
              },
            ],
            [1, { actionSubject: 'atlassianSwitcher', action: 'rendered' }],
            [0, { actionSubject: 'atlassianSwitcher', action: 'not_rendered' }],
          ],
        },
      },
      {
        scenarioName:
          'If APS fails, then switcher fails with a top level boundary. Discover section SLIs are not fired. Instead, top error boundary bad SLI is fired.',
        input: {
          setup: () => {
            mockEndpoints(product, (originalMockData) => ({
              ...originalMockData,
              AVAILABLE_PRODUCTS_DATA_ERROR: new Promise((resolve) => {
                setTimeout(
                  () => resolve(enrichFetchError(new Error('Error'), 500)),
                  5000,
                );
              }),
            }));
          },
          getAvailableproductsProvider: () => createAvailableProductsProvider(),
          getJoinableSitesProvider: () =>
            createJoinableSitesProvider(() => Promise.resolve({ sites: [] })),
        },
        expected: {
          errorBoundaryRendered: true,
          suggestedProductsRendered: false,
          switchToRendered: false,
          discoverSectionRendered: false,
          discoverErrorBoundaryRendered: false,
          eventsFired: [
            [1, { actionSubject: 'errorBoundary' }],
            [
              1,
              {
                actionSubject: 'errorBoundary',
                attributes: { isDiscoverExpected: true },
              },
            ],
            [0, { actionSubject: 'atlassianSwitcherDiscoverMore' }],
            [0, { actionSubject: 'atlassianSwitcher', action: 'rendered' }],
            [0, { actionSubject: 'atlassianSwitcher', action: 'not_rendered' }],
          ],
        },
      },
      {
        scenarioName:
          'If switch to section renders first and throws a Javascript exception, discover section and its trackers do not get an opportunity to render. Top error boundary bad SLI is fired',
        input: {
          setup: () => {
            __setSwitchToShouldThrowException(true);
          },
          getAvailableproductsProvider: () => createAvailableProductsProvider(),
          getJoinableSitesProvider: () =>
            createJoinableSitesProvider(() => Promise.resolve({ sites: [] })),
        },
        expected: {
          errorBoundaryRendered: true,
          suggestedProductsRendered: false,
          switchToRendered: false,
          discoverSectionRendered: false,
          discoverErrorBoundaryRendered: false,
          eventsFired: [
            [1, { actionSubject: 'errorBoundary' }],
            [
              1,
              {
                actionSubject: 'errorBoundary',
                attributes: { isDiscoverExpected: true },
              },
            ],
            [0, { actionSubject: 'atlassianSwitcherDiscoverMore' }],
            [0, { actionSubject: 'atlassianSwitcher', action: 'rendered' }],
            [0, { actionSubject: 'atlassianSwitcher', action: 'not_rendered' }],
          ],
        },
      },
      {
        scenarioName:
          'If there is an internal javascript error inside discover section rendering logic, render switch to, crossflow error boundary. Emit good switcher SLI and bad crossflow errorBoundary SLI.',
        input: {
          setup: () => {
            __setCrossFlowShouldThrowException(true);
          },
          getAvailableproductsProvider: () => createAvailableProductsProvider(),
          getJoinableSitesProvider: () =>
            createJoinableSitesProvider(
              () =>
                new Promise((resolve) => {
                  setTimeout(() => {
                    resolve({ sites: [] });
                  }, 5000);
                }),
            ),
        },
        expected: {
          errorBoundaryRendered: false,
          suggestedProductsRendered: false,
          switchToRendered: true,
          discoverSectionRendered: false,
          discoverErrorBoundaryRendered: true,
          eventsFired: [
            [0, { actionSubject: 'errorBoundary', action: 'rendered' }],
            [
              1,
              { actionSubject: 'crossFlowErrorBoundary', action: 'rendered' },
            ],
            [
              0,
              {
                actionSubject: 'atlassianSwitcherDiscoverMore',
                action: 'rendered',
              },
            ],
            [
              0,
              {
                actionSubject: 'atlassianSwitcherDiscoverMore',
                action: 'not_rendered',
              },
            ],
            [1, { actionSubject: 'atlassianSwitcher', action: 'rendered' }],
            [0, { actionSubject: 'atlassianSwitcher', action: 'not_rendered' }],
          ],
        },
      },
    ];

    if (product !== Product.TRELLO) {
      discoverMoreSLIScenarios.push(
        {
          scenarioName:
            'If XFLOW settings fails, then discover section renders without suggested products. Bad discover section SLI is fired',
          input: {
            setup: () => {
              fetchXflowSettings.reset();
              mockEndpoints(product, (originalMockData) => ({
                ...originalMockData,
                XFLOW_SETTINGS: new Promise((_, reject) => {
                  setTimeout(
                    () => reject(enrichFetchError(new Error('Error'), 500)),
                    5000,
                  );
                }),
              }));
            },
            getAvailableproductsProvider: () =>
              createAvailableProductsProvider(),
            getJoinableSitesProvider: () => createJoinableSitesProvider(),
          },
          expected: {
            errorBoundaryRendered: false,
            suggestedProductsRendered: false,
            switchToRendered: true,
            discoverSectionRendered: true,
            discoverErrorBoundaryRendered: false,
            eventsFired: [
              [0, { actionSubject: 'errorBoundary' }],
              [
                0,
                {
                  actionSubject: 'atlassianSwitcherDiscoverMore',
                  action: 'rendered',
                },
              ],
              [
                1,
                {
                  actionSubject: 'atlassianSwitcherDiscoverMore',
                  action: 'not_rendered',
                },
              ],
              [1, { actionSubject: 'atlassianSwitcher', action: 'rendered' }],
              [
                0,
                { actionSubject: 'atlassianSwitcher', action: 'not_rendered' },
              ],
            ],
          },
        },
        {
          scenarioName:
            'If XFLOW is disabled, then discover section renders without suggested products. Good discover section SLI is fired',
          input: {
            setup: () => {
              mockEndpoints(product, (originalMockData) => ({
                ...originalMockData,
                XFLOW_SETTINGS: {
                  'product-suggestions-enabled': false,
                },
              }));
            },
            getAvailableproductsProvider: () =>
              createAvailableProductsProvider(),
            getJoinableSitesProvider: () => createJoinableSitesProvider(),
          },
          expected: {
            errorBoundaryRendered: false,
            suggestedProductsRendered: false,
            switchToRendered: true,
            discoverSectionRendered: true,
            discoverErrorBoundaryRendered: false,
            eventsFired: [
              [0, { actionSubject: 'errorBoundary' }],
              [
                1,
                {
                  actionSubject: 'atlassianSwitcherDiscoverMore',
                  action: 'rendered',
                },
              ],
              [
                0,
                {
                  actionSubject: 'atlassianSwitcherDiscoverMore',
                  action: 'not_rendered',
                },
              ],
              [1, { actionSubject: 'atlassianSwitcher', action: 'rendered' }],
              [
                0,
                { actionSubject: 'atlassianSwitcher', action: 'not_rendered' },
              ],
            ],
          },
        },
      );
    }
    discoverMoreSLIScenarios.forEach(({ input, expected, scenarioName }) => {
      test(scenarioName, async () => {
        input.setup();
        const { analyticsSpy } = createAnalyticsListenerEventsSpy();
        const wrapper = mount(
          <IntlProvider locale="en">
            <AnalyticsListener channel="*" onEvent={analyticsSpy.onFire}>
              <AtlassianSwitcher
                cloudId="some-cloud-id"
                product={product}
                triggerXFlow={jest.fn()}
                onDiscoverMoreClicked={jest.fn()}
                availableProductsDataProvider={input.getAvailableproductsProvider()}
                joinableSitesDataProvider={input.getJoinableSitesProvider()}
              />
            </AnalyticsListener>
          </IntlProvider>,
        );
        // just flush as many async promises / timeouts as possible
        await flushAsyncOperations(6, [1000, 1000, 1000, 1000, 1000, 1000]);
        wrapper.update();
        if (expected.errorBoundaryRendered) {
          expect(
            wrapper.find(Selectors.ERROR_BOUNDARY).hostNodes(),
          ).toHaveLength(1);
        } else {
          expect(
            wrapper.find(Selectors.ERROR_BOUNDARY).hostNodes(),
          ).toHaveLength(0);
        }
        if (expected.switchToRendered) {
          expect(
            wrapper.find(Selectors.SWITCH_TO_SECTION).hostNodes(),
          ).toHaveLength(1);
        } else {
          expect(
            wrapper.find(Selectors.SWITCH_TO_SECTION).hostNodes(),
          ).toHaveLength(0);
        }
        if (expected.discoverSectionRendered) {
          expect(
            wrapper.find(Selectors.DISCOVER_SECTION).hostNodes(),
          ).toHaveLength(1);
        } else {
          expect(
            wrapper.find(Selectors.DISCOVER_SECTION).hostNodes(),
          ).toHaveLength(0);
        }
        if (expected.suggestedProductsRendered) {
          expect(
            wrapper
              .find(Selectors.DISCOVER_SECTION_SUGGESTED_PRODUCT_LINK)
              .hostNodes().length,
          ).toBeGreaterThan(0);
        } else {
          expect(
            wrapper
              .find(Selectors.DISCOVER_SECTION_SUGGESTED_PRODUCT_LINK)
              .hostNodes(),
          ).toHaveLength(0);
        }
        if (
          expected.errorBoundaryRendered ||
          expected.discoverErrorBoundaryRendered
        ) {
          expect(wrapper.find('CrossFlowSection').length).toBe(0);
        } else {
          expect(
            wrapper.find('CrossFlowSection').length,
          ).toBeGreaterThanOrEqual(1);
        }
        expected.eventsFired.forEach(([callTimes, expectedAnalyticsArgs]) => {
          analyticsSpy.expectTohaveBeenCalledWith(
            expectedAnalyticsArgs,
            callTimes,
          );
        });
      });
    });
  });
});
