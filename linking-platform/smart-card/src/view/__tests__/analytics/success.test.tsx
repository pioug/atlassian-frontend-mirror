jest.mock('../../../utils', () => ({
	...jest.requireActual<Object>('../../../utils'),
	downloadUrl: jest.fn(),
	isSpecialEvent: jest.fn(() => false),
}));

import './success.test.mock';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { type CardClient } from '@atlaskit/link-provider';
import React from 'react';
import { Card, type CardAppearance } from '../../Card';
import { CardAction, Provider, TitleBlock } from '../../..';
import { fakeFactory, mocks } from '../../../utils/mocks';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import * as analytics from '../../../utils/analytics';
import * as ufoWrapper from '../../../state/analytics/ufoExperiences';
import * as jestExtendedMatchers from 'jest-extended';
import { type JestFunction, asMock } from '@atlaskit/media-test-helpers';
import uuid from 'uuid';
import { IntlProvider } from 'react-intl-next';
import { isSpecialEvent } from '../../../utils';
import * as cardWithUrlContent from '../../CardWithUrl/component';

mockSimpleIntersectionObserver();

jest.mock('@atlaskit/link-provider', () => ({
	useFeatureFlag: () => true,
}));

expect.extend(jestExtendedMatchers);

describe('smart-card: success analytics', () => {
	let mockClient: CardClient;
	let mockFetch: jest.Mock;
	let mockPostData: jest.Mock;
	let mockWindowOpen: jest.Mock;

	const mockUuid = uuid as JestFunction<typeof uuid>;
	const mockStartUfoExperience = jest.spyOn(ufoWrapper, 'startUfoExperience');
	const mockSucceedUfoExperience = jest.spyOn(ufoWrapper, 'succeedUfoExperience');

	const mockFailUfoExperience = jest.spyOn(ufoWrapper, 'failUfoExperience');
	const mockAddMetadataToExperience = jest.spyOn(ufoWrapper, 'addMetadataToExperience');

	beforeEach(() => {
		mockFetch = jest.fn(async () => mocks.success);
		mockPostData = jest.fn(async () => mocks.actionSuccess);
		mockClient = new (fakeFactory(mockFetch, mockPostData))();
		mockWindowOpen = jest.fn();
		mockUuid.mockReturnValueOnce('some-uuid-1').mockReturnValueOnce('some-uuid-2');
		/// @ts-ignore
		global.open = mockWindowOpen;
	});

	afterEach(() => {
		jest.clearAllMocks();
		mockUuid.mockReset();
		cleanup();
	});

	describe('resolved', () => {
		describe('embeds', () => {
			beforeEach(() => {
				jest.useFakeTimers();
			});

			afterEach(() => {
				jest.useRealTimers();
			});

			it('should fire the dwelled analytics event when the user dwells on the iframe', async () => {
				const mockUrl = 'https://this.is.the.sixth.url';
				const { findByTestId } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="embed" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				const resolvedView = await findByTestId('embed-card-resolved-view');
				expect(resolvedView).toBeTruthy();
				expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);
				expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
				expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledWith({
					display: 'embed',
					status: 'resolved',
					definitionId: 'd1',
					extensionKey: 'object-provider',
					canBeDatasource: false,
				});

				const resolvedViewFrame = await findByTestId('embed-card-resolved-view-frame');
				fireEvent.load(resolvedViewFrame);
				fireEvent.mouseEnter(resolvedViewFrame);
				expect(analytics.uiIframeDwelledEvent).toHaveBeenCalledTimes(0);
				await waitFor(
					async () => {
						expect(analytics.uiIframeDwelledEvent).toHaveBeenCalledTimes(1);
					},
					{ timeout: 6000 }, // EDM-10399 Simulate the dwell time
				);

				expect(analytics.uiIframeDwelledEvent).toHaveBeenCalledWith({
					definitionId: 'd1',
					destinationProduct: undefined,
					destinationSubproduct: undefined,
					display: 'embed',
					dwellPercentVisible: 100,
					dwellTime: 5,
					extensionKey: 'object-provider',
					id: 'some-uuid-1',
					location: undefined,
					status: 'resolved',
				});
			});
		});

		it('should fire the resolved analytics event when the url was resolved', async () => {
			const mockUrl = 'https://this.is.the.sixth.url';
			const { findByTestId, getByRole } = render(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
					</Provider>
				</IntlProvider>,
			);
			const resolvedView = await findByTestId('resolvedCard1-resolved-view');
			const resolvedCard = getByRole('button');
			expect(resolvedView).toBeTruthy();
			expect(resolvedCard).toBeTruthy();
			expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);
			expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
			expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledWith({
				display: 'inline',
				status: 'resolved',
				definitionId: 'd1',
				extensionKey: 'object-provider',
				canBeDatasource: false,
			});

			expect(mockStartUfoExperience).toHaveBeenCalledWith('smart-link-rendered', 'some-uuid-1');
			expect(mockSucceedUfoExperience).toHaveBeenCalledWith('smart-link-rendered', 'some-uuid-1', {
				display: 'inline',
				extensionKey: 'object-provider',
			});
			expect(mockSucceedUfoExperience).toHaveBeenCalledAfter(mockStartUfoExperience as jest.Mock);
		});

		it('should not send repeated render success events when nonessential props are changed', async () => {
			const mockUrl = 'https://this.is.the.sixth.url';
			const { getByTestId, rerender } = render(
				<Provider client={mockClient}>
					<Card
						testId="resolvedCard1"
						appearance="inline"
						url={mockUrl}
						actionOptions={{
							hide: false,
							exclude: [CardAction.DownloadAction, CardAction.PreviewAction, CardAction.ViewAction],
						}}
					/>
				</Provider>,
			);

			await waitFor(() => getByTestId('resolvedCard1-resolved-view'), {
				timeout: 10000,
			});

			rerender(
				<Provider client={mockClient}>
					<Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
				</Provider>,
			);

			expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
		});

		it('should add the cached tag to UFO render experience when the same link url is rendered again', async () => {
			const mockUrl = 'https://this.is.the.seventh.url';
			const { rerender, getByTestId } = render(
				<Provider client={mockClient}>
					<Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
				</Provider>,
			);
			await waitFor(() => getByTestId('resolvedCard1-resolved-view'), {
				timeout: 10000,
			});

			expect(mockAddMetadataToExperience).not.toHaveBeenCalled();

			rerender(
				<Provider client={mockClient}>
					<Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
					<Card testId="resolvedCard2" appearance="inline" url={mockUrl} />
				</Provider>,
			);

			await waitFor(() => getByTestId('resolvedCard1-resolved-view'), {
				timeout: 10000,
			});
			await waitFor(() => getByTestId('resolvedCard2-resolved-view'), {
				timeout: 10000,
			});

			expect(mockStartUfoExperience.mock.calls).toIncludeAllMembers([
				['smart-link-rendered', 'some-uuid-1'],
				['smart-link-rendered', 'some-uuid-2'],
			]);

			// Ensure whichever link loads first is marked as cached since url is the same
			expect(mockAddMetadataToExperience.mock.calls).toEqual([
				[
					'smart-link-rendered',
					expect.stringMatching(/^some-uuid-2||some-uuid-1$/),
					{
						cached: true,
					},
				],
			]);

			// Authenticated experiences haven't been started and will be ignored by UFO
			expect(mockSucceedUfoExperience.mock.calls).toIncludeAllMembers([
				[
					'smart-link-rendered',
					'some-uuid-1',
					{ display: 'inline', extensionKey: 'object-provider' },
				],
				['smart-link-authenticated', 'some-uuid-1', { display: 'inline' }],
				[
					'smart-link-rendered',
					'some-uuid-2',
					{ display: 'inline', extensionKey: 'object-provider' },
				],
				['smart-link-authenticated', 'some-uuid-2', { display: 'inline' }],
			]);
		});

		it('should fire clicked analytics event when flexible ui link with resolved URL is clicked', async () => {
			const mockUrl = 'https://this.is.the.seventh.url';
			const { findByTestId, getByTestId } = render(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card testId="resolvedCard2" appearance="inline" url={mockUrl}>
							<TitleBlock />
						</Card>
					</Provider>
				</IntlProvider>,
			);
			const resolvedView = await findByTestId('smart-block-title-resolved-view');
			expect(resolvedView).toBeTruthy();

			const resolvedCard = getByTestId('smart-element-link');
			expect(resolvedCard).toBeTruthy();
			expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);

			asMock(isSpecialEvent).mockReturnValue(false);

			fireEvent.click(resolvedCard);

			// ensure default onclick for renderer is not triggered
			expect(mockWindowOpen).toHaveBeenCalledTimes(0);
			expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);
			expect(analytics.uiCardClickedEvent).toHaveBeenCalledWith({
				id: 'some-uuid-1',
				display: 'flexible',
				status: 'resolved',
				definitionId: 'd1',
				extensionKey: 'object-provider',
				isModifierKeyPressed: false,
			});

			// With special key pressed
			asMock(analytics.uiCardClickedEvent).mockReset();
			mockWindowOpen.mockReset();

			asMock(isSpecialEvent).mockReturnValue(true);

			fireEvent.click(resolvedCard);

			// ensure default onclick for renderer is not triggered
			expect(mockWindowOpen).toHaveBeenCalledTimes(0);
			expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);
			expect(analytics.uiCardClickedEvent).toHaveBeenCalledWith({
				id: 'some-uuid-1',
				display: 'flexible',
				status: 'resolved',
				definitionId: 'd1',
				extensionKey: 'object-provider',
				isModifierKeyPressed: true,
			});
		});

		it('should fire clicked analytics event when a resolved URL is clicked on a inline link', async () => {
			const mockUrl = 'https://this.is.the.seventh.url';
			const { findByTestId, getByRole } = render(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card testId="resolvedCard2" appearance="inline" url={mockUrl} />
					</Provider>
				</IntlProvider>,
			);
			const resolvedView = await findByTestId('resolvedCard2-resolved-view');
			expect(resolvedView).toBeTruthy();

			const resolvedCard = getByRole('button');
			expect(resolvedCard).toBeTruthy();
			expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);

			asMock(isSpecialEvent).mockReturnValue(false);

			fireEvent.click(resolvedCard);
			expect(mockWindowOpen).toHaveBeenCalledTimes(1);
			expect(analytics.uiCardClickedEvent).toHaveBeenCalledWith({
				id: 'some-uuid-1',
				display: 'inline',
				status: 'resolved',
				definitionId: 'd1',
				extensionKey: 'object-provider',
				isModifierKeyPressed: false,
			});
			expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);

			// With special key pressed
			asMock(analytics.uiCardClickedEvent).mockReset();
			mockWindowOpen.mockReset();
			asMock(isSpecialEvent).mockReturnValue(true);

			fireEvent.click(resolvedCard);

			expect(mockWindowOpen).toHaveBeenCalledTimes(1);
			expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);
			expect(analytics.uiCardClickedEvent).toHaveBeenCalledWith({
				id: 'some-uuid-1',
				display: 'inline',
				status: 'resolved',
				definitionId: 'd1',
				extensionKey: 'object-provider',
				isModifierKeyPressed: true,
			});
		});

		it('should fire render failure when an unexpected error happens', async () => {
			const mockUrl = 'https://this.is.the.eight.url';
			const spy = jest.spyOn(cardWithUrlContent, 'CardWithUrlContent').mockImplementation(() => {
				throw new Error();
			});

			const onError = jest.fn();
			render(
				<Provider client={mockClient}>
					<Card appearance="inline" url={mockUrl} onError={onError} />
				</Provider>,
			);

			await waitFor(() => expect(analytics.uiRenderFailedEvent).toBeCalledTimes(1), {
				timeout: 5000,
			});
			expect(onError).toHaveBeenCalledTimes(1);

			expect(mockStartUfoExperience).toHaveBeenCalledWith('smart-link-rendered', 'some-uuid-1');
			expect(mockFailUfoExperience).toHaveBeenCalledWith('smart-link-rendered', 'some-uuid-1');
			expect(mockFailUfoExperience).toHaveBeenCalledWith('smart-link-authenticated', 'some-uuid-1');
			expect(mockStartUfoExperience).toHaveBeenCalledBefore(mockFailUfoExperience as jest.Mock);

			spy.mockRestore();
		});

		it('should not send repeated render failed events when nonessential props are changed', async () => {
			const mockUrl = 'https://this.is.the.eight.url';
			const spy = jest.spyOn(cardWithUrlContent, 'CardWithUrlContent').mockImplementation(() => {
				throw new Error();
			});

			const onError = jest.fn();
			const { rerender } = render(
				<Provider client={mockClient}>
					<Card
						appearance="inline"
						url={mockUrl}
						actionOptions={{
							hide: false,
							exclude: [CardAction.DownloadAction, CardAction.PreviewAction, CardAction.ViewAction],
						}}
						onError={onError}
					/>
				</Provider>,
			);

			rerender(
				<Provider client={mockClient}>
					<Card testId="resolvedCard1" appearance="inline" url={mockUrl} onError={onError} />
				</Provider>,
			);

			await waitFor(() => expect(analytics.uiRenderFailedEvent).toBeCalledTimes(1), {
				timeout: 5000,
			});

			expect(onError).toHaveBeenCalledTimes(1);
			spy.mockRestore();
		});

		describe('with datasources', () => {
			beforeEach(() => {
				mockFetch = jest.fn(async () => mocks.withDatasource);
				mockClient = new (fakeFactory(mockFetch, mockPostData))();
			});

			it.each<[CardAppearance, string]>([
				['inline', 'resolvedCard1-resolved-view'],
				['block', 'resolvedCard1'],
				['embed', 'resolvedCard1'],
			] satisfies Array<[CardAppearance, string]>)(
				'should fire the renderSuccess analytics event with canBeDatasource = true when the url was resolved and display is %s',
				async (appearance, testId) => {
					const mockUrl = 'https://this.is.the.sixth.url';
					const { findByTestId } = render(
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card testId="resolvedCard1" appearance={appearance} url={mockUrl} />
							</Provider>
						</IntlProvider>,
					);
					const resolvedView = await findByTestId(testId);
					expect(resolvedView).toBeTruthy();
					await waitFor(() => {
						// EDM-10399 Some React operations must be completed before this check can be made
						expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
					});
					expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledWith({
						display: appearance,
						status: 'resolved',
						definitionId: 'd1',
						extensionKey: 'object-provider',
						canBeDatasource: true,
					});
				},
			);
		});
	});
});
