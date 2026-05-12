import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { IntlProvider } from 'react-intl';
import { IconMessage, CheckInternetConnection } from '..';

const testMessageDescriptor = {
	id: 'test.creating_preview',
	defaultMessage: 'Creating preview...',
};

describe('iconMessage', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<IconMessage messageDescriptor={testMessageDescriptor} />
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});

	it('should be rendered properly', () => {
		render(
			<IntlProvider locale="en">
				<IconMessage messageDescriptor={testMessageDescriptor} />
			</IntlProvider>,
		);
		expect(screen.getByText('Creating preview...')).toBeInTheDocument();
	});
});

describe('CheckInternetConnection', () => {
	it('should render correctly', () => {
		render(
			<IntlProvider locale="en">
				<CheckInternetConnection />
			</IntlProvider>,
		);
		expect(
			screen.getByText('Failed to load. Please check your internet connection'),
		).toBeInTheDocument();
	});

	it('should display the correct message from i18n', () => {
		render(
			<IntlProvider locale="en">
				<CheckInternetConnection />
			</IntlProvider>,
		);
		expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
	});

	it('should pass through props correctly', () => {
		render(
			<IntlProvider locale="en">
				<CheckInternetConnection />
			</IntlProvider>,
		);
		expect(
			screen.getByText('Failed to load. Please check your internet connection'),
		).toBeInTheDocument();
	});
});
