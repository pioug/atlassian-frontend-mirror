import React from 'react';

// eslint-disable-next-line @atlassian/testing-library/prefer-atlassian-testing-library
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { DropdownList } from '../../components/DropdownList';

const accessibleSites = ['hello.atlassian.net', 'acme.atlassian.net', 'test.atlassian.net'];

const defaultProps = {
	accessibleSites,
};

const renderWithIntl = (props = {}) =>
	render(
		<IntlProvider locale="en">
			<DropdownList {...defaultProps} {...props} />
		</IntlProvider>,
	);

describe('Dropdown list button', () => {
	test('renders sites list with expand button for more than 3 sites', async () => {
		const sites = [
			'hello.atlassian.net',
			'acme.atlassian.net',
			'test.atlassian.net',
			'bitflix.atlassian.net',
		];
		const { container } = renderWithIntl({
			accessibleSites: sites,
		});
		// With 4 sites and a collapse threshold of 3, a "1 more" expand button should be present
		expect(screen.getByRole('button', { name: '1 more' })).toBeInTheDocument();
		await expect(container).toBeAccessible();
	});
});
