import React from 'react';

import { act, render, screen } from '@testing-library/react';
import { defineMessages, IntlProvider, useIntl } from 'react-intl-next';

import { ManualPromise } from '@atlaskit/link-test-helpers';

import { fetchMessagesForLocale } from './lazy-messages-provider/utils/fetch-messages-for-locale';

jest.mock('./lazy-messages-provider/utils/fetch-messages-for-locale', () => ({
	fetchMessagesForLocale: jest.fn(() => ({})),
}));

describe('MessagesProvider', () => {
	let MessagesProvider: React.ComponentType<React.PropsWithChildren<{}>>;

	beforeEach(() => {
		jest.clearAllMocks();
		MessagesProvider = require('./index').MessagesProvider;
	});

	type SetupProps = { locale: string; children?: React.ReactNode };

	const setup = (
		{ locale, children }: SetupProps = {
			locale: 'en',
		},
	) => {
		return render(
			<IntlProvider defaultLocale="en" locale={locale}>
				<MessagesProvider>{children}</MessagesProvider>
			</IntlProvider>,
		);
	};

	const messages = defineMessages({
		foo: {
			id: 'foo',
			defaultMessage: 'Default string',
			description: 'An arbitrary string used in tests',
		},
	});

	const Component = () => {
		const intl = useIntl();
		return <div>{intl.formatMessage(messages.foo)}</div>;
	};

	const translated = { foo: 'Translated string' };

	const props = {
		locale: 'es',
		children: (
			<div>
				<Component />
			</div>
		),
	};

	it('should automatically load translations', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		const promise = new ManualPromise(translated);
		jest.mocked(fetchMessagesForLocale).mockReturnValue(promise);

		setup(props);

		expect(screen.queryByText('Translated string')).not.toBeInTheDocument();

		act(() => {
			promise.resolve(translated);
		});

		expect(await screen.findByText('Translated string')).toBeInTheDocument();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = setup(props);

		await expect(container).toBeAccessible();
	});
});
