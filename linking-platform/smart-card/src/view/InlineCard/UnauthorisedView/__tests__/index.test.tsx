import React from 'react';

import { fireEvent, screen } from '@testing-library/react';

import { renderWithIntl } from '@atlaskit/link-test-helpers';

import { InlineCardUnauthorizedView } from '../index';

describe('Unauthorised View', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	it('should have correct text', () => {
		const testUrl = 'http://unauthorised-test/';
		const { container } = renderWithIntl(<InlineCardUnauthorizedView url={testUrl} />);

		expect(container).toHaveTextContent(testUrl);
	});

	it('should have a link to the url', () => {
		const testUrl = 'http://unauthorised-test/';
		renderWithIntl(<InlineCardUnauthorizedView url={testUrl} />);
		const link = screen.getByText(testUrl, { exact: false }).closest('a');

		expect(link).not.toBeNull;
		expect(link!.href).toBe(testUrl);
	});

	it('should show correct text if action is available', () => {
		const testUrl = 'http://unauthorised-test/';

		const { container } = renderWithIntl(
			<InlineCardUnauthorizedView context="3P" url={testUrl} onAuthorise={jest.fn()} />,
		);

		expect(container).toHaveTextContent(`${testUrl}Connect your 3P account`);
	});

	it('should not show action button when action is not available', () => {
		const testUrl = 'http://unauthorised-test/';

		const { container } = renderWithIntl(<InlineCardUnauthorizedView context="3P" url={testUrl} />);

		expect(container).not.toHaveTextContent('Connect');
	});

	it('should not redirect user if they do not click on the authorize button', () => {
		const onClick = jest.fn();
		const onAuthorise = jest.fn();
		const testUrl = 'http://unauthorised-test/';
		renderWithIntl(
			<InlineCardUnauthorizedView url={testUrl} onClick={onClick} onAuthorise={onAuthorise} />,
		);

		const message = screen.getByText(testUrl);
		fireEvent.click(message!);
		expect(onClick).toHaveBeenCalled();
		expect(onAuthorise).not.toHaveBeenCalled();
	});

	it('should capture and report a11y violations', async () => {
		const testUrl = 'http://unauthorised-test/';
		const { container } = renderWithIntl(<InlineCardUnauthorizedView url={testUrl} />);
		await expect(container).toBeAccessible();
	});
});
