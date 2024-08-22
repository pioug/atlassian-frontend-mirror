import React from 'react';
import { render } from '@testing-library/react';

import { mockConsole, ssr } from '@atlaskit/ssr';

import Example from '../../../examples/1-dropzone';

const getConsoleMockCalls = mockConsole(console);

afterEach(() => {
	jest.resetAllMocks();
	jest.restoreAllMocks();
});

test('should ssr then hydrate media-picker correctly', async () => {
	const elem = document.createElement('div');
	elem.innerHTML = await ssr(Example);

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
