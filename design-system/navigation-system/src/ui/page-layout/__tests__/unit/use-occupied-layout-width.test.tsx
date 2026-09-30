import React, { useRef } from 'react';

import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { waitFor } from '@atlassian/testing-library/wait-for';

import { useOccupiedLayoutWidth } from '../../use-occupied-layout-width';

function Fixture({ showAside = true }: { showAside?: boolean }) {
	const ref = useRef<HTMLDivElement>(null);
	const width = useOccupiedLayoutWidth(ref);
	return (
		<>
			<div ref={ref} data-testid="root">
				<header data-layout-slot data-testid="top-nav" />
				<div data-layout-slot data-testid="banner" />
				<nav data-layout-slot data-testid="side-nav" />
				<main data-layout-slot role="main" data-testid="main" />
				<section data-layout-slot data-layout-chat-panel data-testid="chat-panel" />
				<div data-layout-slot data-testid="ribbon" />
				{showAside && <div data-layout-slot data-testid="aside" />}
				<div data-layout-slot data-testid="panel" />
			</div>
			<output data-testid="occupied">{width}</output>
		</>
	);
}

it('tracks inline slot sizes, responsive modes, visibility and unmounts', async () => {
	const originalObserver = window.ResizeObserver;
	let notifyResize = () => {};
	const disconnect = jest.fn();
	const observe = jest.fn();
	window.ResizeObserver = jest.fn().mockImplementation((callback) => {
		notifyResize = callback;
		return { observe, disconnect };
	});
	let mainRow = '"ribbon side-nav main aside panel chat-panel"';
	let panelArea = 'panel';
	let asideWidth = 300;
	let asideDisplay = 'block';
	jest.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
		const slot = element.getAttribute('data-testid');
		return {
			gridTemplateAreas: mainRow,
			gridArea: slot === 'panel' ? panelArea : slot,
			display: slot === 'aside' ? asideDisplay : 'block',
			position: 'sticky',
		} as CSSStyleDeclaration;
	});
	jest
		.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
		.mockImplementation(function (this: HTMLElement) {
			const slot = this.getAttribute('data-testid');
			return { width: slot === 'ribbon' ? 64 : slot === 'aside' ? asideWidth : 400 } as DOMRect;
		});
	try {
		const { rerender, unmount } = render(<Fixture />);
		for (const id of ['top-nav', 'side-nav', 'main', 'chat-panel']) {
			expect(observe).not.toHaveBeenCalledWith(screen.getByTestId(id));
			expect(window.getComputedStyle).not.toHaveBeenCalledWith(screen.getByTestId(id));
		}
		expect(observe).not.toHaveBeenCalledWith(screen.getByTestId('banner'));
		for (const id of ['root', 'ribbon', 'aside', 'panel']) {
			expect(observe).toHaveBeenCalledWith(screen.getByTestId(id));
		}
		expect(screen.getByTestId('occupied')).toHaveTextContent('764');
		asideWidth = 512;
		act(() => notifyResize());
		expect(screen.getByTestId('occupied')).toHaveTextContent('976');
		panelArea = 'main / aside / aside / aside';
		act(() => notifyResize());
		expect(screen.getByTestId('occupied')).toHaveTextContent('576');
		asideDisplay = 'none';
		act(() => notifyResize());
		expect(screen.getByTestId('occupied')).toHaveTextContent('64');
		asideDisplay = 'block';
		mainRow = '"main chat-panel" "aside chat-panel"';
		act(() => notifyResize());
		expect(screen.getByTestId('occupied')).toHaveTextContent('0');
		mainRow = '"ribbon side-nav main aside panel chat-panel"';
		rerender(<Fixture showAside={false} />);
		await waitFor(() => expect(screen.getByTestId('occupied')).toHaveTextContent('64'));
		unmount();
		expect(disconnect).toHaveBeenCalled();
	} finally {
		window.ResizeObserver = originalObserver;
		jest.restoreAllMocks();
	}
});
