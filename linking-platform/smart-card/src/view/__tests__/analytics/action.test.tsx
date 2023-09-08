import 'jest-extended';
import React from 'react';
import { JsonLd } from 'json-ld-types';
import { fireEvent, render, waitFor } from '@testing-library/react';
import uuid from 'uuid';

import '@atlaskit/link-test-helpers/jest';
import FabricAnalyticsListeners, {
  type AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import type { ProviderProps } from '@atlaskit/link-provider';
import { CardClient } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';

import { Card, Provider } from '../../../index';
import { fakeFactory } from '../../../utils/mocks';
import * as utils from '../../../utils';
import * as analytics from '../../../utils/analytics/analytics';
import * as modalUtils from '../../EmbedModal/utils';
import * as ufo from '../../../state/analytics/ufoExperiences';

mockSimpleIntersectionObserver();
jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock(
  'react-transition-group/Transition',
  () => (data: any) => data.children,
);
jest.mock('uuid', () => ({
  ...jest.requireActual('uuid'),
  __esModule: true,
  default: jest.fn().mockReturnValue('some-uuid-1'),
}));
jest.mock('@atlaskit/linking-common/user-agent', () => ({
  browser: jest.fn(() => ({
    mac: false,
    safari: false,
  })),
}));

const TEST_ID = 'some-id';
const EXPERIENCE_TEST_ID = 'smart-link-action-invocation';

// These values are replaced by process.env
// @see packages/linking-platform/smart-card/src/utils/analytics/analytics.ts
const EXPECTED_PACKAGE_CONTEXT = {
  componentName: 'smart-cards',
  packageName: '@atlaskit/fabric',
  packageVersion: '0.0.0',
};

// Resolved context is set on CardWithUrlContent
// @see packages/linking-platform/link-analytics/src/utils/get-resolved-attributes.ts
const EXPECTED_RESOLVED_CONTEXT = {
  destinationCategory: 'cat1',
  destinationContainerId: 'c1',
  destinationObjectId: 'o1',
  destinationObjectType: 'sharedFile',
  destinationProduct: 'p1',
  destinationSubproduct: 's1',
  destinationTenantId: 't1',
  displayCategory: 'smartLink',
  extensionKey: 'object-provider',
  status: 'resolved',
  statusDetails: null,
};

describe('actions', () => {
  const mockUrl = 'https://setup.is.the.eigth.url';
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockWindowOpen: jest.Mock;

  const toJsonLdResponse = (data?: Partial<JsonLd.Data.BaseData>) =>
    ({
      meta: {
        visibility: 'public',
        access: 'granted',
        auth: [],
        definitionId: 'd1',
        key: 'object-provider',
        tenantId: 't1',
        containerId: 'c1',
        category: 'cat1',
        product: 'p1',
        subproduct: 's1',
        objectId: 'o1',
        resourceType: 'sharedFile',
      },
      data: {
        '@context': {
          '@vocab': 'https://www.w3.org/ns/activitystreams#',
          atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
          schema: 'http://schema.org/',
        },
        '@type': 'Object',
        name: 'I love cheese',
        summary: 'Here is your serving of cheese: 🧀',
        url: 'https://some.url',
        ...data,
      },
    } as JsonLd.Response);

  const setup = ({
    props,
    featureFlags,
    response,
  }: {
    featureFlags?: Partial<ProviderProps['featureFlags']>;
    props?: Partial<React.ComponentProps<typeof Card>>;
    response?: JsonLd.Response;
  }) => {
    mockFetch = jest.fn(async () => response ?? toJsonLdResponse());
    mockClient = new (fakeFactory(mockFetch))();

    const mockAnalyticsClient: AnalyticsWebClient = {
      sendUIEvent: jest.fn().mockResolvedValue(undefined),
      sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
      sendTrackEvent: jest.fn().mockResolvedValue(undefined),
      sendScreenEvent: jest.fn().mockResolvedValue(undefined),
    };

    const renderResult = render(
      <FabricAnalyticsListeners client={mockAnalyticsClient}>
        <Provider client={mockClient} featureFlags={featureFlags}>
          <Card
            appearance="block"
            url={mockUrl}
            id="some-id"
            platform="web"
            {...props}
          />
        </Provider>
      </FabricAnalyticsListeners>,
    );

    return { ...renderResult, mockAnalyticsClient };
  };

  const getActionFnSpy = (actionType: string): jest.SpyInstance => {
    switch (actionType) {
      case 'DownloadAction':
        return jest.spyOn(utils, 'downloadUrl');
      case 'PreviewAction':
        return jest.spyOn(modalUtils, 'openEmbedModal');
      case 'ViewAction':
        return jest.spyOn(utils, 'openUrl');
      default:
        return jest.fn();
    }
  };

  beforeEach(() => {
    mockWindowOpen = jest.fn();
    global.open = mockWindowOpen;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe.each([
    ['block card', { display: 'block' }],
    // For hover card, @see packages/linking-platform/smart-card/src/view/HoverCard/__tests__/index.test.tsx
  ])(
    '%s',
    (
      componentName: string,
      componentOptions: {
        display: string;
        featureFlags?: Partial<ProviderProps['featureFlags']>;
        isFlexibleComponent?: boolean;
        props?: Partial<React.ComponentProps<typeof Card>>;
      },
    ) => {
      const { display, featureFlags, isFlexibleComponent, props } =
        componentOptions;

      describe.each([
        [
          'download url',
          {
            actionSubjectId: 'downloadDocument',
            actionType: 'DownloadAction',
            response: toJsonLdResponse({
              'schema:potentialAction': {
                '@id': 'download',
                '@type': 'DownloadAction',
                identifier: 'object-provider',
                name: 'Download',
              },
              'atlassian:downloadUrl': 'https://some-download.url',
            }),
            testId: isFlexibleComponent
              ? 'smart-action-download-action'
              : 'button-download-content',
          },
        ],
        [
          'open link in new tab',
          {
            actionSubjectId: 'shortcutGoToLink',
            actionType: 'ViewAction',
            response: toJsonLdResponse({
              'schema:potentialAction': {
                '@id': 'view',
                '@type': 'ViewAction',
                identifier: 'object-provider',
                name: 'View',
              },
            }),
            testId: isFlexibleComponent
              ? 'smart-action-view-action'
              : 'button-view-content',
          },
        ],
        [
          'open embed modal',
          {
            actionSubjectId: 'invokePreviewScreen',
            actionType: 'PreviewAction',
            response: toJsonLdResponse({
              preview: {
                '@type': 'Link',
                href: 'https://some-preview-url',
                'atlassian:supportedPlatforms': ['web'],
              },
            }),
            testId: isFlexibleComponent
              ? 'smart-action-preview-action'
              : 'button-preview-content',
          },
        ],
      ])(
        'action: %s',
        (
          actionName: string,
          testOptions: {
            actionSubjectId: string;
            actionType: string;
            testId: string;
            response: JsonLd.Response;
          },
        ) => {
          const { actionType, actionSubjectId, testId, response } = testOptions;

          it('fires button click and action resolved', async () => {
            const ufoStartSpy = jest.spyOn(ufo, 'startUfoExperience');
            const ufoSucceedSpy = jest.spyOn(ufo, 'succeedUfoExperience');
            const actionFnSpy = getActionFnSpy(
              actionType,
            ).mockImplementationOnce(async () => Promise.resolve());
            const invokeSucceedSpy = jest.spyOn(
              analytics,
              'invokeSucceededEvent',
            );

            const { findByTestId, mockAnalyticsClient } = setup({
              featureFlags,
              props,
              response,
            });
            const button = await findByTestId(testId);

            // Clearing the render experience mocks to ensure we check correct invocation
            // order of only action invocation experience.
            ufoStartSpy.mockReset();
            ufoSucceedSpy.mockReset();
            uuid.mockReturnValueOnce(EXPERIENCE_TEST_ID);

            fireEvent.click(button);
            await waitFor(() => {
              expect(invokeSucceedSpy).toHaveBeenCalledTimes(1);
            });

            expect(actionFnSpy).toHaveBeenCalledTimes(1);

            expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith({
              action: 'clicked',
              actionSubject: 'button',
              actionSubjectId,
              attributes: expect.objectContaining({
                ...EXPECTED_PACKAGE_CONTEXT,
                ...EXPECTED_RESOLVED_CONTEXT,
                actionType,
                definitionId: 'd1',
                display,
                id: TEST_ID,
                resourceType: 'sharedFile',
              }),
              source: 'unknown',
              tags: ['media'],
            });

            expect(
              mockAnalyticsClient.sendOperationalEvent,
            ).toHaveBeenCalledWith({
              action: 'resolved',
              actionSubject: 'smartLinkAction',
              attributes: expect.objectContaining({
                ...EXPECTED_PACKAGE_CONTEXT,
                ...EXPECTED_RESOLVED_CONTEXT,
                actionType,
                definitionId: 'd1',
                display,
                id: TEST_ID,
                resourceType: 'sharedFile',
              }),
              source: 'unknown',
              tags: ['media'],
            });

            expect(ufoStartSpy).toBeCalledWith(
              'smart-link-action-invocation',
              EXPERIENCE_TEST_ID,
              {
                actionType,
                display,
                extensionKey: 'object-provider',
                invokeType: 'client',
              },
            );
            expect(ufoSucceedSpy).toBeCalledWith(
              'smart-link-action-invocation',
              EXPERIENCE_TEST_ID,
            );
            expect(ufoStartSpy).toHaveBeenCalledBefore(
              ufoSucceedSpy as jest.Mock,
            );
          });

          it('fires button click and action unresolved', async () => {
            const ufoStartSpy = jest.spyOn(ufo, 'startUfoExperience');
            const ufoFailSpy = jest.spyOn(ufo, 'failUfoExperience');

            const actionFnSpy = getActionFnSpy(
              actionType,
            ).mockImplementationOnce(async () =>
              Promise.reject(new Error('something went wrong')),
            );
            const invokeFailSpy = jest.spyOn(analytics, 'invokeFailedEvent');

            const { findByTestId, mockAnalyticsClient } = setup({
              featureFlags,
              props,
              response,
            });

            const button = await findByTestId(testId);

            // Clearing the render experience mocks to ensure we check correct invocation
            // order of only action invocation experience.
            ufoStartSpy.mockReset();
            ufoFailSpy.mockReset();
            uuid.mockReturnValueOnce(EXPERIENCE_TEST_ID);

            fireEvent.click(button);
            await waitFor(() => {
              expect(invokeFailSpy).toHaveBeenCalledTimes(1);
            });

            expect(actionFnSpy).toHaveBeenCalledTimes(1);

            expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith({
              action: 'clicked',
              actionSubject: 'button',
              actionSubjectId,
              attributes: expect.objectContaining({
                ...EXPECTED_PACKAGE_CONTEXT,
                ...EXPECTED_RESOLVED_CONTEXT,
                actionType,
                definitionId: 'd1',
                display,
                id: TEST_ID,
                resourceType: 'sharedFile',
              }),
              source: 'unknown',
              tags: ['media'],
            });

            expect(
              mockAnalyticsClient.sendOperationalEvent,
            ).toHaveBeenCalledWith({
              action: 'unresolved',
              actionSubject: 'smartLinkAction',
              attributes: expect.objectContaining({
                ...EXPECTED_PACKAGE_CONTEXT,
                ...EXPECTED_RESOLVED_CONTEXT,
                actionType,
                definitionId: 'd1',
                display,
                id: TEST_ID,
                reason: 'something went wrong',
                resourceType: 'sharedFile',
              }),
              source: 'unknown',
              tags: ['media'],
            });

            expect(ufoStartSpy).toBeCalledWith(
              'smart-link-action-invocation',
              EXPERIENCE_TEST_ID,
              {
                actionType,
                display,
                extensionKey: 'object-provider',
                invokeType: 'client',
              },
            );

            expect(ufoFailSpy).toBeCalledWith(
              'smart-link-action-invocation',
              EXPERIENCE_TEST_ID,
            );

            expect(ufoStartSpy).toHaveBeenCalledBefore(ufoFailSpy as jest.Mock);
          });
        },
      );
    },
  );
});
