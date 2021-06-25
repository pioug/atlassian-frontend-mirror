import React from 'react';
import AtlassianSwitcher from '../../atlassian-switcher';

import { mount } from 'enzyme';
import waitForExpect from 'wait-for-expect';
import { mockEndpoints } from '@atlaskit/atlassian-switcher-test-utils/src/mocks/mock-endpoints';
import { SwitchToSection } from '../../switcher-components/switch-to-section';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { IntlProvider } from 'react-intl';
import { AvailableProductsResponse, Product } from '../../../../types';
import { enrichFetchError } from '../../../../common/utils/fetch';
import { createAvailableProductsProvider } from '../../../../create-custom-provider';
import { createAnalyticsListenerEventsSpy } from '../../../../../test-helpers/createAnalyticsListenerEventsSpy';

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
  attributes?: Record<string, string | number>;
};

// #region Core switcher experience SLIs

[Product.JIRA, Product.CONFLUENCE].forEach((product) => {
  describe(`core switcher experience good/bad SLIs for a ${product} switcher`, () => {
    type SLIScenario = {
      scenarioName: string;
      input: {
        mockApis: Function;
        cloudID: string;
      };
      expected: {
        errorBoundaryRendered: boolean;
        eventsFired: [number, EventExpectation][];
      };
    };

    const scenarios: Array<SLIScenario> = [
      {
        scenarioName: `custom links and APS APIs succeed and there is a matching site`,
        input: {
          mockApis: () => {
            mockEndpoints(product, (originalMockData) => {
              const availableProducts = originalMockData.AVAILABLE_PRODUCTS_DATA as AvailableProductsResponse;
              return {
                ...originalMockData,
                AVAILABLE_PRODUCTS_DATA: {
                  ...availableProducts,
                  sites: [
                    {
                      ...availableProducts.sites[0],
                      cloudId: 'some-cloud-id',
                    },
                  ],
                },
              };
            });
          },
          cloudID: 'some-cloud-id',
        },
        expected: {
          errorBoundaryRendered: false,
          eventsFired: [
            [0, { actionSubject: 'errorBoundary' }],
            [
              1,
              {
                actionSubject: 'atlassianSwitcherCustomLinks',
                eventType: 'operational',
              },
            ],
            [
              1,
              {
                actionSubject: 'atlassianSwitcherCustomLinks',
                action: 'rendered',
                attributes: {
                  duration: 250,
                  bucket: '500',
                },
                eventType: 'operational',
              },
            ],
            [
              1,
              {
                actionSubject: 'atlassianSwitcher',
                eventType: 'operational',
              },
            ],
            [
              1,
              {
                actionSubject: 'atlassianSwitcher',
                action: 'rendered',
                attributes: {
                  duration: 250,
                  bucket: '500',
                },
                eventType: 'operational',
              },
            ],
          ],
        },
      },
      {
        scenarioName: `custom links and APS APIs succeed but there is no matching site`,
        input: {
          mockApis: () => {
            mockEndpoints(product, (originalMockData) => {
              const availableProducts = originalMockData.AVAILABLE_PRODUCTS_DATA as AvailableProductsResponse;
              return {
                ...originalMockData,
                AVAILABLE_PRODUCTS_DATA: {
                  ...availableProducts,
                  sites: [
                    {
                      ...availableProducts.sites[0],
                      cloudId: 'cloud-id-that-does-not-match',
                    },
                  ],
                },
              };
            });
          },
          cloudID: 'some-cloud-id',
        },
        expected: {
          errorBoundaryRendered: false,
          eventsFired: [
            [0, { actionSubject: 'errorBoundary' }],
            [
              1,
              {
                actionSubject: 'atlassianSwitcherCustomLinks',
                eventType: 'operational',
              },
            ],
            [
              1,
              {
                actionSubject: 'atlassianSwitcherCustomLinks',
                action: 'not_rendered',
                eventType: 'operational',
                attributes: {
                  notRenderedReason: 'aps_no_site_match',
                },
              },
            ],
            [
              1,
              {
                actionSubject: 'atlassianSwitcher',
                eventType: 'operational',
              },
            ],
            [
              1,
              {
                actionSubject: 'atlassianSwitcher',
                action: 'rendered',
                attributes: {
                  duration: 250,
                  bucket: '500',
                },
                eventType: 'operational',
              },
            ],
          ],
        },
      },
      {
        scenarioName: `Custom links API succeeds and APS returns a partial response with an empty list of sites`,
        input: {
          mockApis: () => {
            mockEndpoints(product, (originalMockData) => {
              const availableProducts = originalMockData.AVAILABLE_PRODUCTS_DATA as AvailableProductsResponse;
              return {
                ...originalMockData,
                AVAILABLE_PRODUCTS_DATA: {
                  ...availableProducts,
                  isPartial: true,
                  sites: [],
                },
              };
            });
          },
          cloudID: 'some-cloud-id',
        },
        expected: {
          errorBoundaryRendered: false,
          eventsFired: [
            [0, { actionSubject: 'errorBoundary' }],
            [
              1,
              {
                actionSubject: 'atlassianSwitcherCustomLinks',
                eventType: 'operational',
              },
            ],
            [
              1,
              {
                actionSubject: 'atlassianSwitcherCustomLinks',
                action: 'not_rendered',
                eventType: 'operational',
                attributes: {
                  notRenderedReason: 'aps_partial_response_empty_result',
                },
              },
            ],
            [
              0,
              {
                actionSubject: 'atlassianSwitcher',
                eventType: 'operational',
              },
            ],
          ],
        },
      },
      {
        scenarioName: `Custom links API succeeds and APS returns an empty list of sites`,
        input: {
          mockApis: () => {
            mockEndpoints(product, (originalMockData) => {
              const availableProducts = originalMockData.AVAILABLE_PRODUCTS_DATA as AvailableProductsResponse;
              return {
                ...originalMockData,
                AVAILABLE_PRODUCTS_DATA: {
                  ...availableProducts,
                  isPartial: false,
                  sites: [],
                },
              };
            });
          },
          cloudID: 'some-cloud-id',
        },
        expected: {
          errorBoundaryRendered: false,
          eventsFired: [
            [0, { actionSubject: 'errorBoundary' }],
            [
              1,
              {
                actionSubject: 'atlassianSwitcherCustomLinks',
                eventType: 'operational',
              },
            ],
            [
              1,
              {
                actionSubject: 'atlassianSwitcherCustomLinks',
                action: 'not_rendered',
                eventType: 'operational',
                attributes: {
                  notRenderedReason: 'aps_empty_result',
                },
              },
            ],
            [
              0,
              {
                actionSubject: 'atlassianSwitcher',
                eventType: 'operational',
              },
            ],
          ],
        },
      },
      {
        scenarioName: `custom links API succeeds and APS fails`,
        input: {
          mockApis: () => {
            mockEndpoints(product, (originalMockData) => ({
              ...originalMockData,
              AVAILABLE_PRODUCTS_DATA_ERROR: enrichFetchError(
                new Error('Error'),
                500,
              ),
            }));
          },
          cloudID: 'some-cloud-id',
        },
        expected: {
          errorBoundaryRendered: true,
          eventsFired: [
            [1, { actionSubject: 'errorBoundary' }],
            [
              0,
              {
                actionSubject: 'atlassianSwitcherCustomLinks',
                eventType: 'operational',
              },
            ],
            [
              0,
              {
                actionSubject: 'atlassianSwitcher',
                eventType: 'operational',
              },
            ],
          ],
        },
      },
      {
        scenarioName: `custom links API fails and APS succeeds`,
        input: {
          mockApis: () => {
            mockEndpoints(product, (originalMockData) => ({
              ...originalMockData,
              CUSTOM_LINKS_DATA_ERROR: enrichFetchError(
                new Error('Custom Links Error'),
                500,
              ),
            }));
          },
          cloudID: 'some-cloud-id',
        },
        expected: {
          errorBoundaryRendered: false,
          eventsFired: [
            [0, { actionSubject: 'errorBoundary' }],
            [
              1,
              {
                actionSubject: 'atlassianSwitcherCustomLinks',
                eventType: 'operational',
              },
            ],
            [
              1,
              {
                actionSubject: 'atlassianSwitcherCustomLinks',
                action: 'not_rendered',
                eventType: 'operational',
                attributes: {
                  notRenderedReason: 'custom_links_api_error',
                },
              },
            ],
            [
              1,
              {
                actionSubject: 'atlassianSwitcher',
                action: 'rendered',
                attributes: {
                  duration: 250,
                  bucket: '500',
                },
                eventType: 'operational',
              },
            ],
          ],
        },
      },
      {
        scenarioName: `custom links API fails and APS fails`,
        input: {
          mockApis: () => {
            mockEndpoints(product, (originalMockData) => ({
              ...originalMockData,
              AVAILABLE_PRODUCTS_DATA_ERROR: enrichFetchError(
                new Error('Error'),
                500,
              ),
              CUSTOM_LINKS_DATA_ERROR: enrichFetchError(
                new Error('Custom Links Error'),
                500,
              ),
            }));
          },
          cloudID: 'some-cloud-id',
        },
        expected: {
          errorBoundaryRendered: true,
          eventsFired: [
            [1, { actionSubject: 'errorBoundary' }],
            [
              0,
              {
                actionSubject: 'atlassianSwitcherCustomLinks',
                eventType: 'operational',
              },
            ],
            [
              0,
              {
                actionSubject: 'atlassianSwitcher',
                eventType: 'operational',
              },
            ],
          ],
        },
      },
    ];

    scenarios.forEach((scenario) => {
      describe(`- ${scenario.scenarioName}`, () => {
        test(`- the expected outcome: ${JSON.stringify(
          scenario.expected,
        )}`, async () => {
          scenario.input.mockApis();
          const { analyticsSpy } = createAnalyticsListenerEventsSpy();
          const wrapper = mount(
            <IntlProvider locale="en">
              <AnalyticsListener channel="*" onEvent={analyticsSpy.onFire}>
                <AtlassianSwitcher
                  cloudId={scenario.input.cloudID}
                  product={product}
                  triggerXFlow={jest.fn()}
                  onDiscoverMoreClicked={jest.fn()}
                  availableProductsDataProvider={createAvailableProductsProvider()}
                />
              </AnalyticsListener>
            </IntlProvider>,
          );
          await waitForExpect(() => {
            wrapper.update();
            if (scenario.expected.errorBoundaryRendered) {
              expect(
                wrapper.find('[data-testid="error-boundary"]').hostNodes(),
              ).toHaveLength(1);
              expect(wrapper.find(SwitchToSection)).toHaveLength(0);
            } else {
              expect(
                wrapper.find('[data-testid="error-boundary"]'),
              ).toHaveLength(0);
              expect(wrapper.find(SwitchToSection)).toHaveLength(1);
            }
          });
          scenario.expected.eventsFired.forEach(
            ([callTimes, expectedAnalyticsArgs]) => {
              analyticsSpy.expectTohaveBeenCalledWith(
                expectedAnalyticsArgs,
                callTimes,
              );
            },
          );
        });
      });
    });
  });
});
// #endregion
