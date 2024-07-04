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
import { render, waitFor } from '@testing-library/react';
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

		runCommonHoverCardTests((setupProps?: SetUpParams) => setup(setupProps), testsConfig);

		forbiddenViewTests((setupProps?: SetUpParams) => setup(setupProps));

		unauthorizedViewTests((setupProps?: SetUpParams) => setup(setupProps), testsConfig);

		analyticsTests((setupProps?: SetUpParams) => setup(setupProps), {
			display: 'inline',
			isAnalyticsContextResolvedOnHover: true,
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

			jest.advanceTimersByTime(100);
			expect(loadMetadataSpy).toHaveBeenCalledTimes(0);
		});

		it('should still render the full screen view action on inline link hover when disabled via flexui prop', async () => {
			const { findByTestId } = await setup({
				extraCardProps: { ui: { hideHoverCardPreviewButton: true } },
			});
			const previewButton = await findByTestId('preview-content');
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
						const { findByTestId } = renderedComponent;
						expect(await findByTestId('hover-card')).toBeDefined();
					} else {
						const { queryByTestId } = renderedComponent;
						expect(queryByTestId('hover-card')).toBeNull();
					}
				},
			);
		});

		describe('event propagation', () => {
			it('does not propagate event to parent when clicking inside hover card content', async () => {
				const mockOnClick = jest.fn();
				const { findByTestId, event } = await setupEventPropagationTest({
					mockOnClick,
				});

				const content = await findByTestId('smart-links-container');
				await event.click(content);

				const link = await findByTestId('smart-element-link');
				await event.click(link);

				const previewButton = await findByTestId('preview-content');
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

				const { findAllByTestId, findByTestId, queryByTestId } = render(
					<Provider client={mockClient} storeOptions={storeOptions}>
						<Card appearance="inline" url={mockUrl} showHoverPreview={true} />
					</Provider>,
				);

				expect(mockFetch).toBeCalledTimes(0);
				const element = await findByTestId('inline-card-resolved-view');
				expect(element.textContent).toBe('I am a fan of cheese');

				jest.useFakeTimers({ legacyFakeTimers: true });
				const event = userEvent.setup({ delay: null });
				await event.hover(element);
				jest.runAllTimers();
				await waitFor(() => expect(mockFetch).toBeCalledTimes(1));

				return {
					findAllByTestId,
					findByTestId,
					queryByTestId,
					resolveFetch,
					rejectFetch,
					event,
				};
			};

			it('should render hover card view correctly', async () => {
				const { findAllByTestId, findByTestId, queryByTestId, resolveFetch } = await setupWithSSR();

				await findByTestId('hover-card-loading-view');
				resolveFetch(mockConfluenceResponse);

				await findAllByTestId('smart-block-metadata-resolved-view');
				const titleBlock = await findByTestId('smart-block-title-resolved-view');
				const snippetBlock = await findByTestId('smart-block-snippet-resolved-view');
				const footerBlock = await findByTestId('smart-footer-block-resolved-view');
				expect(queryByTestId('hover-card-loading-view')).toBeNull();

				//trim because the icons are causing new lines in the textContent
				expect(titleBlock.textContent?.trim()).toBe('I love cheese');
				expect(snippetBlock.textContent).toBe('Here is your serving of cheese');
				expect(footerBlock.textContent?.trim()).toBe('ConfluenceDownloadOpen preview');
			});

			it('should fall back to default path if fetch fails', async () => {
				const { rejectFetch, queryByTestId, findByTestId } = await setupWithSSR();

				await findByTestId('hover-card-loading-view');
				rejectFetch('error');

				const titleBlock = await findByTestId('smart-block-title-resolved-view');
				const snippetBlock = await findByTestId('smart-block-snippet-resolved-view');
				const footerBlock = await findByTestId('smart-footer-block-resolved-view');
				expect(queryByTestId('hover-card-loading-view')).toBeNull();

				//trim because the icons are causing new lines in the textContent
				expect(titleBlock.textContent?.trim()).toBe('I am a fan of cheese');
				expect(snippetBlock.textContent).toBe('');
				expect(footerBlock.textContent?.trim()).toBe('');
			});
		});
	});
});
