import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { TopNav } from '../../top-nav/top-nav';

describe('without full height sidebar', () => {
	it('should set the top bar height to the default value if height is not provided', () => {
		render(<TopNav>topbar</TopNav>);

		expect(screen.getByText('topbar')).toHaveTextContent(
			'#unsafe-design-system-page-layout-root { --n_tNvM: 48px }',
		);
	});
});

describe('top nav height change gate', () => {
	it('should set the default top bar height to 56px when the gate is on', () => {
		passGate('navx-topnav-height-change');

		render(<TopNav>topbar</TopNav>);

		expect(screen.getByText('topbar')).toHaveTextContent(
			'#unsafe-design-system-page-layout-root { --n_tNvM: 56px }',
		);
	});

	it('should set the default top bar height to 48px when the gate is off', () => {
		failGate('navx-topnav-height-change');

		render(<TopNav>topbar</TopNav>);

		expect(screen.getByText('topbar')).toHaveTextContent(
			'#unsafe-design-system-page-layout-root { --n_tNvM: 48px }',
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
