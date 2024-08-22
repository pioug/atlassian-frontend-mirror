import React from 'react';

import ReactDOM from 'react-dom';
import waitForExpect from 'wait-for-expect';

import { ssr } from '@atlaskit/ssr';

import Example from '../../examples/issue-like-table';

// @ts-ignore
jest.spyOn(global.console, 'error').mockImplementation(() => {});

afterEach(() => {
	jest.resetAllMocks();
});

// A list of warnings that's safe to ignore during ssr
type IgnoredWarningPredicate = (call: string[]) => boolean;

const IgnoredWarnings: IgnoredWarningPredicate[] = [
	([_1, _2]) =>
		_1 === 'Warning: Did not expect server HTML to contain a <%s> in <%s>.%s' && _2 === 'style',
	([_1]) => _1.startsWith('Warning: useLayoutEffect does nothing on the server,'),
	([_1]) => _1.startsWith('Warning: ReactDOM.hydrate is no longer supported in React 18'),
];

test('should ssr then hydrate example component correctly', async () => {
	const elem = document.createElement('div');
	elem.innerHTML = await ssr(Example);

	let hydrateDone = false;
	ReactDOM.hydrate(<Example />, elem, () => {
		hydrateDone = true;
	});

	// wait until hydrate finishes. This is not what we're testing for
	await waitForExpect(() => {
		expect(hydrateDone).toBe(true);
	});

	// ignore warnings caused by emotion's server-side rendering approach
	// @ts-ignore
	// eslint-disable-next-line no-console
	const mockCalls = console.error.mock.calls.filter((call) =>
		IgnoredWarnings.every((p) => !p(call)),
	);
	expect(mockCalls.length).toBe(0);
});
