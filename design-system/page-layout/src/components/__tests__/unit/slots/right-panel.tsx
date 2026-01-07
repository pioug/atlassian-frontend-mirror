/* eslint-disable testing-library/no-node-access */
import React from 'react';

import { render, screen } from '@testing-library/react';

import { PageLayout, RightPanel } from '../../../index';

const emptyGridState = { gridState: {} };

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<RightPanel />', () => {
	it('should render with width passed to it', () => {
		render(
			<PageLayout testId="grid">
				<RightPanel testId="component" width={200}>
					Contents
				</RightPanel>
			</PageLayout>,
		);
		expect(screen.getByTestId('component')).toHaveStyleDeclaration('grid-area', 'right-panel');
		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--rightPanelWidth:200px;}'),
		);
	});

	it('should hydrate with the width passed to it', () => {
		render(
			<PageLayout testId="grid">
				<RightPanel testId="component" width={200}>
					Contents
				</RightPanel>
			</PageLayout>,
			{ hydrate: true },
		);
		expect(screen.getByTestId('component')).toHaveStyleDeclaration('grid-area', 'right-panel');
		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--rightPanelWidth:200px;}'),
		);
	});

	it('should be "fixed" when isFixed prop is passed', () => {
		render(
			<PageLayout testId="grid">
				<RightPanel isFixed testId="component" width={200}>
					Contents
				</RightPanel>
			</PageLayout>,
		);
		expect(screen.getByTestId('component')).toHaveStyleDeclaration('position', 'fixed');
	});

	it('should store the width in localStorage on mount', () => {
		render(
			<PageLayout testId="grid">
				<RightPanel testId="component" isFixed width={50}>
					Contents
				</RightPanel>
			</PageLayout>,
		);

		expect(localStorage.getItem('DS_PAGE_LAYOUT_UI_STATE')).toEqual(
			JSON.stringify({
				gridState: {
					rightPanelWidth: 50,
				},
			}),
		);
	});

	it('should remove the height in localStorage on unmount', () => {
		const { unmount } = render(
			<PageLayout testId="grid">
				<RightPanel testId="component" isFixed width={50}>
					Contents
				</RightPanel>
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
				<RightPanel testId="component" isFixed width={200}>
					Contents
				</RightPanel>
			</PageLayout>,
		);

		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--rightPanelWidth:200px;}'),
		);

		rerender(
			<PageLayout testId="grid">
				<RightPanel testId="component" isFixed width={50} shouldPersistWidth>
					Contents
				</RightPanel>
			</PageLayout>,
		);

		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--rightPanelWidth:200px;}'),
		);
	});
});
