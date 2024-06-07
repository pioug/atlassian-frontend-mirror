import React from 'react';

import ReactDOM from 'react-dom';
import waitForExpect from 'wait-for-expect';

import { getExamplesFor, ssr } from '@atlaskit/ssr';

// @ts-ignore
jest.spyOn(global.console, 'error').mockImplementation(() => {});

afterEach(() => {
	jest.resetAllMocks();
});

test.skip('should ssr then hydrate example component correctly', async () => {
	const [example] = await getExamplesFor('media-file-preview');
	const Example = require(example.filePath).default; // eslint-disable-line import/no-dynamic-require

	const elem = document.createElement('div');
	elem.innerHTML = await ssr(example.filePath);

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
