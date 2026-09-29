/* eslint-disable testing-library/no-node-access */

import React from 'react';

import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';

import { Main, PageLayout, RightSidebar } from '../../../index';

const emptyGridState = { gridState: {} };
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<RightSidebar />', () => {
	it('should respect the shouldPersistWidth prop', () => {
		const { rerender } = render(
			<PageLayout testId="grid">
				<RightSidebar testId="component" isFixed width={200}>
					Contents
				</RightSidebar>
			</PageLayout>,
		);
		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--rightSidebarWidth:200px;}'),
		);

		rerender(
			<PageLayout testId="grid">
				<RightSidebar testId="component" isFixed width={50} shouldPersistWidth>
					Contents
				</RightSidebar>
			</PageLayout>,
		);
		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--rightSidebarWidth:200px;}'),
		);
	});

	it('should render with the width that was passed to it', () => {
		render(
			<PageLayout testId="grid">
				<Main>
					<RightSidebar testId="component" width={200}>
						Contents
					</RightSidebar>
				</Main>
			</PageLayout>,
		);
		expect(screen.getByTestId('component')).toHaveStyleDeclaration(
			'width',
			'var(--rightSidebarWidth, 0px)',
		);
		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--rightSidebarWidth:200px;}'),
		);
	});

	it('should hydrate with the width that was passed to it', () => {
		const ui = (
			<PageLayout testId="grid">
				<Main>
					<RightSidebar testId="component" width={200}>
						Contents
					</RightSidebar>
				</Main>
			</PageLayout>
		);

		// Hydration needs server-rendered markup to hydrate into. This previously
		// hydrated an empty container, which React 18 tolerated but React 19 treats
		// as a hydration mismatch.
		const container = document.createElement('div');
		container.innerHTML = renderToString(ui);
		document.body.appendChild(container);

		render(ui, { container, hydrate: true });

		expect(screen.getByTestId('component')).toHaveStyleDeclaration(
			'width',
			'var(--rightSidebarWidth, 0px)',
		);
		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--rightSidebarWidth:200px;}'),
		);
	});

	it('should be "fixed" when isFixed prop is passed', () => {
		render(
			<PageLayout testId="grid">
				<Main>
					<RightSidebar testId="component" width={200} isFixed>
						Contents
					</RightSidebar>
				</Main>
			</PageLayout>,
		);

		expect(
			screen.getByTestId('component').querySelector('style')!.nextSibling,
		).toHaveStyleDeclaration('position', 'fixed');
	});

	it('should store the width in localStorage on mount', () => {
		render(
			<PageLayout testId="grid">
				<RightSidebar testId="component" isFixed width={50}>
					Contents
				</RightSidebar>
			</PageLayout>,
		);

		expect(localStorage.getItem('DS_PAGE_LAYOUT_UI_STATE')).toEqual(
			JSON.stringify({
				gridState: {
					rightSidebarWidth: 50,
				},
			}),
		);
	});

	it('should remove the height in localStorage on unmount', () => {
		const { unmount } = render(
			<PageLayout testId="grid">
				<RightSidebar testId="component" isFixed width={50}>
					Contents
				</RightSidebar>
			</PageLayout>,
		);

		unmount();
		expect(localStorage.getItem('DS_PAGE_LAYOUT_UI_STATE')).toEqual(
			JSON.stringify({ ...emptyGridState }),
		);
	});
});
