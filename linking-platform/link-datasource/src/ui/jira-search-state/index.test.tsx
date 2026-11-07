import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { JiraSearchState } from './index';

describe('embedded Jira search state', () => {
	it.each([
		['initial', 'Search for Jira work items', false, '281px'],
		['empty', "We couldn't find anything matching your search", false, '281px'],
		// Compiled normalizes the compact 224px minimum to 14pc.
		['initial', 'Search for Jira work items', true, '14pc'],
		['empty', "We couldn't find anything matching your search", true, '14pc'],
	] as const)(
		'renders an accessible %s state in a consistent search area',
		async (variant, title, isCompact, minHeight) => {
			const { container } = render(
				<IntlProvider locale="en">
					<JiraSearchState variant={variant} isCompact={isCompact} />
				</IntlProvider>,
			);
			expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
			expect(screen.getByTestId(`jira-search-state-${variant}`)).toHaveCompiledCss(
				'min-height',
				minHeight,
			);
			await expect(container).toBeAccessible();
		},
	);

	it('reuses the work-item table skeleton for loading', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<JiraSearchState variant="loading" />
			</IntlProvider>,
		);
		expect(screen.getByTestId('jira-search-table-skeleton')).toBeInTheDocument();
		expect(screen.getAllByTestId('summary-empty-state-skeleton').length).toBeGreaterThan(1);
		expect(screen.getByText('Searching for work items…')).toBeInTheDocument();
		expect(screen.queryByRole('heading')).not.toBeInTheDocument();
		await expect(container).toBeAccessible();
	});
});
