import React from 'react';
import { shallow } from 'enzyme';
import AtlassianSwitcher from '../../atlassian-switcher';

import { mount } from 'enzyme';
import waitForExpect from 'wait-for-expect';
import { mockEndpoints } from '@atlaskit/atlassian-switcher-test-utils/src/mocks/mock-endpoints';
import { SwitchToSection } from '../../switcher-components/switch-to-section';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { IntlProvider } from 'react-intl';
import { AvailableProductsResponse, Product } from '../../../../types';
import { enrichFetchError } from '../../../../common/utils/fetch';
import { createAvailableProductsProvider } from '../../../../create-custom-provider';

// Just a helper function for better readibility in tests
const createAnalyticsEventsSpy = () => {
  const spyFn = jest.fn();
  const handlerFn = (event: UIAnalyticsEvent) => {
    spyFn(event.payload);
  };
  const expectAnalyticsToHaveBeenCalledWith = (
    expectedArgs: Record<string, unknown>,
    expectedCallTimes: number,
  ) => {
    const keysToCompare = Object.keys(expectedArgs);
    const matchingCalls = spyFn.mock.calls.filter(([actualArg]) => {
      return keysToCompare.every(
        keyToCompare => expectedArgs[keyToCompare] === actualArg[keyToCompare],
      );
    });
    function prettyDebug(callCount: number) {
      return `${JSON.stringify(expectedArgs)}, called ${callCount} times`;
    }
    return expect(prettyDebug(matchingCalls.length)).toEqual(
      prettyDebug(expectedCallTimes),
    );
  };

  return {
    handlerFn,
    expectAnalyticsToHaveBeenCalledWith,
  };
};

const noop = () => void 0;

// actionSubject, eventType
type EventExpectation = {
  actionSubject?: string;
  action?: string;
  eventType?: string;
  attributes?: Record<string, string | number>;
};

describe('Atlassian Switcher', () => {
  it('basic snapshot', () => {
    const switcher = shallow(
      <AtlassianSwitcher
        product="jira"
        cloudId="CLOUD_ID"
        triggerXFlow={noop}
      />,
    );
    expect(switcher).toMatchSnapshot();
  });
  [Product.JIRA, Product.CONFLUENCE].forEach(product => {
    describe(`good/bad SLIs for a ${product} switcher`, () => {
      const scenarios: Array<{
        scenarioName: string;
        input: {
          mockApis: Function;
          cloudID: string;
        };
        expect: {
          errorBoundaryRendered: boolean;
          eventsSent: [number, EventExpectation][];
        };
      }> = [
        {
          scenarioName: `custom links and APS APIs succeed and there is a matching site`,
          input: {
            mockApis: () => {
              mockEndpoints(product, originalMockData => {
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
          expect: {
            errorBoundaryRendered: false,
            eventsSent: [
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
              mockEndpoints(product, originalMockData => {
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
          expect: {
            errorBoundaryRendered: false,
            eventsSent: [
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
                  eventType: 'operational',
                },
              ],
            ],
          },
        },
        // {
        //   scenarioName: `custom links API succeeds and APS returns an empty list of sites`,
        //   input: {
        //     mockApis: () => {
        //       mockEndpoints(product, (originalMockData) => {
        //         const availableProducts = originalMockData.AVAILABLE_PRODUCTS_DATA as AvailableProductsResponse;
        //         return {
        //           ...originalMockData,
        //           AVAILABLE_PRODUCTS_DATA: {
        //             ...availableProducts,
        //             sites: [],
        //           }
        //         };
        //       });
        //     },
        //     cloudID: 'some-cloud-id',
        //   },
        //   expect: {
        //     errorBoundaryRendered: false,
        //     events: [
        //       ['errorBoundary', 'rendered', 'operational', 0],
        //       ['atlassianSwitcher', 'rendered', 'operational', 1],
        //       ['atlassianSwitcherCustomLinks', 'rendered', 'operational', 1]
        //     ]
        //   },
        // },
        {
          scenarioName: `custom links API succeeds and APS fails`,
          input: {
            mockApis: () => {
              mockEndpoints(product, originalMockData => ({
                ...originalMockData,
                AVAILABLE_PRODUCTS_DATA_ERROR: enrichFetchError(
                  new Error('Error'),
                  500,
                ),
              }));
            },
            cloudID: 'some-cloud-id',
          },
          expect: {
            errorBoundaryRendered: true,
            eventsSent: [
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
              mockEndpoints(product, originalMockData => ({
                ...originalMockData,
                CUSTOM_LINKS_DATA_ERROR: enrichFetchError(
                  new Error('Custom Links Error'),
                  500,
                ),
              }));
            },
            cloudID: 'some-cloud-id',
          },
          expect: {
            errorBoundaryRendered: false,
            eventsSent: [
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
                },
              ],
              [
                1,
                {
                  actionSubject: 'atlassianSwitcher',
                  action: 'rendered',
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
              mockEndpoints(product, originalMockData => ({
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
          expect: {
            errorBoundaryRendered: true,
            eventsSent: [
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

      scenarios.forEach(scenario => {
        describe(`- ${scenario.scenarioName}`, () => {
          test(`- the expected outcome: ${JSON.stringify(
            scenario.expect,
          )}`, async () => {
            scenario.input.mockApis();
            const {
              handlerFn,
              expectAnalyticsToHaveBeenCalledWith,
            } = createAnalyticsEventsSpy();
            const wrapper = mount(
              <IntlProvider locale="en">
                <AnalyticsListener channel="*" onEvent={handlerFn}>
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
              if (scenario.expect.errorBoundaryRendered) {
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
            scenario.expect.eventsSent.forEach(
              ([callTimes, expectedAnalyticsArgs]) => {
                expectAnalyticsToHaveBeenCalledWith(
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
});
