import React from 'react';

import { ssr } from '@atlaskit/ssr';

import Example from '../../../examples/10-basic-create-and-fire';

jest.spyOn(global.console, 'error').mockImplementation(() => {});

afterEach(() => {
	jest.resetAllMocks();
});

// TODO: This is a temporary workaround before complete migration to react-dom v18
// 	See conversation https://hello.atlassian.net/wiki/x/HtE48
let hydrateRoot: unknown;
try {
	// eslint-disable-next-line import/no-unresolved
	hydrateRoot = require('react-dom/client').hydrateRoot;
} catch (e) {
	/* Skipping error */
}

test('should ssr then hydrate analytics-next correctly', async () => {
	const elem = document.createElement('div');
	elem.innerHTML = await ssr(Example);

	if (typeof hydrateRoot === 'function') {
		hydrateRoot(elem, <Example />);
	} else {
		const { hydrate } = require('react-dom');
		hydrate(<Example />, elem);
	}

	// ignore warnings caused by emotion's server-side rendering approach
	// eslint-disable-next-line no-console
	const mockCalls = (console.error as jest.Mock).mock.calls.filter(
		([f, s]) =>
			!(f === 'Warning: Did not expect server HTML to contain a <%s> in <%s>.%s' && s === 'style'),
	);
	expect(mockCalls.length).toBe(0);
});
