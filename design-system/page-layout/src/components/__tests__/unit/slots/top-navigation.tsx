import React from 'react';

import { render, screen } from '@testing-library/react';

import { PageLayout, TopNavigation } from '../../../index';

const emptyGridState = { gridState: {} };
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<TopNavigation />', () => {
	it('should render with the height passed to it', () => {
		render(
			<PageLayout testId="grid">
				<TopNavigation testId="component" height={50}>
					Contents
				</TopNavigation>
			</PageLayout>,
		);

		expect(screen.getByTestId('component')).toHaveStyleDeclaration(
			'height',
			'var(--topNavigationHeight, 0px)',
		);
		// eslint-disable-next-line testing-library/no-node-access
		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--topNavigationHeight:50px;}'),
		);
	});

	it('should hydrate with the the height passed to it', () => {
		render(
			<PageLayout testId="grid">
				<TopNavigation testId="component" height={50}>
					Contents
				</TopNavigation>
			</PageLayout>,
			{ hydrate: true },
		);
		expect(screen.getByTestId('component')).toHaveStyleDeclaration(
			'height',
			'var(--topNavigationHeight, 0px)',
		);

		// eslint-disable-next-line testing-library/no-node-access
		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--topNavigationHeight:50px;}'),
		);
	});

	it('should be "fixed" when isFixed prop is passed', () => {
		render(
			<PageLayout testId="grid">
				<TopNavigation isFixed testId="component" height={50}>
					Contents
				</TopNavigation>
			</PageLayout>,
		);

		expect(screen.getByTestId('component')).toHaveStyleDeclaration('position', 'fixed');
	});

	it('should store the height in localStorage on mount', () => {
		render(
			<PageLayout testId="grid">
				<TopNavigation testId="component" isFixed height={50}>
					Contents
				</TopNavigation>
			</PageLayout>,
		);

		expect(localStorage.getItem('DS_PAGE_LAYOUT_UI_STATE')).toEqual(
			JSON.stringify({
				gridState: {
					topNavigationHeight: 50,
				},
			}),
		);
	});

	it('should remove the height in localStorage on unmount', () => {
		const { unmount } = render(
			<PageLayout testId="grid">
				<TopNavigation testId="component" isFixed height={50}>
					Contents
				</TopNavigation>
			</PageLayout>,
		);

		unmount();
		expect(localStorage.getItem('DS_PAGE_LAYOUT_UI_STATE')).toEqual(
			JSON.stringify({ ...emptyGridState }),
		);
	});

	it('should respect the shouldPersistWidth prop', () => {
		const { rerender } = render(
			<PageLayout testId="grid">
				<TopNavigation testId="component" isFixed height={200} shouldPersistHeight>
					Contents
				</TopNavigation>
			</PageLayout>,
		);

		// eslint-disable-next-line testing-library/no-node-access
		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--topNavigationHeight:200px;}'),
		);

		rerender(
			<PageLayout testId="grid">
				<TopNavigation testId="component" isFixed height={50} shouldPersistHeight>
					Contents
				</TopNavigation>
			</PageLayout>,
		);
		// eslint-disable-next-line testing-library/no-node-access
		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--topNavigationHeight:200px;}'),
		);
	});
});
