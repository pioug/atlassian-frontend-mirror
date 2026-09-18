import React from 'react';

import { IntlProvider } from 'react-intl';

import { render, screen, userEvent } from '@atlassian/testing-library';

import { FocusedTaskCloseAccount, type Props } from '../../components/FocusedTaskCloseAccount';

const defaultProps = {
	isOpen: false,
	onClose: jest.fn(),
	screens: ['a', 'b', 'c'],
	submitButton: <div id="submit" />,
	learnMoreLink: 'https://hello.atlassian.net',
};

const renderTask = (props: Partial<Props> = {}) =>
	render(
		<IntlProvider locale="en">
			<FocusedTaskCloseAccount {...defaultProps} {...props} isOpen />
		</IntlProvider>,
	);

test('capture and report a11y violations', async () => {
	const { container } = renderTask();
	await expect(container).toBeAccessible();
});

describe('nextScreen()', () => {
	test('Goes to next screen', async () => {
		renderTask({ screens: [<div key="a">Screen A</div>, <div key="b">Screen B</div>] });
		expect(screen.getByText('Screen A')).toBeInTheDocument();
		await userEvent.click(screen.getByRole('button', { name: 'Next' }));
		expect(screen.getByText('Screen B')).toBeInTheDocument();
	});

	test('No-op if on last screen', () => {
		renderTask({ screens: [<div key="a">Screen A</div>] });
		expect(screen.getByText('Screen A')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
	});
});

describe('previousScreen()', () => {
	test('Goes to previous screen', async () => {
		renderTask({ screens: [<div key="a">Screen A</div>, <div key="b">Screen B</div>] });
		await userEvent.click(screen.getByRole('button', { name: 'Next' }));
		await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
		expect(screen.getByText('Screen A')).toBeInTheDocument();
	});

	test('No-op on first screen', () => {
		renderTask({ screens: [<div key="a">Screen A</div>, <div key="b">Screen B</div>] });
		expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument();
		expect(screen.getByText('Screen A')).toBeInTheDocument();
	});
});

describe('learnMoreLink display', () => {
	test('Learn more link is not displayed when the link is not passed in the props', () => {
		renderTask({
			learnMoreLink: '',
		});
		expect(screen.queryByRole('link', { name: 'Learn more' })).not.toBeInTheDocument();
	});
});
