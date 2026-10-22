import React, { useState } from 'react';

import createStub from 'raf-stub';

import { Popup } from '@atlaskit/popup/popup';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { resetMatchMedia, setMediaQuery } from '@atlassian/test-utils/match-media';
import { screen } from '@atlassian/testing-library/screen';
import { act, fireEvent, render, waitFor } from '@atlassian/testing-library/testing-library/react';

import { Main } from '../../main/main';
import { SideNavPanelSplitter } from '../../panel-splitter/side-nav-panel-splitter';
import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';
import { SideNavToggleButton } from '../../side-nav/toggle-button';
import { TopNav } from '../../top-nav/top-nav';
import { TopNavStart } from '../../top-nav/top-nav-start';
import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
} from './_filter-from-console-error-output';

/**
 * The side nav toggle button and the side nav panel splitter close open layers (such as popups)
 * when they are used. With `platform-dst-top-layer` off, the open layer observer closes them.
 * With it on, open top-layer popovers are asked to close through the `@atlaskit/top-layer/page-surface` entry points.
 */
function PopupInMain() {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<React.Fragment>
			<Popup
				shouldRenderToParent
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				placement="bottom-start"
				content={() => <div>Popup content</div>}
				trigger={({ ref }) => (
					<button type="button" ref={ref}>
						Popup trigger
					</button>
				)}
			/>
			<span data-testid="popup-state">{isOpen ? 'open' : 'closed'}</span>
		</React.Fragment>
	);
}

function TestLayout() {
	return (
		<Root>
			<TopNav>
				<TopNavStart
					sideNavToggleButton={
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					}
				>
					{null}
				</TopNavStart>
			</TopNav>
			<SideNav testId="sidenav">
				<SideNavPanelSplitter label="Resize side nav" testId="panel-splitter" />
			</SideNav>
			<Main>
				<PopupInMain />
			</Main>
		</Root>
	);
}

describe.each([
	{ name: 'on', setGate: passGate },
	{ name: 'off', setGate: failGate },
])('closing open layers (platform-dst-top-layer $name)', ({ setGate }) => {
	let resetConsoleErrorSpyFn: ResetConsoleErrorFn;
	beforeAll(() => {
		resetConsoleErrorSpyFn = filterFromConsoleErrorOutput(parseCssErrorRegex);
	});

	afterAll(() => {
		resetConsoleErrorSpyFn();
	});

	beforeEach(() => {
		setGate('platform-dst-top-layer');
		resetMatchMedia();
		setMediaQuery('(min-width: 64rem)', { initial: true });
	});

	afterEach(async () => {
		// Clean up any pending drags
		fireEvent.dragEnd(window);
		await 1;
		fireEvent.pointerMove(window);
	});

	it('should close open popups when the toggle button is clicked', () => {
		render(<TestLayout />);
		expect(screen.getByTestId('popup-state')).toHaveTextContent('open');

		// `fireEvent` is used inside `TopNav`, see `side-nav-flyout.test.tsx`
		fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

		expect(screen.getByTestId('popup-state')).toHaveTextContent('closed');
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
	});

	it('should close open popups when a panel splitter drag starts', () => {
		// The drag start is reported in the next animation frame
		const rafStub = createStub();
		const rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(rafStub.add);
		render(<TestLayout />);
		expect(screen.getByTestId('popup-state')).toHaveTextContent('open');

		const splitter = screen.getByTestId('panel-splitter');
		fireEvent.mouseDown(splitter, { clientX: 300 });
		fireEvent.dragStart(splitter, { clientX: 300 });
		act(() => {
			rafStub.step();
		});

		expect(screen.getByTestId('popup-state')).toHaveTextContent('closed');
		rafSpy.mockRestore();
	});

	it('should close open popups when a panel splitter keyboard resize starts', async () => {
		render(<TestLayout />);
		expect(screen.getByTestId('popup-state')).toHaveTextContent('open');

		const rangeInput = screen.getByRole('slider', { name: 'Resize side nav', hidden: true });
		act(() => {
			rangeInput.focus();
		});
		fireEvent.change(rangeInput, { target: { value: 350 } });

		await waitFor(() => expect(screen.getByTestId('popup-state')).toHaveTextContent('closed'));
	});
});
