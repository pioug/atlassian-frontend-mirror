import { type CardProviderProps } from '../types';

jest.mock('@atlaskit/link-extractors', () => ({
	...jest.requireActual<Object>('@atlaskit/link-extractors'),
	extractPreview: () => 'some-link-preview',
	extractSmartLinkEmbed: () => 'some-live-embed-url',
}));

import React from 'react';
import { act, render } from '@testing-library/react';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { SmartCardContext as Context } from '..';
import CardClient from '../../../client';
import { SmartCardProvider, type CardContext } from '..';
import { SMART_CARD_EXTERNAL_AUTH_EVENT } from '../../../provider';
import { APIError, type CardStore } from '@atlaskit/linking-common';

describe('Provider', () => {
	it('should setup provider with default options', () => {
		const fn = jest.fn();
		const client = new CardClient();
		render(
			<SmartCardProvider client={client}>
				<Context.Consumer>{fn}</Context.Consumer>
			</SmartCardProvider>,
		);

		expect(fn).toBeCalledWith(
			expect.objectContaining({
				config: {
					authFlow: 'oauth2',
				},
				connections: {
					client,
				},
			}),
		);
	});

	it('should setup provider with custom options', () => {
		const fn = jest.fn();
		const client = new CardClient();
		render(
			<SmartCardProvider client={client}>
				<Context.Consumer>{fn}</Context.Consumer>
			</SmartCardProvider>,
		);
		expect(fn).toBeCalledWith(
			expect.objectContaining({
				config: {
					authFlow: 'oauth2',
				},
				connections: {
					client,
				},
			}),
		);
	});

	it('should reuse top-level provider when nested with other providers', () => {
		const fn = jest.fn();
		const client = new CardClient();
		render(
			<SmartCardProvider client={client}>
				<SmartCardProvider client={client}>
					<Context.Consumer>{fn}</Context.Consumer>
				</SmartCardProvider>
			</SmartCardProvider>,
		);
		expect(fn).toBeCalledWith(
			expect.objectContaining({
				config: {
					authFlow: 'oauth2',
				},
				connections: {
					client,
				},
			}),
		);
	});

	it('should expose extractors to consumers', () => {
		const fn = (context?: CardContext) => {
			const linkPreview = context && context.extractors.getPreview('some-url');
			expect(linkPreview).toEqual('some-live-embed-url');
			return <div></div>;
		};

		const client = new CardClient();
		const initialState: CardStore = {
			'some-url': {
				status: 'resolved',
				details: {} as any,
			},
		};

		render(
			<SmartCardProvider client={client} storeOptions={{ initialState }}>
				<Context.Consumer>{fn}</Context.Consumer>
			</SmartCardProvider>,
		);
	});

	it('should expose extractors to consumers', () => {
		const fn = (context?: CardContext) => {
			const linkPreview = context && context.extractors.getPreview('some-url');
			expect(linkPreview).toEqual('some-live-embed-url');
			return <div></div>;
		};

		const client = new CardClient();
		const initialState: CardStore = {
			'some-url': {
				status: 'resolved',
				details: {} as any,
			},
		};

		render(
			<SmartCardProvider client={client} storeOptions={{ initialState }}>
				<Context.Consumer>{fn}</Context.Consumer>
			</SmartCardProvider>,
		);
	});

	it('should expose isAdminHubAIEnabled to consumers', () => {
		const fn = jest.fn();
		render(
			<SmartCardProvider isAdminHubAIEnabled={true}>
				<Context.Consumer>{fn}</Context.Consumer>
			</SmartCardProvider>,
		);

		expect(fn).toBeCalledWith(
			expect.objectContaining({
				isAdminHubAIEnabled: true,
			}),
		);
	});

	it('should expose product to consumers', () => {
		const fn = jest.fn();
		render(
			<SmartCardProvider product="CONFLUENCE">
				<Context.Consumer>{fn}</Context.Consumer>
			</SmartCardProvider>,
		);

		expect(fn).toBeCalledWith(
			expect.objectContaining({
				product: 'CONFLUENCE',
			}),
		);
	});

	const initialState = {};
	it.each<[string, Partial<CardProviderProps>, Partial<CardProviderProps>]>([
		['card client is', {}, { client: new CardClient() }],
		['auth flow is', {}, { authFlow: 'disabled' }],
		['renderers are', {}, { renderers: {} }],
		[
			'whole store options outside object reference is',
			{ storeOptions: { initialState } },
			{ storeOptions: { initialState } },
		],
	])('should not re-create store when %s updated', (_, initialProviderProps, newProviderProps) => {
		const fn = jest.fn();
		const { rerender } = render(
			<SmartCardProvider {...initialProviderProps}>
				<Context.Consumer>{fn}</Context.Consumer>
			</SmartCardProvider>,
		);

		expect(fn).toBeCalledTimes(1);

		const { store } = fn.mock.calls[0][0] as CardContext;

		rerender(
			<SmartCardProvider {...newProviderProps}>
				<Context.Consumer>{fn}</Context.Consumer>
			</SmartCardProvider>,
		);

		expect(fn).toBeCalledTimes(2);

		const { store: newStore } = fn.mock.calls[1][0] as CardContext;

		expect(store).toStrictEqual(newStore);
	});

	it('should re-create redux store when initialState prop has updated', () => {
		const fn = jest.fn();
		const { rerender } = render(
			<SmartCardProvider storeOptions={{ initialState }}>
				<Context.Consumer>{fn}</Context.Consumer>
			</SmartCardProvider>,
		);

		expect(fn).toBeCalledTimes(1);

		const { store } = fn.mock.calls[0][0] as CardContext;

		rerender(
			<SmartCardProvider storeOptions={{ initialState: {} }}>
				<Context.Consumer>{fn}</Context.Consumer>
			</SmartCardProvider>,
		);

		expect(fn).toBeCalledTimes(2);

		const { store: newStore } = fn.mock.calls[1][0] as CardContext;

		expect(store).not.toBe(newStore);
	});

	it('should capture and report a11y violations', async () => {
		const fn = jest.fn();
		const client = new CardClient();
		const { container } = render(
			<SmartCardProvider client={client}>
				<Context.Consumer>{fn}</Context.Consumer>
			</SmartCardProvider>,
		);

		await expect(container).toBeAccessible();
	});

	describe('external auth completion listener', () => {
		const EXTENSION_KEY = 'figma-object-provider';
		const UNAUTHORIZED_URL = 'https://www.figma.com/file/some-file';

		const dispatchExternalAuthEvent = async () => {
			await act(async () => {
				window.dispatchEvent(
					new CustomEvent(SMART_CARD_EXTERNAL_AUTH_EVENT, {
						detail: { extensionKeys: [EXTENSION_KEY] },
					}),
				);
				// Flush the microtask queue so the fetchData promise settles.
				await Promise.resolve();
			});
		};

		const renderWithUnauthorizedCard = (client: CardClient) => {
			const fn = jest.fn();
			const initialState: CardStore = {
				[UNAUTHORIZED_URL]: {
					status: 'unauthorized',
					details: { meta: { key: EXTENSION_KEY } } as any,
				},
			};

			render(
				<SmartCardProvider client={client} storeOptions={{ initialState }}>
					<Context.Consumer>{fn}</Context.Consumer>
				</SmartCardProvider>,
			);

			const { store } = fn.mock.calls[0][0] as CardContext;
			return store;
		};

		ffTest.on('navx-smartcard-auth-event-listener-killswitch-fg', '', () => {
			ffTest.on('platform_lp_navx_5358_dont_throw_error', '', () => {
				it('does not turn an unauthorized card into a fatal error when the URL is unsupported', async () => {
					// Regression test for NAVX-5358.
					//
					// When an external auth event fires, the provider re-fetches every unauthorized
					// card. If the resolver reports the URL as unsupported (a benign, expected state),
					// fetchData rejects with a fatal `APIError` of type `UnsupportedError`. Writing that
					// error into the store flips the card to `errored`, which downstream non-flexible
					// smart-card rendering re-throws to the CardErrorBoundary -> Sentry
					// (`APIError: URL not supported`).
					//
					// With `platform_lp_navx_5358_dont_throw_error` enabled, the card should instead
					// stay `unauthorized` and no error should be stored.
					const client = new CardClient();
					jest
						.spyOn(client, 'fetchData')
						.mockRejectedValue(
							new APIError('fatal', 'www.figma.com', 'URL not supported', 'UnsupportedError'),
						);

					const store = renderWithUnauthorizedCard(client);

					await dispatchExternalAuthEvent();

					const cardState = store.getState()[UNAUTHORIZED_URL];
					expect(client.fetchData).toHaveBeenCalledWith(UNAUTHORIZED_URL, true);
					expect(cardState.status).toBe('unauthorized');
					expect(cardState.error).toBeUndefined();
				});
			});

			ffTest.both('platform_lp_navx_5358_dont_throw_error', '', () => {
				it('still errors an unauthorized card when the fetch fails with a non-unsupported error', async () => {
					const client = new CardClient();
					const error = new APIError(
						'fatal',
						'www.figma.com',
						'Something went wrong',
						'TimeoutError',
					);
					jest.spyOn(client, 'fetchData').mockRejectedValue(error);

					const store = renderWithUnauthorizedCard(client);

					await dispatchExternalAuthEvent();

					const cardState = store.getState()[UNAUTHORIZED_URL];
					expect(cardState.status).toBe('errored');
					expect(cardState.error).toBe(error);
				});
			});
		});
	});
});
