import React from 'react';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { within } from '@atlassian/testing-library/within';

import { TopNavEnd } from '../../top-nav/top-nav-end';

jest.mock('@atlaskit/primitives/compiled/responsive/index', () => ({
	...jest.requireActual('@atlaskit/primitives/compiled/responsive/index'),
	UNSAFE_useMediaQuery: () => ({ matches: true }),
}));

it('should hydrate persistent actions without replacing their DOM on a small viewport', async () => {
	passGate('platform-dst-chat-panel-layout');
	const { container, hydrate, errorsMock } = setupComponent();
	const trigger = within(container).getByRole('button', { name: 'Persistent action' });

	const root = await hydrate();
	try {
		expect(within(container).getByRole('button', { name: 'Persistent action' })).toBe(trigger);
		expect(within(container).getByRole('button', { name: 'Show more' })).toBeInTheDocument();
		// This jsdom process retains the client version of useLayoutEffect. Ignore
		// that server warning, but no hydration errors.
		expect(
			errorsMock.mock.calls.filter(
				([message]) => !String(message).includes('useLayoutEffect does nothing on the server'),
			),
		).toEqual([]);
	} finally {
		await act(() => root.unmount());
		errorsMock.mockRestore();
		container.remove();
	}
});

function setupComponent() {
	const errorsMock = jest.spyOn(console, 'error').mockImplementation(() => {});
	const element = (
		<TopNavEnd
			persistentItems={
				<div role="list">
					<div role="listitem">
						<button>Persistent action</button>
					</div>
				</div>
			}
		>
			<div role="listitem">
				<button>Overflow action</button>
			</div>
		</TopNavEnd>
	);
	const container = document.createElement('div');
	container.innerHTML = renderToString(element);
	document.body.append(container);
	return {
		container,
		errorsMock,
		hydrate: async () => {
			let root: ReturnType<typeof hydrateRoot>;
			await act(() => {
				root = hydrateRoot(container, element);
			});
			return root!;
		},
	};
}
