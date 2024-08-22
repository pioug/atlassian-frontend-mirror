import React from 'react';

import ReactDOM from 'react-dom';
import { ssr } from '@atlaskit/ssr';

import Example from '../../../examples/14-ssr';

// @ts-ignore
jest.spyOn(global.console, 'error').mockImplementation(() => {});

afterEach(() => {
	jest.resetAllMocks();
});

test('should ssr then hydrate example component correctly', async () => {
	const elem = document.createElement('div');
	elem.innerHTML = await ssr(Example);

	ReactDOM.hydrate(<Example />, elem);

	expect(elem.innerHTML).toContain('inline-card-resolved-view');
	expect(elem.innerHTML).toContain('smart-block-title-resolved-view');
});
