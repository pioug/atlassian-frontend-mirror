import React, { Suspense } from 'react';

import { act, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import invariant from 'tiny-invariant';

import { withResolvers } from '@atlaskit/ds-lib/with-resolvers';

import { PanelSplitter } from '../../panel-splitter/panel-splitter';
import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';
import { SideNavContent } from '../../side-nav/side-nav-content';

import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
	resetMatchMedia,
} from './test-utils';

let resetConsoleErrorSpyFn: ResetConsoleErrorFn;
beforeAll(() => {
	resetConsoleErrorSpyFn = filterFromConsoleErrorOutput(parseCssErrorRegex);
});

afterAll(() => {
	resetConsoleErrorSpyFn();
});

beforeEach(() => {
	resetMatchMedia();
});

function getResource() {
	type TState =
		| { type: 'idle' }
		| { type: 'pending'; promise: Promise<void>; resolve: () => void; reject: () => void };
	let state: TState = {
		type: 'idle',
	};

	return {
		render(): never | null {
			if (state.type === 'pending') {
				throw state.promise;
			}
			return null;
		},
		reset() {
			if (state.type === 'pending') {
				const { reject } = state;
				act(() => reject());
				state = { type: 'idle' };
			}
		},
		pending() {
			invariant(state.type === 'idle', 'state needs to be "idle" before you can suspend');
			const { promise, resolve, reject } = withResolvers<void>();
			state = {
				type: 'pending',
				promise,
				resolve,
				reject,
			};
		},
		resolve() {
			invariant(state.type === 'pending', 'state needs to be "pending" before you can resolve');
			const { resolve } = state;
			act(() => resolve());
			state = { type: 'idle' };
		},
	};
}

test('panel splitter works with suspense', async () => {
	const resource = getResource();

	function Content() {
		resource.render();

		return 'Sidebar content';
	}
	function App() {
		return (
			<Root>
				<Suspense fallback={<div data-testid="suspense" />}>
					<SideNav testId="sidenav">
						<SideNavContent>
							<Content />
						</SideNavContent>
						<PanelSplitter label="Resize side nav" testId="side-nav-panel-splitter" />
					</SideNav>
				</Suspense>
			</Root>
		);
	}

	// Initial render with no suspense
	resource.reset();
	const { rerender } = render(<App />);

	expect(screen.queryByTestId('suspense')).not.toBeInTheDocument();
	expect(screen.queryByTestId('side-nav-panel-splitter')).toBeVisible();
	expect(screen.getByText('Sidebar content')).toBeVisible();

	// Render again while suspended
	resource.pending();
	rerender(<App />);

	expect(screen.getByTestId('suspense')).toBeInTheDocument();
	expect(screen.queryByTestId('side-nav-panel-splitter')).not.toBeVisible();
	expect(screen.getByText('Sidebar content')).not.toBeVisible();

	// Resolve promise (which will cause a re-render)
	resource.resolve();
	await waitForElementToBeRemoved(() => screen.queryByTestId('suspense'));

	expect(screen.queryByTestId('suspense')).not.toBeInTheDocument();
	expect(screen.queryByTestId('side-nav-panel-splitter')).toBeVisible();
	expect(screen.getByText('Sidebar content')).toBeVisible();
});
