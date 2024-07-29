import React from 'react';

import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import waitForExpect from 'wait-for-expect';

import { getExamplesFor } from '@atlaskit/ssr';

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
];

test('should ssr then hydrate example component correctly', async () => {
	const examples = await getExamplesFor('link-datasource');
	const filepath = examples.find((example) =>
		example.filePath.endsWith('examples/issue-like-table.tsx'),
	)!.filePath;
	const Example = require(filepath).default; // eslint-disable-line import/no-dynamic-require
	const elem = document.createElement('div');
	elem.innerHTML = ReactDOMServer.renderToString(React.createElement(Example));

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
