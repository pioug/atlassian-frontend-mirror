import '@atlaskit/link-test-helpers/jest';
import React from 'react';

import FabricAnalyticsListeners from '@atlaskit/analytics-listeners/FabricAnalyticsListeners';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners/types';
import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';
import { cardState, url } from '@atlaskit/media-test-helpers/smart-card-state';
import { getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { fireEvent, render, waitFor } from '@atlassian/testing-library/testing-library/react';

import { CardSSR, type CardSSRProps } from '../../ssr';
import { failUfoExperience } from '../../state/analytics/failUfoExperience';
import { startUfoExperience } from '../../state/analytics/startUfoExperience';
import { succeedUfoExperience } from '../../state/analytics/succeedUfoExperience';
import { shouldSample } from '../../utils/shouldSample';
import { CardWithUrl } from '../../view/CardWithUrl/component';
import { default as TitleBlock } from '../../view/FlexibleCard/components/blocks/title-block';

jest.mock('../../view/CardWithUrl/component', () => {
	const originalModule = jest.requireActual('../../view/CardWithUrl/component');
	return {
		...originalModule,
		CardWithUrlContent: jest.fn((props) => <originalModule.CardWithUrlContent {...props} />),
		CardWithUrl: jest.fn((props) => <originalModule.CardWithUrl {...props} />),
	};
});

jest.mock('../../state/analytics/startUfoExperience', () => ({
	startUfoExperience: jest.fn(),
}));
jest.mock('../../state/analytics/failUfoExperience', () => ({
	failUfoExperience: jest.fn(),
}));
jest.mock('../../state/analytics/succeedUfoExperience', () => ({
	succeedUfoExperience: jest.fn(),
}));
jest.mock('@atlaskit/react-ufo/interaction-metrics', () => ({
	...jest.requireActual('@atlaskit/react-ufo/interaction-metrics'),
	getActiveInteraction: jest.fn(),
}));
jest.mock('../../utils/shouldSample', () => ({
	shouldSample: jest.fn(() => true),
}));

describe('<CardSSR />', () => {
	const cardWithUrlMock = jest.mocked(CardWithUrl);
	const cardProps: CardSSRProps = {
		appearance: 'inline',
		url,
	};

	const setup = (props?: Partial<CardSSRProps>) => {
		const mockAnalyticsClient = {
			sendUIEvent: jest.fn().mockResolvedValue(undefined),
			sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
			sendTrackEvent: jest.fn().mockResolvedValue(undefined),
			sendScreenEvent: jest.fn().mockResolvedValue(undefined),
		} satisfies AnalyticsWebClient;

		const storeOptions: any = {
			initialState: {
				[url]: cardState,
			},
		};
		render(
			<FabricAnalyticsListeners client={mockAnalyticsClient}>
				<Provider storeOptions={storeOptions} client={new Client('stg')}>
					<CardSSR {...cardProps} {...props} />
				</Provider>
			</FabricAnalyticsListeners>,
		);

		return {
			mockAnalyticsClient,
		};
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render CardWithUrlContent with provided props', async () => {
		setup();
		const resolvedCard = await screen.findByTestId('inline-card-resolved-view');
		expect(resolvedCard).toBeVisible();
		expect(resolvedCard).toHaveAttribute('href', url);

		await expect(document.body).toBeAccessible();
	});

	it('should render error fallback component with correct props', async () => {
		const onResolve = () => {
			throw new Error();
		};

		setup({ onResolve });
		expect(await screen.findByTestId('lazy-render-placeholder')).toBeVisible();

		await expect(document.body).toBeAccessible();
	});

	describe('analytics', () => {
		it('should fire analytics events', async () => {
			const { mockAnalyticsClient } = setup();

			await screen.findByTestId('inline-card-resolved-view');
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'renderSuccess',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({}),
				}),
			);

			await expect(document.body).toBeAccessible();
		});

		it('should fire link clicked event with attributes from SmartLinkAnalyticsContext', async () => {
			const { mockAnalyticsClient } = setup({ id: 'some-id' });

			const resolvedCard = await screen.findByTestId('inline-card-resolved-view');

			fireEvent.click(resolvedCard);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'link',
					attributes: expect.objectContaining({
						display: 'inline',
						id: 'some-id',
						componentName: 'smart-cards',
						status: 'resolved',
					}),
				}),
			);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('missing events parity with Card', () => {
		const gate = 'platform_smartlink_cardssr_missing_events';
		const startUfoExperienceMock = jest.mocked(startUfoExperience);
		const failUfoExperienceMock = jest.mocked(failUfoExperience);
		const succeedUfoExperienceMock = jest.mocked(succeedUfoExperience);
		let consoleErrorFn: jest.SpyInstance;

		beforeEach(() => {
			consoleErrorFn = jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
		});

		afterEach(() => {
			consoleErrorFn.mockRestore();
		});

		it.each([
			['enabled', passGate],
			['disabled', failGate],
		])('should render fallback without SmartCardProvider when gate is %s', async (_, setGate) => {
			setGate(gate);
			render(<CardSSR appearance="inline" url={url} id="some-id" />);

			expect(await screen.findByTestId('lazy-render-placeholder')).toBeVisible();
		});

		const throwOnResolve = () => {
			throw new Error('unexpected error');
		};

		const createError = (name: string) => {
			const error = new Error(`${name} error`);
			error.name = name;
			return error;
		};

		const throwErrorOnResolve = (name: string) => () => {
			throw createError(name);
		};

		describe('when gate is enabled', () => {
			beforeEach(() => {
				passGate(gate);
			});

			it('should start smart-link-rendered experience at interaction start time before it succeeds', async () => {
				jest
					.mocked(getActiveInteraction)
					.mockReturnValue({ start: 123 } as ReturnType<typeof getActiveInteraction>);
				setup({ id: 'some-id' });

				await screen.findByTestId('inline-card-resolved-view');
				expect(startUfoExperienceMock).toHaveBeenCalledWith(
					'smart-link-rendered',
					'some-id',
					{ ssr: true, timingStrategy: 'interaction-start' },
					123,
				);
				await waitFor(() =>
					expect(succeedUfoExperienceMock).toHaveBeenCalledWith(
						'smart-link-rendered',
						'some-id',
						expect.any(Object),
					),
				);
				expect(startUfoExperienceMock.mock.invocationCallOrder[0]).toBeLessThan(
					succeedUfoExperienceMock.mock.invocationCallOrder[0],
				);
			});

			it('should start smart-link-rendered experience at render time when there is no active interaction', async () => {
				jest.mocked(getActiveInteraction).mockReturnValue(undefined);
				setup({ id: 'some-id' });

				await screen.findByTestId('inline-card-resolved-view');
				expect(startUfoExperienceMock).toHaveBeenCalledWith(
					'smart-link-rendered',
					'some-id',
					{ ssr: true, timingStrategy: 'render' },
					undefined,
				);
			});

			it('should fire renderFailed event, fail experiences and call onError on unexpected error', async () => {
				const onError = jest.fn();
				const { mockAnalyticsClient } = setup({
					id: 'some-id',
					onResolve: throwOnResolve,
					onError,
				});

				expect(await screen.findByTestId('lazy-render-placeholder')).toBeVisible();
				await waitFor(() =>
					expect(onError).toHaveBeenCalledWith({
						status: 'errored',
						url,
						err: expect.objectContaining({ message: 'unexpected error' }),
					}),
				);
				expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'renderFailed',
						actionSubject: 'smartLink',
						attributes: expect.objectContaining({
							display: 'inline',
							id: 'some-id',
							error: expect.objectContaining({ message: 'unexpected error' }),
						}),
					}),
				);
				expect(startUfoExperienceMock).toHaveBeenCalledWith('smart-link-rendered', 'some-id', {
					ssr: true,
				});
				expect(failUfoExperienceMock).toHaveBeenCalledWith('smart-link-rendered', 'some-id');
				expect(failUfoExperienceMock).toHaveBeenCalledWith('smart-link-authenticated', 'some-id');
			});

			it('should not start smart-link-rendered experience on render when not sampled', async () => {
				jest.mocked(shouldSample).mockReturnValueOnce(false);
				setup({ id: 'some-id' });

				await screen.findByTestId('inline-card-resolved-view');
				expect(startUfoExperienceMock).not.toHaveBeenCalled();
			});

			it('should fire chunkLoadFailed event and call onError on ChunkLoadError', async () => {
				const onError = jest.fn();
				const { mockAnalyticsClient } = setup({
					id: 'some-id',
					onResolve: throwErrorOnResolve('ChunkLoadError'),
					onError,
				});

				await waitFor(() =>
					expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'chunkLoadFailed',
							actionSubject: 'smartLink',
							attributes: expect.objectContaining({
								display: 'inline',
								definitionId: null,
								error: expect.objectContaining({ name: 'ChunkLoadError' }),
								errorInfo: expect.any(Object),
							}),
						}),
					),
				);
				expect(onError).toHaveBeenCalledWith({
					status: 'errored',
					url,
					err: expect.objectContaining({ name: 'ChunkLoadError' }),
				});
				expect(mockAnalyticsClient.sendUIEvent).not.toHaveBeenCalledWith(
					expect.objectContaining({ action: 'renderFailed' }),
				);
				expect(failUfoExperienceMock).not.toHaveBeenCalled();
			});

			it('should fire renderFailed event with current link state after the store resolves', async () => {
				class DelayedClient extends Client {
					async fetchData() {
						await new Promise((resolve) => setTimeout(resolve, 0));
						return cardState.details;
					}
				}
				const mockAnalyticsClient = {
					sendUIEvent: jest.fn().mockResolvedValue(undefined),
					sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
					sendTrackEvent: jest.fn().mockResolvedValue(undefined),
					sendScreenEvent: jest.fn().mockResolvedValue(undefined),
				} satisfies AnalyticsWebClient;

				// Empty store: the card starts pending and resolves asynchronously,
				// then throws once resolved (onResolve).
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<Provider client={new DelayedClient('stg')}>
							<CardSSR {...cardProps} id="some-id" onResolve={throwOnResolve} />
						</Provider>
					</FabricAnalyticsListeners>,
				);

				await waitFor(() =>
					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'renderFailed',
							attributes: expect.objectContaining({
								status: 'resolved',
								definitionId: cardState.details.meta.definitionId,
								extensionKey: cardState.details.meta.key,
							}),
						}),
					),
				);
			});

			it('should only call onError on APIError', async () => {
				const onError = jest.fn();
				const { mockAnalyticsClient } = setup({
					id: 'some-id',
					onResolve: throwErrorOnResolve('APIError'),
					onError,
				});

				await waitFor(() =>
					expect(onError).toHaveBeenCalledWith({
						status: 'errored',
						url,
						err: expect.objectContaining({ name: 'APIError' }),
					}),
				);
				expect(mockAnalyticsClient.sendUIEvent).not.toHaveBeenCalledWith(
					expect.objectContaining({ action: 'renderFailed' }),
				);
				expect(mockAnalyticsClient.sendOperationalEvent).not.toHaveBeenCalledWith(
					expect.objectContaining({ action: 'chunkLoadFailed' }),
				);
				expect(failUfoExperienceMock).not.toHaveBeenCalled();
			});

			describe.each([
				['disabled', failGate],
				['enabled', passGate],
			])('with platform_smartlink_inline_resolve_optimization %s', (_, setInlineResolveGate) => {
				beforeEach(() => {
					setInlineResolveGate('platform_smartlink_inline_resolve_optimization');
				});

				it('should fire renderFailed event with flexible display for flexible card', async () => {
					const { mockAnalyticsClient } = setup({
						id: 'some-id',
						children: <TitleBlock />,
						onResolve: throwErrorOnResolve('Error'),
					});

					await waitFor(() =>
						expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
							expect.objectContaining({
								action: 'renderFailed',
								attributes: expect.objectContaining({ display: 'flexible' }),
							}),
						),
					);
				});

				it('should fire chunkLoadFailed event with flexible display for flexible card', async () => {
					const { mockAnalyticsClient } = setup({
						id: 'some-id',
						children: <TitleBlock />,
						onResolve: throwErrorOnResolve('ChunkLoadError'),
					});

					await waitFor(() =>
						expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
							expect.objectContaining({
								action: 'chunkLoadFailed',
								attributes: expect.objectContaining({ display: 'flexible' }),
							}),
						),
					);
				});
			});
		});

		describe('when gate is disabled', () => {
			beforeEach(() => {
				failGate(gate);
			});

			it('should not start smart-link-rendered experience', async () => {
				setup({ id: 'some-id' });

				await screen.findByTestId('inline-card-resolved-view');
				expect(startUfoExperienceMock).not.toHaveBeenCalled();
			});

			it('should not fire renderFailed event or call onError on unexpected error', async () => {
				const onError = jest.fn();
				const { mockAnalyticsClient } = setup({
					id: 'some-id',
					onResolve: throwOnResolve,
					onError,
				});

				expect(await screen.findByTestId('lazy-render-placeholder')).toBeVisible();
				expect(onError).not.toHaveBeenCalled();
				expect(mockAnalyticsClient.sendUIEvent).not.toHaveBeenCalledWith(
					expect.objectContaining({ action: 'renderFailed' }),
				);
				expect(failUfoExperienceMock).not.toHaveBeenCalled();
			});

			it('should not fire chunkLoadFailed event or call onError on ChunkLoadError', async () => {
				const onError = jest.fn();
				const { mockAnalyticsClient } = setup({
					id: 'some-id',
					onResolve: throwErrorOnResolve('ChunkLoadError'),
					onError,
				});

				expect(await screen.findByTestId('lazy-render-placeholder')).toBeVisible();
				expect(onError).not.toHaveBeenCalled();
				expect(mockAnalyticsClient.sendOperationalEvent).not.toHaveBeenCalledWith(
					expect.objectContaining({ action: 'chunkLoadFailed' }),
				);
			});
		});
	});

	describe('props', () => {
		it('should pass down id prop if there is one', async () => {
			const id = 'abc';

			setup({
				id,
			});

			expect(cardWithUrlMock).toHaveBeenCalledWith(
				expect.objectContaining({ id }),
				expect.anything(),
			);

			await expect(document.body).toBeAccessible();
		});

		it('should provide random uuid for id prop if there is not one provided', async () => {
			setup();

			expect(cardWithUrlMock).toHaveBeenCalledWith(
				expect.objectContaining({ id: expect.any(String) }),
				expect.anything(),
			);

			await expect(document.body).toBeAccessible();
		});

		it('should pass down title prop', async () => {
			const title = 'title-from-ssr';
			setup({ title });

			expect(cardWithUrlMock).toHaveBeenCalledWith(
				expect.objectContaining({ title }),
				expect.anything(),
			);
		});
	});
});
