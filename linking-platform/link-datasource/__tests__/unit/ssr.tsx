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

test('should ssr then hydrate example component correctly', async () => {
	const examples = await getExamplesFor('link-datasource');
	const filepath = examples.find((example) =>
		example.filePath.endsWith('examples/issue-like-table.tsx'),
	)!.filePath;
	const Example = require(filepath).default; // eslint-disable-line import/no-dynamic-require
	const elem = document.createElement('div');
	elem.innerHTML = ReactDOMServer.renderToString(React.createElement(Example));

	await waitForExpect(() => {
		ReactDOM.hydrate(<Example />, elem);
		// ignore warnings caused by emotion's server-side rendering approach
		// @ts-ignore
		// eslint-disable-next-line no-console
		const mockCalls = console.error.mock.calls.filter(
			([f, s]: string[]) =>
				!(
					f === 'Warning: Did not expect server HTML to contain a <%s> in <%s>.%s' && s === 'style'
				),
		);
		expect(mockCalls.length).toBe(0);
	});
});
