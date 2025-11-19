import React from 'react';

import { render } from '@testing-library/react';
import { FormattedMessage, injectIntl, IntlProvider } from 'react-intl-next';

import { messages } from '../../../../messages';
import withIntlProvider from '../index';

describe('withIntlProvider', () => {
	const BaseComponent = () => <FormattedMessage {...messages.close} />;
	const TestComponent = injectIntl(withIntlProvider(BaseComponent), { enforceContext: false });

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<TestComponent />
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});

	it('does not throw when component is not inside IntlProvider', () => {
		expect(() => render(<TestComponent />)).not.toThrow();
	});

	it('does not throw when component is inside IntlProvider', () => {
		expect(() =>
			render(
				<IntlProvider locale="en">
					<TestComponent />
				</IntlProvider>,
			),
		).not.toThrow();
	});
});
