import React from 'react';
import { render } from '@testing-library/react';

import { getExamplesFor, mockConsole, ssr } from '@atlaskit/ssr';

const getConsoleMockCalls = mockConsole(console);

afterEach(() => {
	jest.resetAllMocks();
	jest.restoreAllMocks();
});

test('should ssr then hydrate media-picker correctly', async () => {
	const [example] = await getExamplesFor('media-picker');
	const Example = require(example.filePath).default;
	const elem = document.createElement('div');
	elem.innerHTML = await ssr(example.filePath);

	render(<Example />, {
		container: elem,
		hydrate: true,
	});
	const warnings = getConsoleMockCalls().filter(
		([f, s]: string[]) =>
			f === 'Warning: Did not expect server HTML to contain a <%s> in <%s>.%s' && s === 'style',
	);
	expect(warnings.length).toBe(0);
});
