import React from 'react';
import ReactDOM from 'react-dom';

import { getExamplesFor, ssr } from '@atlaskit/ssr';
import waitForExpect from 'wait-for-expect';

afterEach(() => {
	jest.resetAllMocks();
});
// TODO: https://ecosystem.atlassian.net/browse/AK-6450
test.skip('should ssr then hydrate tree correctly', async () => {
	const [example] = await getExamplesFor('tree');
	const Example = require(example.filePath).default; // eslint-disable-line import/no-dynamic-require

	const elem = document.createElement('div');
	elem.innerHTML = await ssr(example.filePath);

	ReactDOM.hydrate(<Example />, elem);
	await waitForExpect(() => {
		// ignore warnings caused by emotion's server-side rendering approach
		// eslint-disable-next-line no-console
		const mockCalls = (console.error as jest.Mock).mock.calls.filter(
			([f, s]) =>
				!(
					f === 'Warning: Did not expect server HTML to contain a <%s> in <%s>.%s' && s === 'style'
				),
		);
		expect(mockCalls.length).toBe(0);
	});
});
