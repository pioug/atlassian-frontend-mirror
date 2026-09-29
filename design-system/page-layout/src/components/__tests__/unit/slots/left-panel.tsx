/* eslint-disable testing-library/no-node-access */

import React from 'react';

import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';

import { LeftPanel, PageLayout } from '../../../index';

const emptyGridState = { gridState: {} };
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<LeftPanel />', () => {
	it('should render with the width passed to it', () => {
		render(
			<PageLayout testId="grid">
				<LeftPanel testId="component" width={200}>
					Contents
				</LeftPanel>
			</PageLayout>,
		);
		expect(screen.getByTestId('component')).toHaveStyleDeclaration('grid-area', 'left-panel');
		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--leftPanelWidth:200px;}'),
		);
	});

	it('should hydrate with the width passed to it', () => {
		const ui = (
			<PageLayout testId="grid">
				<LeftPanel testId="component" width={200}>
					Contents
				</LeftPanel>
			</PageLayout>
		);

		// Hydration needs server-rendered markup to hydrate into. This previously
		// hydrated an empty container, which React 18 tolerated but React 19 treats
		// as a hydration mismatch.
		const container = document.createElement('div');
		container.innerHTML = renderToString(ui);
		document.body.appendChild(container);

		render(ui, { container, hydrate: true });

		expect(screen.getByTestId('component')).toHaveStyleDeclaration('grid-area', 'left-panel');
		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--leftPanelWidth:200px;}'),
		);
	});

	it('should be "fixed" when isFixed prop is passed', () => {
		render(
			<PageLayout testId="grid">
				<LeftPanel isFixed testId="component" width={200}>
					Contents
				</LeftPanel>
			</PageLayout>,
		);
		expect(screen.getByTestId('component')).toHaveStyleDeclaration('position', 'fixed');
	});

	it('should store the width in localStorage on mount', () => {
		render(
			<PageLayout testId="grid">
				<LeftPanel testId="component" isFixed width={50}>
					Contents
				</LeftPanel>
			</PageLayout>,
		);

		expect(localStorage.getItem('DS_PAGE_LAYOUT_UI_STATE')).toEqual(
			JSON.stringify({
				gridState: {
					leftPanelWidth: 50,
				},
			}),
		);
	});

	it('should remove the height in localStorage on unmount', () => {
		const { unmount } = render(
			<PageLayout testId="grid">
				<LeftPanel testId="component" isFixed width={50}>
					Contents
				</LeftPanel>
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
				<LeftPanel testId="component" isFixed width={200}>
					Contents
				</LeftPanel>
			</PageLayout>,
		);

		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--leftPanelWidth:200px;}'),
		);

		rerender(
			<PageLayout testId="grid">
				<LeftPanel testId="component" isFixed width={50} shouldPersistWidth>
					Contents
				</LeftPanel>
			</PageLayout>,
		);

		expect(screen.getByTestId('component').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--leftPanelWidth:200px;}'),
		);
	});
});
