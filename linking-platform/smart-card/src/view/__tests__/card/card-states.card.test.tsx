import './card-states.card.test.mock';

import { SmartLinkActionType } from '@atlaskit/linking-types';
import { type JsonLd } from 'json-ld-types';

import * as analytics from '../../../utils/analytics';
import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { type CardClient, type CardProviderStoreOpts } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import '@atlaskit/link-test-helpers/jest';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import { fakeFactory, mockGenerator, mocks } from '../../../utils/mocks';
import { IntlProvider } from 'react-intl-next';
import type { CardActionOptions } from '../../Card/types';

const mockUrl = 'https://some.url';

mockSimpleIntersectionObserver();

describe('smart-card: card states, block', () => {
	const mockOnError = jest.fn();
	const mockOnResolve = jest.fn();
	let mockClient: CardClient;
	let mockFetch: jest.Mock;

	beforeEach(() => {
		mockFetch = jest.fn(() => Promise.resolve(mocks.success));
		mockClient = new (fakeFactory(mockFetch))();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('render method: withUrl', () => {
		describe('> state: loading', () => {
			/**
			 * Note EDM-10399 React18 Migration: This test is a bit odd as it asserts a loading state (an intermediate state),
			 * then asserts that the loading state is removed and a mocked function was called.
			 */
			it('block: should render loading state initially', async () => {
				const { getByTestId, queryByTestId } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);

				await waitFor(async () => {
					expect(getByTestId('block-card-resolving-view')).toBeInTheDocument();
				});

				await waitFor(() => {
					expect(queryByTestId('block-card-resolving-view')).not.toBeInTheDocument();
				});
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});
		});

		describe('> state: resolved', () => {
			it('block: should render with metadata when resolved', async () => {
				const { findByText } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				const resolvedViewName = await findByText('I love cheese');
				const resolvedViewDescription = await findByText('Here is your serving of cheese: 🧀');
				expect(resolvedViewName).toBeInTheDocument();
				expect(resolvedViewDescription).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
				expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						display: 'block',
						status: 'resolved',
					}),
				);
			});

			it('block: should render with metadata when resolved and call onResolve if provided', async () => {
				const { findByText } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} onResolve={mockOnResolve} />
						</Provider>
					</IntlProvider>,
				);
				const resolvedViewName = await findByText('I love cheese');
				const resolvedViewDescription = await findByText('Here is your serving of cheese: 🧀');
				expect(resolvedViewName).toBeInTheDocument();
				expect(resolvedViewDescription).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(mockOnResolve).toHaveBeenCalledTimes(1);
			});

			it('should re-render when URL changes', async () => {
				let resolvedView = null;
				const { findByText, rerender } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				resolvedView = await findByText('I love cheese');
				expect(resolvedView).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);

				rerender(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url="https://google.com" />
						</Provider>
					</IntlProvider>,
				);
				resolvedView = await findByText('I love cheese');
				expect(mockFetch).toHaveBeenCalledTimes(2);
			});

			it('should not re-render when appearance changes', async () => {
				let resolvedView = null;
				const { findByText, rerender } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				resolvedView = await findByText('I love cheese');
				expect(resolvedView).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);

				rerender(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				resolvedView = await findByText('I love cheese');
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});
		});

		describe('> state: forbidden', () => {
			describe('with auth services available', () => {
				it('block: renders the forbidden view if no access, with auth prompt', async () => {
					mockFetch.mockImplementationOnce(async () => mocks.forbidden);
					const { findByText, findByTestId, container } = render(
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const frame = await findByTestId('block-card-forbidden-view');
					expect(frame).toBeInTheDocument();
					const forbiddenLink = await findByText(mockUrl);
					expect(forbiddenLink).toBeInTheDocument();
					const forbiddenLinkButton = container.querySelector('button');
					expect(forbiddenLinkButton).toBeInTheDocument();
					expect(forbiddenLinkButton!.textContent).toContain('Try another account');
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
					const { findByText, findByTestId, container } = render(
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const frame = await findByTestId('block-card-forbidden-view');
					expect(frame).toBeInTheDocument();
					const forbiddenLink = await findByText(mockUrl);
					const forbiddenLinkButton = container.querySelector('button');
					expect(forbiddenLink).toBeInTheDocument();
					expect(forbiddenLinkButton).not.toBeInTheDocument();
					expect(mockFetch).toHaveBeenCalledTimes(1);
					expect(mockOnError).toHaveBeenCalledWith({
						url: mockUrl,
						status: 'forbidden',
					});
				});
			});
		});

		describe('> state: unauthorized', () => {
			describe('with auth services available', () => {
				it('block: renders with connect flow', async () => {
					mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
					const { findByText, getByTestId, findByTestId } = render(
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const frame = await findByTestId('block-card-unauthorized-view');
					expect(frame).toBeInTheDocument();
					const unauthorizedLink = await findByText(mockUrl);
					expect(unauthorizedLink).toBeInTheDocument();
					const unauthorizedLinkButton = getByTestId('button-connect-account');
					expect(unauthorizedLinkButton).toBeInTheDocument();
					expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
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
					const { findByText, findByTestId, container } = render(
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const frame = await findByTestId('block-card-unauthorized-view');
					expect(frame).toBeInTheDocument();
					const unauthorizedLink = await findByText(mockUrl);
					const unauthorizedLinkButton = container.querySelector('button');
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
					const { findByTestId } = render(
						<Provider client={mockClient} authFlow="disabled">
							<Card
								testId="disabled-authFlow-card"
								appearance="block"
								url={mockUrl}
								onError={mockOnError}
							/>
						</Provider>,
					);
					const dumbLink = await findByTestId('disabled-authFlow-card-fallback');
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
				const { findByText, findByTestId } = render(
					<Provider client={mockClient}>
						<Card appearance="block" url={mockUrl} onError={mockOnError} />
					</Provider>,
				);
				const frame = await findByTestId('block-card-errored-view');
				const link = await findByText(mockUrl);

				expect(frame).toBeInTheDocument();
				expect(link).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(mockOnError).toHaveBeenCalledWith({
					url: mockUrl,
					status: 'errored',
				});
			});

			it('block: renders not found card when link not found', async () => {
				mockFetch.mockImplementationOnce(async () => mocks.notFound);
				const { findByText, findByTestId } = render(
					<Provider client={mockClient}>
						<Card appearance="block" url={mockUrl} onError={mockOnError} />
					</Provider>,
				);
				const frame = await findByTestId('block-card-not-found-view');
				expect(frame).toBeInTheDocument();
				const link = await findByText(mockUrl);
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
				const { findByTestId } = render(
					<Provider client={mockClient} storeOptions={storeOptions}>
						<Card appearance="block" url={mockUrl} />
					</Provider>,
				);

				const link = await findByTestId('block-card-resolved-view');
				expect(link).toBeInTheDocument();
			});
		});
	});

	describe('link clicked', () => {
		it('fires `link clicked` analytics event when clicked', async () => {
			window.open = jest.fn();
			const onEvent = jest.fn();
			const { getByRole, findByText } = render(
				<AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={onEvent}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} id="some-id" />
						</Provider>
					</IntlProvider>
				</AnalyticsListener>,
			);
			await findByText('I love cheese');

			const link = getByRole('link');
			fireEvent.click(link);

			expect(onEvent).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'clicked',
						actionSubject: 'link',
					},
					context: [
						{
							componentName: 'smart-cards',
						},
						{
							attributes: {
								display: 'block',
								id: 'some-id',
							},
						},
						{
							attributes: {
								status: 'resolved',
							},
						},
					],
				},
				ANALYTICS_CHANNEL,
			);
		});
	});
	describe('render method: withUrl and new FF', () => {
		describe('> state: loading', () => {
			it('block: should render loading state initially', async () => {
				const { findByTestId } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				const loadingView = await findByTestId('smart-block-resolving-view');
				expect(loadingView).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			it(`block: shouldn't render loading state initially if useLegacyBlockCard passed`, async () => {
				const { queryByTestId, findByTestId } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
							<Card appearance="block" url={mockUrl} useLegacyBlockCard={true} />
						</Provider>
					</IntlProvider>,
				);

				const oldLoadingView = await findByTestId('block-card-resolving-view');
				expect(oldLoadingView).toBeTruthy();

				const smartLoadingView = await waitFor(() => queryByTestId('smart-block-resolving-view'), {
					timeout: 1000,
				});
				expect(smartLoadingView).toBeNull();
			});
		});

		describe('> state: resolved', () => {
			it('block: should render with metadata when resolved', async () => {
				const { findByText } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				const resolvedViewName = await findByText('I love cheese');
				const resolvedViewDescription = await findByText('Here is your serving of cheese: 🧀');
				expect(resolvedViewName).toBeInTheDocument();
				expect(resolvedViewDescription).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			it('block: should render with metadata when resolved and call onResolve if provided', async () => {
				const { findByText } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
							<Card appearance="block" url={mockUrl} onResolve={mockOnResolve} />
						</Provider>
					</IntlProvider>,
				);
				const resolvedViewName = await findByText('I love cheese');
				const resolvedViewDescription = await findByText('Here is your serving of cheese: 🧀');
				expect(resolvedViewName).toBeInTheDocument();
				expect(resolvedViewDescription).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(mockOnResolve).toHaveBeenCalledTimes(1);
			});

			it('should re-render when URL changes', async () => {
				let resolvedView = null;
				const { findByText, rerender } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				resolvedView = await findByText('I love cheese');
				expect(resolvedView).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);

				rerender(
					<IntlProvider locale="en">
						<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
							<Card appearance="block" url="https://google.com" />
						</Provider>
					</IntlProvider>,
				);
				resolvedView = await findByText('I love cheese');
				expect(mockFetch).toHaveBeenCalledTimes(2);
			});

			it('should not re-render when appearance changes', async () => {
				let resolvedView = null;
				const { findByText, rerender } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				resolvedView = await findByText('I love cheese');
				expect(resolvedView).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);

				rerender(
					<IntlProvider locale="en">
						<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				resolvedView = await findByText('I love cheese');
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			describe('server actions', () => {
				const resolvedLinkText = 'I love cheese';
				const actionElementTestId = 'smart-element-lozenge--trigger';

				const renderWithShowServerActions = (
					showServerActions?: boolean,
					actionOptions?: CardActionOptions,
				) =>
					render(
						<IntlProvider locale="en">
							<Provider
								client={mockClient}
								featureFlags={{
									enableFlexibleBlockCard: true,
								}}
							>
								<Card
									appearance="block"
									showServerActions={showServerActions}
									actionOptions={actionOptions}
									url={mockUrl}
								/>
							</Provider>
						</IntlProvider>,
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

				it('block: renders with server actions when showServerActions is true', async () => {
					const { findByText, getByTestId } = renderWithShowServerActions(true);

					await findByText(resolvedLinkText);
					const actionElement = await getByTestId(actionElementTestId);

					expect(actionElement).toBeInTheDocument();
				});

				it('block: does not render with server actions when showServerActions is false', async () => {
					const { findByText, queryByTestId } = renderWithShowServerActions(false);

					await findByText(resolvedLinkText);
					const actionElement = queryByTestId(actionElementTestId);

					expect(actionElement).not.toBeInTheDocument();
				});

				it('block: does render with server actions when showServerActions and action options are not provided', async () => {
					const { findByText, queryByTestId } = renderWithShowServerActions();

					await findByText(resolvedLinkText);
					const actionElement = queryByTestId(actionElementTestId);

					expect(actionElement).toBeInTheDocument();
				});

				it('block: does render with server actions when showServerActions is not provided and action options are not hidden', async () => {
					const { findByText, queryByTestId } = renderWithShowServerActions(undefined, {
						hide: false,
					});

					await findByText(resolvedLinkText);
					const actionElement = queryByTestId(actionElementTestId);

					expect(actionElement).toBeInTheDocument();
				});

				// testing that action options takes precendence over showServerActions
				it('block: does render with server actions when showServerActions is false and action options are not hidden', async () => {
					const { findByText, queryByTestId } = renderWithShowServerActions(false, { hide: false });

					await findByText(resolvedLinkText);
					const actionElement = queryByTestId(actionElementTestId);

					expect(actionElement).toBeInTheDocument();
				});

				it('block: renders with server actions and fires click event when showServerActions is true', async () => {
					const { findByText, getByTestId } = renderWithShowServerActions(true);

					await findByText(resolvedLinkText);
					const actionElement = getByTestId(actionElementTestId);
					act(() => {
						fireEvent.click(actionElement);
					});
					expect(analytics.uiSmartLinkStatusLozengeButtonClicked).toHaveBeenCalledTimes(1);
				});
			});
		});

		describe('> state: forbidden', () => {
			describe('with auth services available', () => {
				it('block: renders the forbidden view if no access, with auth prompt', async () => {
					mockFetch.mockImplementationOnce(async () => mocks.forbidden);
					const { findByText, findByTestId } = render(
						<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
							<Card appearance="block" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const frame = await findByTestId('smart-block-forbidden-view');
					expect(frame).toBeInTheDocument();
					const forbiddenLink = await findByText('Restricted content');
					expect(forbiddenLink).toBeInTheDocument();
					const forbiddenLinkButton = await findByTestId('smart-action-connect-other-account');
					expect(forbiddenLinkButton).toBeInTheDocument();
					expect(forbiddenLinkButton).toBeInTheDocument();
					expect(forbiddenLinkButton!.textContent).toContain('Try another account');
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
					const { findByText, findByTestId, container } = render(
						<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
							<Card appearance="block" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const frame = await findByTestId('smart-block-forbidden-view');
					expect(frame).toBeInTheDocument();
					const forbiddenLink = await findByText('Restricted content');
					const forbiddenLinkButton = container.querySelector('button');
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
						<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
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
						const { container, findByText, queryByTestId } = await setup(mockResponse(context));

						if (expected!.title) {
							expect(await findByText(expected.title)).toBeVisible();
						}
						expect(container).toHaveTextContent(expected.description);
						if (expected.button) {
							expect(await findByText(expected.button)).toBeVisible();
						}
						expect(queryByTestId('smart-element-icon')).not.toBeInTheDocument();
					};
				});
			});
		});

		describe('> state: unauthorized', () => {
			describe('with auth services available', () => {
				it('block: renders with connect flow', async () => {
					mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
					const { findByText, findByTestId } = render(
						<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
							<Card appearance="block" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);

					const frame = await findByTestId('smart-block-unauthorized-view');
					expect(frame).toBeInTheDocument();

					const unauthorizedLink = await findByText(mockUrl);
					expect(unauthorizedLink).toBeInTheDocument();
					const unauthorizedLinkButton = await findByTestId('smart-action-connect-account');
					expect(unauthorizedLinkButton).toBeInTheDocument();
					expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
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
					const { findByText, findByTestId, container } = render(
						<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
							<Card appearance="block" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const frame = await findByTestId('smart-block-unauthorized-view');
					expect(frame).toBeInTheDocument();
					const unauthorizedLink = await findByText(mockUrl);
					const unauthorizedLinkButton = container.querySelector('button');
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
					const { findByText } = render(
						<Provider client={mockClient} authFlow="disabled">
							<Card appearance="block" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const dumbLink = await findByText(mockUrl);
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
				const { findByText, findByTestId } = render(
					<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
						<Card appearance="block" url={mockUrl} onError={mockOnError} />
					</Provider>,
				);
				const frame = await findByTestId('smart-block-errored-view');
				const link = await findByText(mockUrl);

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
				const { findByText, findByTestId } = render(
					<Provider client={mockClient} featureFlags={{ enableFlexibleBlockCard: true }}>
						<Card appearance="block" url={mockUrl} onError={mockOnError} />
					</Provider>,
				);
				const frame = await findByTestId('smart-block-not-found-view');
				expect(frame).toBeInTheDocument();
				const link = await findByText("We can't show you this Jira page");
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
				const { findByTestId } = render(
					<Provider client={mockClient} storeOptions={storeOptions}>
						<Card appearance="block" url={mockUrl} />
					</Provider>,
				);

				const link = await findByTestId('block-card-resolved-view');
				expect(link).toBeInTheDocument();
			});
		});
	});

	describe('render method: withData', () => {
		describe('> state: resolved', () => {
			it('block: renders successfully with data', async () => {
				const { findByText } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} data={mocks.success.data} />
						</Provider>
					</IntlProvider>,
				);
				const resolvedViewName = await findByText('I love cheese');
				const resolvedViewDescription = await findByText('Here is your serving of cheese: 🧀');
				expect(resolvedViewName).toBeInTheDocument();
				expect(resolvedViewDescription).toBeInTheDocument();
			});
		});
	});
});
