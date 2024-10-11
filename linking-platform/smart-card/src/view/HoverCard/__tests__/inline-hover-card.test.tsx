jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) => data.children);
jest.doMock('../../../utils/analytics/analytics');
jest.mock('react-render-image', () => ({ src, errored, onError }: any) => {
	switch (src) {
		case 'src-error':
			onError && onError();
			return errored;
		default:
			return null;
	}
});

import '@atlaskit/link-test-helpers/jest';

import React from 'react';
import { act, render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fakeFactory } from '../../../utils/mocks';
import { type CardClient } from '@atlaskit/link-provider';
import { Provider } from '../../..';
import * as useSmartCardActions from '../../../state/actions';
import { Card } from '../../Card';
import { mockConfluenceResponse, mockSSRResponse } from './__mocks__/mocks';
import {
	forbiddenViewTests,
	mockUrl,
	runCommonHoverCardTests,
	unauthorizedViewTests,
} from './common/common.test-utils';
import { analyticsTests } from './common/analytics.test-utils';
import {
	mockIntersectionObserver,
	setup,
	setupEventPropagationTest,
	type SetUpParams,
	userEventOptionsWithAdvanceTimers,
} from './common/setup.test-utils';

describe('HoverCard', () => {
	let mockClient: CardClient;
	let mockFetch: jest.Mock;

	beforeEach(() => {
		jest.useFakeTimers({ legacyFakeTimers: true });
		mockIntersectionObserver();
	});

	afterEach(() => {
		act(() => jest.runAllTimers()); // Suppress act errors after test ends
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	describe('smart-card', () => {
		const testsConfig = {
			testIds: {
				unauthorizedTestId: 'inline-card-unauthorized-view',
				secondaryChildTestId: 'inline-card-icon-and-title',
				erroredTestId: 'inline-card-errored-view',
			},
		};

		describe('Common tests', () => {
			runCommonHoverCardTests((setupProps?: SetUpParams) => setup(setupProps), testsConfig);
			forbiddenViewTests((setupProps?: SetUpParams) => setup(setupProps));
			unauthorizedViewTests((setupProps?: SetUpParams) => setup(setupProps), testsConfig);
			analyticsTests((setupProps?: SetUpParams) => setup(setupProps), {
				display: 'inline',
				isAnalyticsContextResolvedOnHover: true,
			});
		});

		it('should not call loadMetadata if link state is not pending', async () => {
			let loadMetadataSpy = jest.fn();

			const mockedActions = {
				authorize: jest.fn(),
				invoke: jest.fn(),
				register: jest.fn(),
				reload: jest.fn(),
				loadMetadata: loadMetadataSpy,
			};

			await setup({ userEventOptions: userEventOptionsWithAdvanceTimers });

			jest
				.spyOn(useSmartCardActions, 'useSmartCardActions')
				.mockImplementation(() => mockedActions);

			act(() => {
				jest.advanceTimersByTime(100);
			});
			expect(loadMetadataSpy).toHaveBeenCalledTimes(0);
		});

		it('should still render the full screen view action on inline link hover when disabled via flexui prop', async () => {
			await setup();
			const previewButton = await screen.findByTestId('smart-action-preview-action');
			expect(previewButton.textContent).toBe('Open preview');
		});

		describe('hover preview feature flag:', () => {
			const cases: ['should' | 'should not', boolean | undefined, boolean | undefined][] = [
				['should not', undefined, undefined],
				['should', true, undefined],
				['should not', false, undefined],
				['should', undefined, true],
				['should', true, true],
				['should', false, true],
				['should not', undefined, false],
				['should not', true, false],
				['should not', false, false],
			];
			test.each(cases)(
				'hover card %p render when prop is %p on provider and %p on card',
				async (outcome, providerFF, cardFF) => {
					const renderedComponent = await setup({
						featureFlags: { showHoverPreview: providerFF },
						extraCardProps: { showHoverPreview: cardFF },
					});
					if (outcome === 'should') {
						renderedComponent;
						expect(await screen.findByTestId('hover-card')).toBeDefined();
					} else {
						expect(screen.queryByTestId('hover-card')).toBeNull();
					}
				},
			);
		});

		describe('event propagation', () => {
			it('does not propagate event to parent when clicking inside hover card content', async () => {
				const mockOnClick = jest.fn();
				const { event } = await setupEventPropagationTest({
					mockOnClick,
				});

				const content = await screen.findByTestId('smart-links-container');
				await event.click(content);

				const link = await screen.findByTestId('smart-element-link');
				await event.click(link);

				const previewButton = await screen.findByTestId('smart-action-preview-action');
				await event.click(previewButton);

				expect(mockOnClick).not.toHaveBeenCalled();
			});

			it('does not propagate event to parent when clicking on trigger element', async () => {
				const mockOnClick = jest.fn();
				const { element, event } = await setupEventPropagationTest({
					mockOnClick,
				});

				await event.click(element);

				expect(mockOnClick).not.toHaveBeenCalled();
			});
		});

		describe('SSR links', () => {
			const setupWithSSR = async () => {
				let resolveFetch = (value: unknown) => {};
				let rejectFetch = (reason: any) => {};
				const mockPromise = new Promise((resolve, reject) => {
					resolveFetch = resolve;
					rejectFetch = reject;
				});
				mockFetch = jest.fn(() => mockPromise);
				mockClient = new (fakeFactory(mockFetch))();
				const storeOptions: any = {
					initialState: {
						[mockUrl]: {
							status: 'resolved',
							details: mockSSRResponse,
						},
					},
				};

				const { findAllByTestId, findByTestId, queryByTestId, debug } = render(
					<Provider client={mockClient} storeOptions={storeOptions}>
						<Card appearance="inline" url={mockUrl} showHoverPreview={true} />
					</Provider>,
				);

				expect(mockFetch).toHaveBeenCalledTimes(0);
				const element = await screen.findByTestId('inline-card-resolved-view');
				expect(element.textContent).toBe('I am a fan of cheese');

				jest.useFakeTimers({ legacyFakeTimers: true });
				const event = userEvent.setup({ delay: null });
				await event.hover(element);

				act(() => {
					jest.runAllTimers();
				});

				await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

				return {
					findAllByTestId,
					findByTestId,
					queryByTestId,
					resolveFetch,
					rejectFetch,
					event,
					debug,
				};
			};

			it('should render hover card view correctly', async () => {
				const { resolveFetch } = await setupWithSSR();

				await screen.findByTestId('hover-card-loading-view');
				resolveFetch(mockConfluenceResponse);

				await screen.findAllByTestId('smart-block-metadata-resolved-view');
				const titleBlock = await screen.findByTestId('smart-block-title-resolved-view');
				const snippetBlock = await screen.findByTestId('smart-block-snippet-resolved-view');
				const footerBlock = await screen.findByTestId('smart-ai-footer-block-resolved-view');
				expect(screen.queryByTestId('hover-card-loading-view')).toBeNull();

				// trim because the icons are causing new lines in the textContent
				expect(titleBlock.textContent?.trim()).toBe('I love cheese');
				expect(snippetBlock.textContent).toBe('Here is your serving of cheese');
				expect(footerBlock.textContent?.trim()).toBe('Confluence');
			});

			it('should fall back to default path if fetch fails', async () => {
				const { rejectFetch } = await setupWithSSR();

				await screen.findByTestId('hover-card-loading-view');
				rejectFetch('error');

				const titleBlock = await screen.findByTestId('smart-block-title-resolved-view');
				const snippetBlock = await screen.findByTestId('smart-block-snippet-resolved-view');
				const footerBlock = await screen.findByTestId('smart-ai-footer-block-resolved-view');
				expect(screen.queryByTestId('hover-card-loading-view')).toBeNull();

				// trim because the icons are causing new lines in the textContent
				expect(titleBlock.textContent?.trim()).toBe('I am a fan of cheese');
				expect(snippetBlock.textContent).toBe('');
				expect(footerBlock.textContent?.trim()).toBe('');
			});
		});
	});
});
