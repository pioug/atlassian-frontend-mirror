import React from 'react';
import waitForExpect from 'wait-for-expect';
import { render } from '@testing-library/react';
import { getExamplesFor, ssr } from '@atlaskit/ssr';

jest.spyOn(global.console, 'error').mockImplementation(() => {});

afterEach(() => {
	jest.resetAllMocks();
});

test('should ssr then hydrate media-viewer correctly', async () => {
	const [example] = await getExamplesFor('media-viewer');
	const Example = require(example.filePath).default;
	const elem = document.createElement('div');
	elem.innerHTML = await ssr(example.filePath);

	await waitForExpect(() => {
		render(<Example />, {
			container: elem,
			hydrate: true,
		});
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
