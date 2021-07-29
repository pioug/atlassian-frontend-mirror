import React from 'react';

import AtlassianSwitcher from '../../atlassian-switcher';

import mockCrossJoinSection from '../../../../../test-helpers/mockCrossJoinSection';
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
  fetchProductRecommendations,
} from '../../../../create-custom-provider';
import { flushAsyncOperations } from '../../../../../test-helpers/flushPromises';
import { createAnalyticsListenerEventsSpy } from '../../../../../test-helpers/createAnalyticsListenerEventsSpy';

mockCrossJoinSection();
mockSwitchToSection();
const {
  __setCrossJoinShouldThrowException,
} = require('../../../../cross-join/components/cross-join-section');
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
  JOINABLE_SITES_SECTION: '[data-testid="join__section"]',
  SWITCH_TO_SECTION: '[data-testid="switchTo__section"]',
};

type Expectations = {
  errorBoundaryRendered: boolean;
  joinableSectionRendered: boolean;
  crossJoinErrorBoundaryRendered: boolean;
  switchToRendered: boolean;
  eventsFired: {
    callTimes: number;
    eventMatching: EventExpectation;
  }[];
};
type Providers = {
  getAvailableproductsProvider: () => ReturnType<
    typeof createAvailableProductsProvider
  >;
  getJoinableSitesProvider: () => ReturnType<
    typeof createJoinableSitesProvider
  >;
};

function createDefaultJoinableSitesProvider() {
  return createJoinableSitesProvider(
    fetchProductRecommendations('/gateway/api/invitations'),
  );
}

async function executeTest(
  product: string,
  providers: Providers,
  expectations: Expectations,
) {
  const { analyticsSpy } = createAnalyticsListenerEventsSpy();
  const wrapper = mount(
    <IntlProvider locale="en">
      <AnalyticsListener channel="*" onEvent={analyticsSpy.onFire}>
        <AtlassianSwitcher
          cloudId="some-cloud-id"
          product={product}
          triggerXFlow={jest.fn()}
          onDiscoverMoreClicked={jest.fn()}
          availableProductsDataProvider={providers.getAvailableproductsProvider()}
          joinableSitesDataProvider={providers.getJoinableSitesProvider()}
        />
      </AnalyticsListener>
    </IntlProvider>,
  );
  // just flush as many async promises / timeouts as possible
  await flushAsyncOperations(6, [1000, 1000, 1000, 1000, 1000, 1000]);
  wrapper.update();
  const errorBoundary = wrapper.find(Selectors.ERROR_BOUNDARY).hostNodes();
  expect(errorBoundary).toHaveLength(
    expectations.errorBoundaryRendered ? 1 : 0,
  );
  const switchToSection = wrapper.find(Selectors.SWITCH_TO_SECTION).hostNodes();
  expect(switchToSection).toHaveLength(expectations.switchToRendered ? 1 : 0);
  const joinableSitesSection = wrapper
    .find(Selectors.JOINABLE_SITES_SECTION)
    .hostNodes();
  if (
    expectations.joinableSectionRendered &&
    !expectations.crossJoinErrorBoundaryRendered
  ) {
    expect(joinableSitesSection).toHaveLength(1);
  } else {
    expect(joinableSitesSection).toHaveLength(0);
  }

  expectations.eventsFired.forEach(({ callTimes, eventMatching }) => {
    analyticsSpy.expectTohaveBeenCalledWith(eventMatching, callTimes);
  });
}

[
  Product.BITBUCKET,
  Product.CONFLUENCE,
  Product.JIRA,
  Product.TRELLO,
  Product.START,
].forEach((product) => {
  describe(`discover section good/bad SLIs in ${product}\'s switcher`, () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });
    afterAll(() => {
      jest.useRealTimers();
    });
    beforeEach(() => {
      mockEndpoints(product, (originalData) => ({
        ...originalData,
        PRODUCT_RECOMMENDATIONS_DATA: {
          capability: {
            DIRECT_ACCESS: [
              {
                resourceId: 'ari:cloud:jira-software::site/example-cloud-id',
                userAccessLevel: 'EXTERNAL',
                roleAri: 'ari:cloud:jira-software::role/product/member',
                url:
                  'https://example0.jira-dev.com/secure/BrowseProjects.jspa?selectedProjectType=software',
                displayName: 'example0',
                avatarUrl:
                  'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/lightbulb.png',
              },
            ],
          },
        },
      }));
      __setSwitchToShouldThrowException(false);
      __setCrossJoinShouldThrowException(false);
    });
    test('If joinable sites data provider fails, then emit bad joinable site SLI', async () => {
      mockEndpoints(product, (originalData) => ({
        ...originalData,
        PRODUCT_RECOMMENDATIONS_DATA: new Promise((_, reject) => {
          setTimeout(
            () => reject(enrichFetchError(new Error('Error'), 500)),
            5000,
          );
        }),
      }));
      await executeTest(
        product,
        {
          getAvailableproductsProvider: () => createAvailableProductsProvider(),
          getJoinableSitesProvider: createDefaultJoinableSitesProvider,
        },
        {
          errorBoundaryRendered: false,
          joinableSectionRendered: false,
          switchToRendered: true,
          crossJoinErrorBoundaryRendered: false,
          eventsFired: [
            {
              callTimes: 1,
              eventMatching: {
                actionSubject: 'atlassianSwitcher',
                action: 'rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'atlassianSwitcher',
                action: 'not_rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'atlassianSwitcherJoinableSites',
                action: 'rendered',
              },
            },
            {
              callTimes: 1,
              eventMatching: {
                actionSubject: 'atlassianSwitcherJoinableSites',
                action: 'not_rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'errorBoundary',
                action: 'rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'crossJoinErrorBoundary',
                action: 'rendered',
              },
            },
          ],
        },
      );
    });
    test('If joinable section error throws an error, then emit crossjoin error boundary SLI', async () => {
      __setCrossJoinShouldThrowException(true);
      await executeTest(
        product,
        {
          getAvailableproductsProvider: () => createAvailableProductsProvider(),
          getJoinableSitesProvider: createDefaultJoinableSitesProvider,
        },
        {
          errorBoundaryRendered: false,
          joinableSectionRendered: false,
          switchToRendered: true,
          crossJoinErrorBoundaryRendered: true,
          eventsFired: [
            {
              callTimes: 1,
              eventMatching: {
                actionSubject: 'atlassianSwitcher',
                action: 'rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'atlassianSwitcher',
                action: 'not_rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'atlassianSwitcherJoinableSites',
                action: 'rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'atlassianSwitcherJoinableSites',
                action: 'not_rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'errorBoundary',
                action: 'rendered',
              },
            },
            {
              callTimes: 1,
              eventMatching: {
                actionSubject: 'crossJoinErrorBoundary',
                action: 'rendered',
              },
            },
          ],
        },
      );
    });
    test('If APS provider fails, then do not emit bad joinable site SLI - only emit error boundary SLI', async () => {
      mockEndpoints(product, (originalMockData) => ({
        ...originalMockData,
        AVAILABLE_PRODUCTS_DATA_ERROR: new Promise((resolve) => {
          setTimeout(
            () => resolve(enrichFetchError(new Error('Error'), 500)),
            5000,
          );
        }),
      }));
      await executeTest(
        product,
        {
          getAvailableproductsProvider: () => createAvailableProductsProvider(),
          getJoinableSitesProvider: createDefaultJoinableSitesProvider,
        },
        {
          errorBoundaryRendered: true,
          joinableSectionRendered: false,
          switchToRendered: false,
          crossJoinErrorBoundaryRendered: false,
          eventsFired: [
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'atlassianSwitcher',
                action: 'rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'atlassianSwitcher',
                action: 'not_rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'atlassianSwitcherJoinableSites',
                action: 'rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'atlassianSwitcherJoinableSites',
                action: 'not_rendered',
              },
            },
            {
              callTimes: 1,
              eventMatching: {
                actionSubject: 'errorBoundary',
                action: 'rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'crossJoinErrorBoundary',
                action: 'rendered',
              },
            },
          ],
        },
      );
    });
    test('If APS and joinable site providers succeed then emit good joinable sites SLI', async () => {
      await executeTest(
        product,
        {
          getAvailableproductsProvider: () => createAvailableProductsProvider(),
          getJoinableSitesProvider: createDefaultJoinableSitesProvider,
        },
        {
          errorBoundaryRendered: false,
          joinableSectionRendered: true,
          switchToRendered: true,
          crossJoinErrorBoundaryRendered: false,
          eventsFired: [
            {
              callTimes: 1,
              eventMatching: {
                actionSubject: 'atlassianSwitcher',
                action: 'rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'atlassianSwitcher',
                action: 'not_rendered',
              },
            },
            {
              callTimes: 1,
              eventMatching: {
                actionSubject: 'atlassianSwitcherJoinableSites',
                action: 'rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'atlassianSwitcherJoinableSites',
                action: 'not_rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'errorBoundary',
                action: 'rendered',
              },
            },
            {
              callTimes: 0,
              eventMatching: {
                actionSubject: 'crossJoinErrorBoundary',
                action: 'rendered',
              },
            },
          ],
        },
      );
    });
  });
});
