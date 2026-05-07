import React from 'react';

import { defineMessages, IntlProvider, useIntl } from 'react-intl';

import { render, screen } from '@atlassian/testing-library';

import { type AsyncLanguagesMap, createAsyncIntlProvider } from './create-async-intl-provider';
import { type I18NMessages } from './types';

describe('createAsyncIntlProvider', () => {
	const messages = defineMessages({
		hello: {
			id: 'hello',
			defaultMessage: 'Hello (default)',
			description: 'A greeting used in tests',
		},
	});

	const defaultMessages: I18NMessages = {
		hello: 'Hello (default)',
	};

	const Greeting = () => {
		const intl = useIntl();
		return <div data-testid="greeting">{intl.formatMessage(messages.hello)}</div>;
	};

	beforeEach(() => {
		const consoleErrorSpy = jest.spyOn(console, 'error');
		consoleErrorSpy.mockImplementation(jest.fn);
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	const renderWithLocale = (
		locale: string,
		AsyncProvider: (props: { children: React.ReactNode }) => React.JSX.Element,
	) =>
		render(
			<IntlProvider locale={locale} messages={{}}>
				<AsyncProvider>
					<Greeting />
				</AsyncProvider>
			</IntlProvider>,
		);

	it('has no a11y violations', async () => {
		const asyncLanguages: AsyncLanguagesMap = {
			fr: () => Promise.resolve({ default: { hello: 'Bonjour' } }),
		};
		const AsyncProvider = createAsyncIntlProvider({ defaultMessages, asyncLanguages });

		const { container } = renderWithLocale('fr', AsyncProvider);

		await expect(container).toBeAccessible();
	});

	it('shows defaultMessages synchronously then swaps to the loaded translation', async () => {
		const asyncLanguages: AsyncLanguagesMap = {
			fr: () => Promise.resolve({ default: { hello: 'Bonjour (chargé)' } }),
		};

		const AsyncProvider = createAsyncIntlProvider({ defaultMessages, asyncLanguages });

		renderWithLocale('fr', AsyncProvider);

		// Default English shown synchronously while the async loader resolves.
		expect(screen.getByTestId('greeting')).toHaveTextContent('Hello (default)');

		// After the loader resolves, the translated message is rendered.
		expect(await screen.findByText('Bonjour (chargé)')).toBeInTheDocument();
	});

	it('falls back from a region-qualified locale (e.g. `de-DE`) to the generic locale (`de`)', async () => {
		const deLoader = jest.fn().mockResolvedValue({ default: { hello: 'Hallo (geladen)' } });
		const asyncLanguages: AsyncLanguagesMap = { de: deLoader };

		const AsyncProvider = createAsyncIntlProvider({ defaultMessages, asyncLanguages });

		renderWithLocale('de-DE', AsyncProvider);

		expect(await screen.findByText('Hallo (geladen)')).toBeInTheDocument();
		expect(deLoader).toHaveBeenCalledTimes(1);
	});

	it('keeps showing defaultMessages and calls onLoadError when the loader throws', async () => {
		const error = new Error('network down');
		const onLoadError = jest.fn();
		const asyncLanguages: AsyncLanguagesMap = {
			fr: () => Promise.reject(error),
		};

		const AsyncProvider = createAsyncIntlProvider({
			defaultMessages,
			asyncLanguages,
			onLoadError,
		});

		renderWithLocale('fr', AsyncProvider);

		// Wait for the rejected promise to settle before asserting on the callback.
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(onLoadError).toHaveBeenCalledTimes(1);
		expect(onLoadError).toHaveBeenCalledWith('fr', error);

		// Default messages remain on screen because translation never loaded.
		expect(screen.getByTestId('greeting')).toHaveTextContent('Hello (default)');
	});

	it('falls back to defaultMessages for an unknown locale (no map entry)', async () => {
		const onLoadError = jest.fn();
		const asyncLanguages: AsyncLanguagesMap = {
			fr: () => Promise.resolve({ default: { hello: 'Bonjour' } }),
		};

		const AsyncProvider = createAsyncIntlProvider({
			defaultMessages,
			asyncLanguages,
			onLoadError,
		});

		renderWithLocale('xx-YY', AsyncProvider);

		expect(screen.getByTestId('greeting')).toHaveTextContent('Hello (default)');

		// Wait one tick for the loader promise chain to settle.
		await new Promise((resolve) => setTimeout(resolve, 0));

		// No error should be reported when the locale simply isn't in the map.
		expect(onLoadError).not.toHaveBeenCalled();
		expect(screen.getByTestId('greeting')).toHaveTextContent('Hello (default)');
	});

	it('renders children unchanged and skips IntlMessagesProvider when `disabled` is true', () => {
		const loader = jest.fn();
		const asyncLanguages: AsyncLanguagesMap = { fr: loader };

		const AsyncProvider = createAsyncIntlProvider({ defaultMessages, asyncLanguages });

		render(
			<IntlProvider locale="fr" messages={{ hello: 'Bonjour (parent)' }}>
				<AsyncProvider disabled>
					<Greeting />
				</AsyncProvider>
			</IntlProvider>,
		);

		// The parent IntlProvider's message should be used because the async
		// provider is a passthrough when disabled.
		expect(screen.getByTestId('greeting')).toHaveTextContent('Bonjour (parent)');

		// And the loader is never called.
		expect(loader).not.toHaveBeenCalled();
	});
});
