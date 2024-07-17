import React from 'react';

import { hydrateRoot } from 'react-dom-18/client';

import { getExamplesFor, ssr } from '@atlaskit/ssr';

jest.spyOn(global.console, 'error').mockImplementation(() => {});

afterEach(() => {
	jest.resetAllMocks();
});

test('should ssr then hydrate analytics-next correctly', async () => {
	const [example] = await getExamplesFor('analytics-next');
	const Example = require(example.filePath).default; // eslint-disable-line import/no-dynamic-require

	const elem = document.createElement('div');
	elem.innerHTML = await ssr(example.filePath);

	hydrateRoot(elem, <Example />);

	// ignore warnings caused by emotion's server-side rendering approach
	// eslint-disable-next-line no-console
	const mockCalls = (console.error as jest.Mock).mock.calls.filter(
		([f, s]) =>
			!(f === 'Warning: Did not expect server HTML to contain a <%s> in <%s>.%s' && s === 'style'),
	);
	expect(mockCalls.length).toBe(0);
});
