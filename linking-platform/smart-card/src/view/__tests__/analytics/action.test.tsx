import 'jest-extended';
import React from 'react';
import { type JsonLd } from 'json-ld-types';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import uuid from 'uuid';

import '@atlaskit/link-test-helpers/jest';
import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import type { ProviderProps } from '@atlaskit/link-provider';
import { SmartLinkActionType } from '@atlaskit/linking-types';
import { type CardClient } from '@atlaskit/link-provider';
import { flushPromises, mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';

import { ActionName, Card, Provider, TitleBlock } from '../../../index';
import * as useInvoke from '../../../state/hooks/use-invoke';
import { fakeFactory } from '../../../utils/mocks';
import * as utils from '../../../utils';
import * as analytics from '../../../utils/analytics/analytics';
import * as modalUtils from '../../EmbedModal/utils';
import * as ufo from '../../../state/analytics/ufoExperiences';

mockSimpleIntersectionObserver();
jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) => data.children);
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

// These values are set by media analytic channel
const EXPECTED_CHANNEL_CONTEXT = {
	source: 'unknown',
	tags: ['media'],
};

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

const EXPECTED_COMMON_ATTRIBUTES = {
	...EXPECTED_PACKAGE_CONTEXT,
	...EXPECTED_RESOLVED_CONTEXT,
	// These values are set in commonAttributes in useSmartLinkAnalytics.ts
	definitionId: 'd1',
	resourceType: 'sharedFile',
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
		}) as JsonLd.Response;

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
					<Card appearance="block" url={mockUrl} id="some-id" platform="web" {...props} />
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
		[
			'flexible block card',
			{
				display: 'block',
				featureFlags: { enableFlexibleBlockCard: true },
				isFlexibleComponent: true,
				props: { showServerActions: true },
			},
		],
		[
			'flexible card',
			{
				display: 'flexible',
				isFlexibleComponent: true,
				props: {
					children: (
						<TitleBlock
							actions={[
								{ name: ActionName.FollowAction },
								{ name: ActionName.DownloadAction },
								{ name: ActionName.PreviewAction },
							]}
						/>
					),
					showServerActions: true,
				},
			},
		],
		// For hover card, @see packages/linking-platform/smart-card/src/view/HoverCard/__tests__/index.test.tsx
		// For embed modal, @see packages/linking-platform/smart-card/src/view/EmbedModal/__tests__/index.test.tsx
	])(
		'%s',
		(
			componentName: string,
			componentOptions: {
				display: string;
				featureFlags?: Partial<ProviderProps['featureFlags']>;
				isFlexibleComponent?: boolean;
				props?: Partial<React.ComponentProps<typeof Card>>;
				resolvedTestId?: string;
			},
		) => {
			const {
				display,
				featureFlags,
				isFlexibleComponent,
				props,
				resolvedTestId = 'smart-block-title-resolved-view',
			} = componentOptions;

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
						testId: isFlexibleComponent ? 'smart-action-preview-action' : 'button-preview-content',
					},
				],
			])(
				'client action: %s',
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
						const actionFnSpy = getActionFnSpy(actionType).mockImplementationOnce(async () =>
							Promise.resolve(),
						);
						const invokeSucceedSpy = jest.spyOn(analytics, 'invokeSucceededEvent');

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
							...EXPECTED_CHANNEL_CONTEXT,
							action: 'clicked',
							actionSubject: 'button',
							actionSubjectId,
							attributes: expect.objectContaining({
								...EXPECTED_COMMON_ATTRIBUTES,
								actionType,
								display,
								id: TEST_ID,
							}),
						});

						expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith({
							...EXPECTED_CHANNEL_CONTEXT,
							action: 'resolved',
							actionSubject: 'smartLinkAction',
							attributes: expect.objectContaining({
								...EXPECTED_COMMON_ATTRIBUTES,
								actionType,
								display,
								id: TEST_ID,
							}),
						});

						expect(ufoStartSpy).toBeCalledWith('smart-link-action-invocation', EXPERIENCE_TEST_ID, {
							actionType,
							display,
							extensionKey: 'object-provider',
							invokeType: 'client',
						});
						expect(ufoSucceedSpy).toBeCalledWith(
							'smart-link-action-invocation',
							EXPERIENCE_TEST_ID,
						);
						expect(ufoStartSpy).toHaveBeenCalledBefore(ufoSucceedSpy as jest.Mock);
					});

					it('fires button click and action unresolved', async () => {
						const ufoStartSpy = jest.spyOn(ufo, 'startUfoExperience');
						const ufoFailSpy = jest.spyOn(ufo, 'failUfoExperience');

						const actionFnSpy = getActionFnSpy(actionType).mockImplementationOnce(async () =>
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
							...EXPECTED_CHANNEL_CONTEXT,
							action: 'clicked',
							actionSubject: 'button',
							actionSubjectId,
							attributes: expect.objectContaining({
								...EXPECTED_COMMON_ATTRIBUTES,
								actionType,
								display,
								id: TEST_ID,
							}),
						});

						expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith({
							...EXPECTED_CHANNEL_CONTEXT,
							action: 'unresolved',
							actionSubject: 'smartLinkAction',
							attributes: expect.objectContaining({
								...EXPECTED_COMMON_ATTRIBUTES,
								actionType,
								display,
								id: TEST_ID,
								reason: 'something went wrong',
							}),
						});

						expect(ufoStartSpy).toBeCalledWith('smart-link-action-invocation', EXPERIENCE_TEST_ID, {
							actionType,
							display,
							extensionKey: 'object-provider',
							invokeType: 'client',
						});

						expect(ufoFailSpy).toBeCalledWith('smart-link-action-invocation', EXPERIENCE_TEST_ID);

						expect(ufoStartSpy).toHaveBeenCalledBefore(ufoFailSpy as jest.Mock);
					});
				},
			);

			if (props?.showServerActions) {
				describe.each([
					[
						'follow',
						{
							actionSubjectId: 'smartLinkFollowButton',
							actionType: 'Follow',
							response: toJsonLdResponse({
								'atlassian:serverAction': [
									{
										'@type': 'UpdateAction',
										name: 'UpdateAction',
										dataUpdateAction: {
											'@type': 'UpdateAction',
											name: SmartLinkActionType.FollowEntityAction,
										},
										resourceIdentifiers: { ari: 'some-id' },
										refField: 'button',
									},
								],
							}),
							testId: 'smart-action-follow-action',
						},
					],
					[
						'unfollow',
						{
							actionSubjectId: 'smartLinkFollowButton',
							actionType: 'Unfollow',
							response: toJsonLdResponse({
								'atlassian:serverAction': [
									{
										'@type': 'UpdateAction',
										name: 'UpdateAction',
										dataUpdateAction: {
											'@type': 'UpdateAction',
											name: SmartLinkActionType.UnfollowEntityAction,
										},
										resourceIdentifiers: { ari: 'some-id' },
										refField: 'button',
									},
								],
							}),
							testId: 'smart-action-follow-action',
						},
					],
				])(
					'server action: %s',
					(
						actionName,
						testOptions: {
							actionSubjectId: string;
							actionType: string;
							response: JsonLd.Response;
							testId: string;
						},
					) => {
						const { actionSubjectId, actionType, response, testId } = testOptions;
						const setupOptions = { featureFlags, props, response };

						it('fires button click and track success', async () => {
							jest.spyOn(useInvoke, 'default').mockReturnValue(jest.fn());

							const { findByTestId, mockAnalyticsClient } = setup(setupOptions);

							await findByTestId(resolvedTestId);
							const button = await findByTestId(testId);
							act(() => {
								fireEvent.click(button);
							});
							await flushPromises();

							expect(mockAnalyticsClient.sendUIEvent).toHaveBeenLastCalledWith({
								...EXPECTED_CHANNEL_CONTEXT,
								action: 'clicked',
								actionSubject: 'button',
								actionSubjectId,
								attributes: expect.objectContaining({
									...EXPECTED_COMMON_ATTRIBUTES,
									display,
									id: TEST_ID,
								}),
							});

							expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenNthCalledWith(1, {
								...EXPECTED_CHANNEL_CONTEXT,
								action: 'started',
								actionSubject: 'smartLinkQuickAction',
								attributes: expect.objectContaining({
									...EXPECTED_COMMON_ATTRIBUTES,
									display,
									id: TEST_ID,
									smartLinkActionType: actionType,
								}),
							});

							expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenNthCalledWith(2, {
								...EXPECTED_CHANNEL_CONTEXT,
								action: 'success',
								actionSubject: 'smartLinkQuickAction',
								attributes: expect.objectContaining({
									...EXPECTED_COMMON_ATTRIBUTES,
									display,
									id: TEST_ID,
									smartLinkActionType: actionType,
								}),
							});
						});

						it('fires button click and track failed', async () => {
							const mockInvoke = jest.fn().mockImplementationOnce(() => {
								throw new Error();
							});
							jest.spyOn(useInvoke, 'default').mockReturnValue(mockInvoke);

							const { findByTestId, mockAnalyticsClient } = setup(setupOptions);

							const button = await findByTestId(testId);
							act(() => {
								fireEvent.click(button);
							});
							await flushPromises();

							expect(mockAnalyticsClient.sendUIEvent).toHaveBeenLastCalledWith({
								...EXPECTED_CHANNEL_CONTEXT,
								action: 'clicked',
								actionSubject: 'button',
								actionSubjectId,
								attributes: expect.objectContaining({
									...EXPECTED_COMMON_ATTRIBUTES,
									display,
									id: TEST_ID,
								}),
							});

							expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenNthCalledWith(1, {
								...EXPECTED_CHANNEL_CONTEXT,
								action: 'started',
								actionSubject: 'smartLinkQuickAction',
								attributes: expect.objectContaining({
									...EXPECTED_COMMON_ATTRIBUTES,
									display,
									id: TEST_ID,
									smartLinkActionType: actionType,
								}),
							});

							expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenNthCalledWith(2, {
								...EXPECTED_CHANNEL_CONTEXT,
								action: 'failed',
								actionSubject: 'smartLinkQuickAction',
								actionSubjectId: undefined,
								attributes: expect.objectContaining({
									...EXPECTED_COMMON_ATTRIBUTES,
									display,
									id: TEST_ID,
									smartLinkActionType: actionType,
								}),
							});
						});
					},
				);
			}
		},
	);
});
