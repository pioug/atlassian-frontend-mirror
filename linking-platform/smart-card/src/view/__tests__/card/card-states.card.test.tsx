import './card-states.card.test.mock';
import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	type CardClient,
	type CardProviderStoreOpts,
	SmartCardProvider as Provider,
} from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { SmartLinkActionType } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import { useControlDataExportConfig } from '../../../state/hooks/use-control-data-export-config';
import { fakeFactory, mockGenerator, mocks } from '../../../utils/mocks';
import { getIsDataExportEnabled } from '../../../utils/should-data-export';
import { Card } from '../../Card';
import type { CardActionOptions } from '../../Card/types';

const mockUrl = 'https://some.url';

mockSimpleIntersectionObserver();
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));
const fgMock = fg as jest.Mock;
jest.mock('../../../state/hooks/use-control-data-export-config', () => ({
	useControlDataExportConfig: jest.fn(),
}));
const useControlDataExportConfigMock = useControlDataExportConfig as jest.Mock;
jest.mock('../../../utils/should-data-export', () => ({
	getIsDataExportEnabled: jest.fn(),
}));
const getIsDataExportEnabledMock = getIsDataExportEnabled as jest.Mock;

describe('smart-card: card states, block', () => {
	const mockOnError = jest.fn();
	const mockOnResolve = jest.fn();
	let mockClient: CardClient;
	let mockFetch: jest.Mock;

	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

	beforeEach(() => {
		mockFetch = jest.fn(() => Promise.resolve(mocks.success));
		mockClient = new (fakeFactory(mockFetch))();
		fgMock.mockReturnValue(false);
		useControlDataExportConfigMock.mockReturnValue({
			shouldControlDataExport: false,
		});
		getIsDataExportEnabledMock.mockReturnValue(false);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('link clicked', () => {
		it('fires `link clicked` analytics event when clicked', async () => {
			window.open = jest.fn();
			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} id="some-id" />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);
			await screen.findByText('I love cheese');

			const link = screen.getByRole('link');
			await userEvent.click(link);

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'link',
					attributes: expect.objectContaining({
						componentName: 'smart-cards',
						display: 'block',
						id: 'some-id',
						status: 'resolved',
					}),
				}),
			);
		});

		it('delegates the click to the preview panel handler if the object type is supported as a preview panel', async () => {
			fgMock.mockImplementation((key) => key === 'fun-1765_wire_up_glance_panel_to_smart_cards');

			const isPreviewPanelAvailable = jest.fn().mockReturnValue(true);
			const openPreviewPanel = jest.fn();

			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider
							client={mockClient}
							isPreviewPanelAvailable={isPreviewPanelAvailable}
							openPreviewPanel={openPreviewPanel}
						>
							<Card appearance="block" url={mockUrl} id="some-id" />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);
			await screen.findByText('I love cheese');
			await screen.findByText('Here is your serving of cheese: 🧀');

			const link = screen.getByRole('link');
			await userEvent.click(link);

			expect(isPreviewPanelAvailable).toHaveBeenCalledWith({
				ari: 'ari:cloud:example:1234',
			});
			expect(openPreviewPanel).toHaveBeenCalledWith({
				ari: 'ari:cloud:example:1234',
				url: mockUrl,
				name: 'I love cheese',
				iconUrl: 'https://www.ilovecheese.com/icon.png',
			});
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'link',
					attributes: expect.objectContaining({
						clickOutcome: 'previewPanel',
					}),
				}),
			);
		});

		it('does not delegate the click to the preview panel handler if the object type is not supported as a preview panel', async () => {
			window.open = jest.fn();
			fgMock.mockImplementation((key) => key === 'fun-1765_wire_up_glance_panel_to_smart_cards');

			const isPreviewPanelAvailable = jest.fn().mockReturnValue(false);
			const openPreviewPanel = jest.fn();

			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider
							client={mockClient}
							isPreviewPanelAvailable={isPreviewPanelAvailable}
							openPreviewPanel={openPreviewPanel}
						>
							<Card appearance="block" url={mockUrl} id="some-id" />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);
			await screen.findByText('I love cheese');
			await screen.findByText('Here is your serving of cheese: 🧀');

			const link = screen.getByRole('link');
			await userEvent.click(link);

			expect(isPreviewPanelAvailable).toHaveBeenCalledWith({
				ari: 'ari:cloud:example:1234',
			});
			expect(openPreviewPanel).not.toHaveBeenCalled();
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'link',
					attributes: expect.objectContaining({
						clickOutcome: 'clickThrough',
					}),
				}),
			);
		});

		it('does not delegate the click to the preview panel handler if clicking with modifier keys', async () => {
			window.open = jest.fn();
			fgMock.mockImplementation((key) => key === 'fun-1765_wire_up_glance_panel_to_smart_cards');

			const isPreviewPanelAvailable = jest.fn().mockReturnValue(true);
			const openPreviewPanel = jest.fn();

			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider
							client={mockClient}
							isPreviewPanelAvailable={isPreviewPanelAvailable}
							openPreviewPanel={openPreviewPanel}
						>
							<Card appearance="block" url={mockUrl} id="some-id" />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);
			await screen.findByText('I love cheese');
			await screen.findByText('Here is your serving of cheese: 🧀');

			const link = screen.getByRole('link');
			link.dispatchEvent(
				new MouseEvent('click', {
					bubbles: true,
					cancelable: true,
					metaKey: true,
				}),
			);

			expect(isPreviewPanelAvailable).not.toHaveBeenCalled();
			expect(openPreviewPanel).not.toHaveBeenCalled();
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'link',
					attributes: expect.objectContaining({
						clickOutcome: 'clickThroughNewTabOrWindow',
					}),
				}),
			);
		});

		it('does not delegate the click to the preview panel handler if the open preview panel method is not provided', async () => {
			window.open = jest.fn();
			fgMock.mockImplementation((key) => key === 'fun-1765_wire_up_glance_panel_to_smart_cards');

			const isPreviewPanelAvailable = jest.fn().mockReturnValue(true);

			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient} isPreviewPanelAvailable={isPreviewPanelAvailable}>
							<Card appearance="block" url={mockUrl} id="some-id" />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);
			await screen.findByText('I love cheese');
			await screen.findByText('Here is your serving of cheese: 🧀');

			const link = screen.getByRole('link');
			await userEvent.click(link);

			expect(isPreviewPanelAvailable).not.toHaveBeenCalled();
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'link',
					attributes: expect.objectContaining({
						clickOutcome: 'clickThrough',
					}),
				}),
			);
		});

		it('does not delegate the click to the preview panel handler if the feature gate is off', async () => {
			// delete this test when cleaning up fun-1765_wire_up_glance_panel_to_smart_cards
			window.open = jest.fn();

			const isPreviewPanelAvailable = jest.fn().mockReturnValue(true);
			const openPreviewPanel = jest.fn();

			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider
							client={mockClient}
							isPreviewPanelAvailable={isPreviewPanelAvailable}
							openPreviewPanel={openPreviewPanel}
						>
							<Card appearance="block" url={mockUrl} id="some-id" />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);
			await screen.findByText('I love cheese');
			await screen.findByText('Here is your serving of cheese: 🧀');

			fgMock.mockReturnValue(false);

			const link = screen.getByRole('link');
			await userEvent.click(link);

			expect(isPreviewPanelAvailable).not.toHaveBeenCalled();
			expect(openPreviewPanel).not.toHaveBeenCalled();
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'link',
					attributes: expect.objectContaining({
						clickOutcome: 'clickThrough',
					}),
				}),
			);
		});
	});

	describe('render method: withUrl', () => {
		describe('> state: loading', () => {
			it('block: should render loading state initially', async () => {
				render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				const loadingView = await screen.findByTestId('smart-block-resolving-view');
				expect(loadingView).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});
		});

		describe('> state: resolved', () => {
			it('block: should render with metadata when resolved', async () => {
				render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				const resolvedViewName = await screen.findByText('I love cheese');
				const resolvedViewDescription = await screen.findByText(
					'Here is your serving of cheese: 🧀',
				);
				expect(resolvedViewName).toBeInTheDocument();
				expect(resolvedViewDescription).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			it('block: should render with metadata when resolved and call onResolve if provided', async () => {
				render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} onResolve={mockOnResolve} />
						</Provider>
					</IntlProvider>,
				);
				const resolvedViewName = await screen.findByText('I love cheese');
				const resolvedViewDescription = await screen.findByText(
					'Here is your serving of cheese: 🧀',
				);
				expect(resolvedViewName).toBeInTheDocument();
				expect(resolvedViewDescription).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(mockOnResolve).toHaveBeenCalledTimes(1);
			});

			it('should re-render when URL changes', async () => {
				const { rerender } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				const resolvedView = await screen.findByText('I love cheese');
				expect(resolvedView).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);

				rerender(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url="https://google.com" />
						</Provider>
					</IntlProvider>,
				);
				await screen.findByText('I love cheese');
				expect(mockFetch).toHaveBeenCalledTimes(2);
			});

			it('should not re-render when appearance changes', async () => {
				const { rerender } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				const resolvedView = await screen.findByText('I love cheese');
				expect(resolvedView).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);

				rerender(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				await screen.findByText('I love cheese');
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			describe('server actions', () => {
				const resolvedLinkText = 'I love cheese';
				const actionElementTestId = 'smart-element-lozenge--trigger';

				const renderWithActionOptions = (actionOptions?: CardActionOptions) =>
					render(
						<FabricAnalyticsListeners client={mockAnalyticsClient}>
							<IntlProvider locale="en">
								<Provider client={mockClient}>
									<Card appearance="block" actionOptions={actionOptions} url={mockUrl} />
								</Provider>
							</IntlProvider>
						</FabricAnalyticsListeners>,
					);

				beforeEach(() => {
					mockFetch.mockImplementationOnce(async () => ({
						...mocks.success,
						data: {
							...mocks.success.data,
							'@type': 'atlassian:Task',
							'atlassian:serverAction': [
								{
									'@type': 'UpdateAction',
									name: 'UpdateAction',
									dataRetrievalAction: {
										'@type': 'ReadAction',
										name: SmartLinkActionType.GetStatusTransitionsAction,
									},
									dataUpdateAction: {
										'@type': 'UpdateAction',
										name: SmartLinkActionType.StatusUpdateAction,
									},
									refField: 'tag',
									resourceIdentifiers: {
										issueKey: 'some-id',
										hostname: 'some-hostname',
									},
								},
							],
							tag: 'status',
						},
					}));
				});

				it('block: renders with actions by default', async () => {
					renderWithActionOptions();

					await screen.findByText(resolvedLinkText);
					const actionElement = screen.getByTestId(actionElementTestId);

					expect(actionElement).toBeInTheDocument();
				});

				it('block: does not render with actions when hidden', async () => {
					renderWithActionOptions({ hide: true });

					await screen.findByText(resolvedLinkText);
					const actionElement = screen.queryByTestId(actionElementTestId);

					expect(actionElement).not.toBeInTheDocument();
				});

				it('block: does render with actions when action options are not hidden', async () => {
					renderWithActionOptions({ hide: false });

					await screen.findByText(resolvedLinkText);
					const actionElement = screen.queryByTestId(actionElementTestId);

					expect(actionElement).toBeInTheDocument();
				});

				it('block: renders with actions and fires click event', async () => {
					renderWithActionOptions();

					await screen.findByText(resolvedLinkText);
					const actionElement = screen.getByTestId(actionElementTestId);
					await userEvent.click(actionElement);
					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							actionSubject: 'button',
							action: 'clicked',
							actionSubjectId: 'smartLinkStatusLozenge',
							attributes: expect.objectContaining({
								display: 'block',
								status: 'resolved',
								extensionKey: 'object-provider',
							}),
						}),
					);
				});
			});
		});

		describe('> state: forbidden', () => {
			describe('with auth services available', () => {
				it('block: renders the forbidden view if no access, with auth prompt', async () => {
					mockFetch.mockImplementationOnce(async () => mocks.forbidden);
					render(
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const frame = await screen.findByTestId('smart-block-forbidden-view');
					expect(frame).toBeInTheDocument();
					const forbiddenLink = await screen.findByText('Restricted content');
					expect(forbiddenLink).toBeInTheDocument();
					const forbiddenLinkButton = await screen.findByTestId(
						'smart-action-connect-other-account',
					);
					expect(forbiddenLinkButton).toBeInTheDocument();
					expect(forbiddenLinkButton).toBeInTheDocument();
					expect(forbiddenLinkButton).toHaveTextContent('Try another account');
					expect(mockFetch).toHaveBeenCalledTimes(1);
					expect(mockOnError).toHaveBeenCalledWith({
						url: mockUrl,
						status: 'forbidden',
					});
				});
			});

			describe('with no auth services available', () => {
				it('block: renders the forbidden view if no access, no auth prompt', async () => {
					mockFetch.mockImplementationOnce(async () => mocks.forbiddenWithNoAuth);
					render(
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const frame = await screen.findByTestId('smart-block-forbidden-view');
					expect(frame).toBeInTheDocument();
					const forbiddenLink = await screen.findByText('Restricted content');
					const forbiddenLinkButton = screen.queryByRole('button');
					expect(forbiddenLink).toBeInTheDocument();
					expect(forbiddenLinkButton).not.toBeInTheDocument();
					expect(mockFetch).toHaveBeenCalledTimes(1);
					expect(mockOnError).toHaveBeenCalledWith({
						url: mockUrl,
						status: 'forbidden',
					});
				});
			});

			describe('with content', () => {
				type ContextProp = { accessType: string; visibility: string };
				type ContentProps = {
					button?: string;
					description: string;
					title?: string;
				};
				const mockResponse = ({ accessType = 'FORBIDDEN', visibility = 'not_found' } = {}) =>
					({
						meta: {
							auth: [],
							visibility,
							access: 'forbidden',
							key: 'jira-object-provider',
							requestAccess: { accessType },
						},

						data: {
							...mocks.forbidden.data,
							generator: mockGenerator,
						},
					}) as JsonLd.Response;

				const setup = async (response = mocks.forbidden) => {
					mockFetch.mockImplementationOnce(async () => response);
					const renderResult = render(
						<Provider client={mockClient}>
							<Card appearance="block" url="https://site.atlassian.net/browse/key-1" />
						</Provider>,
					);
					await new Promise((resolve) => setTimeout(resolve, 1000));

					return renderResult;
				};

				describe.each([
					[
						"site - request access: I don't have access to the site, but I can request access",
						{ accessType: 'REQUEST_ACCESS', visibility: 'not_found' },
						{
							title: 'Join Jira to view this content',
							description:
								'Your team uses Jira to collaborate. Send your admin a request for access.',
							button: 'Request access',
						},
					],
					[
						"site - pending request: I don't have access to the site, but I've already requested access and I'm waiting",
						{ accessType: 'PENDING_REQUEST_EXISTS', visibility: 'not_found' },
						{
							title: 'Access to Jira is pending',
							description: 'Your request to access site.atlassian.net is awaiting admin approval.',
							button: 'Pending approval',
						},
					],
					[
						"site - denied request: I don't have access to the site, and my previous request was denied",
						{ accessType: 'DENIED_REQUEST_EXISTS', visibility: 'not_found' },
						{
							title: "You don't have access to this content",
							description:
								"Your admin didn't approve your request to view Jira pages from site.atlassian.net.",
						},
					],
					[
						"site - direct access: I don't have access to the site, but I can join directly",
						{ accessType: 'DIRECT_ACCESS', visibility: 'not_found' },
						{
							title: 'Join Jira to view this content',
							description:
								'Your team uses Jira to collaborate and you can start using it right away!',
							button: 'Join now',
						},
					],
					[
						'object - request Access: I have access to the site, but not the object',
						{ accessType: 'ACCESS_EXISTS', visibility: 'restricted' },
						{
							title: "You don't have access to this content",
							description: 'Request access to view this content from site.atlassian.net.',
							button: 'Request access',
						},
					],
					[
						'not found, access exists: I have access to the site, but not the object or object is not-found',
						{ accessType: 'ACCESS_EXISTS', visibility: 'not_found' },
						{
							title: "We can't show you this Jira page",
							description:
								"The page doesn't exist or it may have changed after this link was added.",
						},
					],
					[
						'forbidden: When you don’t have access to the site, and you can’t request access',
						{ accessType: 'FORBIDDEN', visibility: 'not_found' },
						{
							title: "You don't have access to this content",
							description: 'Contact your admin to request access to site.atlassian.net.',
						},
					],
				])('%s', (name: string, context: ContextProp, expected: ContentProps) => {
					async () => {
						const { container } = await setup(mockResponse(context));

						if (expected!.title) {
							expect(await screen.findByText(expected.title)).toBeVisible();
						}
						expect(container).toHaveTextContent(expected.description);
						if (expected.button) {
							expect(await screen.findByText(expected.button)).toBeVisible();
						}
						expect(screen.queryByTestId('smart-element-icon')).not.toBeInTheDocument();
					};
				});
			});
		});

		describe('> state: unauthorized', () => {
			describe('with auth services available', () => {
				it('block: renders with connect flow', async () => {
					mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
					render(
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);

					const frame = await screen.findByTestId('smart-block-unauthorized-view');
					expect(frame).toBeInTheDocument();

					const unauthorizedLink = await screen.findByText(mockUrl);
					expect(unauthorizedLink).toBeInTheDocument();
					const unauthorizedLinkButton = await screen.findByTestId('smart-action-connect-account');
					expect(unauthorizedLinkButton).toBeInTheDocument();
					expect(unauthorizedLinkButton.innerHTML).toContain('Connect');
					expect(mockFetch).toHaveBeenCalledTimes(1);
					expect(mockOnError).toHaveBeenCalledWith({
						url: mockUrl,
						status: 'unauthorized',
					});
				});
			});

			describe('with auth services not available', () => {
				it('block: renders without connect flow', async () => {
					mockFetch.mockImplementationOnce(async () => mocks.unauthorizedWithNoAuth);
					render(
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const frame = await screen.findByTestId('smart-block-unauthorized-view');
					expect(frame).toBeInTheDocument();
					const unauthorizedLink = await screen.findByText(mockUrl);
					const unauthorizedLinkButton = screen.queryByRole('button');
					expect(unauthorizedLink).toBeInTheDocument();
					expect(unauthorizedLinkButton).not.toBeInTheDocument();
					expect(mockFetch).toHaveBeenCalledTimes(1);
					expect(mockOnError).toHaveBeenCalledWith({
						url: mockUrl,
						status: 'unauthorized',
					});
				});
			});

			describe('with authFlow explicitly disabled', () => {
				it('block: renders as blue link', async () => {
					mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
					render(
						<Provider client={mockClient} authFlow="disabled">
							<Card appearance="block" url={mockUrl} onError={mockOnError} testId="unauthorized" />
						</Provider>,
					);

					await screen.findByTestId('unauthorized-fallback');

					const dumbLink = await screen.findByText(mockUrl);
					expect(dumbLink).toBeInTheDocument();
					expect(mockFetch).toHaveBeenCalledTimes(1);
					expect(mockOnError).toHaveBeenCalledWith({
						url: mockUrl,
						status: 'fallback',
					});
				});
			});
		});

		describe('> state: error', () => {
			it('block: renders error card when resolve fails', async () => {
				mockFetch.mockImplementationOnce(() => Promise.reject(new Error('Something went wrong')));
				render(
					<Provider client={mockClient}>
						<Card appearance="block" url={mockUrl} onError={mockOnError} />
					</Provider>,
				);
				const frame = await screen.findByTestId('smart-block-errored-view');
				const link = await screen.findByText(mockUrl);

				expect(frame).toBeInTheDocument();
				expect(link).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(mockOnError).toHaveBeenCalledWith({
					url: mockUrl,
					status: 'errored',
				});
			});

			it('block: renders not found card when link not found', async () => {
				mockFetch.mockImplementationOnce(async () => ({
					...mocks.notFound,
					data: { ...mocks.notFound.data, generator: mockGenerator },
				}));
				render(
					<Provider client={mockClient}>
						<Card appearance="block" url={mockUrl} onError={mockOnError} />
					</Provider>,
				);
				const frame = await screen.findByTestId('smart-block-not-found-view');
				expect(frame).toBeInTheDocument();
				const link = await screen.findByText("We can't show you this Jira page");
				expect(link).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(mockOnError).toHaveBeenCalledWith({
					url: mockUrl,
					status: 'not_found',
				});
			});
		});

		describe('> state: invalid', () => {
			it('block: does not throw error when state is invalid', async () => {
				const storeOptions = {
					initialState: { [mockUrl as string]: {} },
				} as CardProviderStoreOpts;
				render(
					<Provider client={mockClient} storeOptions={storeOptions}>
						<Card appearance="block" url={mockUrl} />
					</Provider>,
				);

				const link = await screen.findByTestId('smart-block-resolved-view');
				expect(link).toBeInTheDocument();
			});
		});

		describe('should data export DSP feature testing', () => {
			it('block: resolved state should render unauth view (w/ no service) when resolved with ShouldControlDataExport + FG on', async () => {
				fgMock.mockReturnValue(true);
				useControlDataExportConfigMock.mockReturnValue({
					shouldControlDataExport: true,
				});
				getIsDataExportEnabledMock.mockReturnValue(true);
				render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} onResolve={mockOnResolve} />
						</Provider>
					</IntlProvider>,
				);
				const unauthView = await screen.findByTestId('smart-block-unauthorized-view-content');
				expect(unauthView).toBeInTheDocument();
				// With this FG on, we just block the description/preview, the title is OK
				const resolvedViewName = await screen.findByText('I love cheese');
				const unauthorizedLinkButton = screen.queryByRole('button');
				expect(resolvedViewName).toBeInTheDocument();
				expect(unauthorizedLinkButton).not.toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			it('block: should render with metadata when resolved (with ShouldControlDataExport + FF off) and return a resolved view', async () => {
				fgMock.mockReturnValue(false);
				useControlDataExportConfigMock.mockReturnValue({
					shouldControlDataExport: false,
				});
				getIsDataExportEnabledMock.mockReturnValue(false);
				render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				const resolvedViewName = await screen.findByText('I love cheese');
				const resolvedViewDescription = await screen.findByText(
					'Here is your serving of cheese: 🧀',
				);
				expect(resolvedViewName).toBeInTheDocument();
				expect(resolvedViewDescription).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			it('block: should render with metadata when resolved (with ShouldControlDataExport off + FF on) and return a resolved view', async () => {
				fgMock.mockReturnValue(true);
				useControlDataExportConfigMock.mockReturnValue({
					shouldControlDataExport: false,
				});
				getIsDataExportEnabledMock.mockReturnValue(false);
				render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				const resolvedViewName = await screen.findByText('I love cheese');
				const resolvedViewDescription = await screen.findByText(
					'Here is your serving of cheese: 🧀',
				);
				expect(resolvedViewName).toBeInTheDocument();
				expect(resolvedViewDescription).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});
		});
	});
});
