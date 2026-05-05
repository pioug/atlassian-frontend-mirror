import React from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { TopNav } from '../../top-nav/top-nav';

ffTest.off('navx-full-height-sidebar', 'without full height sidebar', () => {
	// Default height is always 48px when FHS is disabled
	it('should set the top bar height to the default value if height is not provided', () => {
		render(<TopNav>topbar</TopNav>);

		expect(screen.getByText('topbar')).toHaveTextContent(
			'#unsafe-design-system-page-layout-root { --n_tNvM: 48px }',
		);
	});
});

ffTest.on('navx-full-height-sidebar', 'without full height sidebar', () => {
	// Default height is 56px when FHS is enabled
	it('should set the top bar height to the default value if height is not provided', () => {
		render(<TopNav>topbar</TopNav>);

		expect(screen.getByText('topbar')).toHaveTextContent(
			'#unsafe-design-system-page-layout-root { --n_tNvM: 56px }',
		);
	});
});

it('should set the top bar height to the provided value', () => {
	render(<TopNav height={122}>topbar</TopNav>);

	expect(screen.getByText('topbar')).toHaveTextContent(
		'#unsafe-design-system-page-layout-root { --n_tNvM: 122px }',
	);
});

it('should have role="banner"', () => {
	render(<TopNav testId="topbar">topbar</TopNav>);

	expect(screen.getByTestId('topbar')).toHaveTextContent('topbar');
	expect(screen.getByTestId('topbar')).toBe(screen.getByRole('banner'));
});
