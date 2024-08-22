import waitForExpect from 'wait-for-expect';

import { ssr } from '@atlaskit/ssr';

import Example from '../../../../examples/0-basic-example';

test('media-viewer server side rendering', async () => {
	const elem = document.createElement('div');
	elem.innerHTML = await ssr(Example);

	await waitForExpect(() => {
		expect(() => ssr(Example)).not.toThrow();
	});
});
