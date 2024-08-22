import waitForExpect from 'wait-for-expect';

import { ssr } from '@atlaskit/ssr';

import Example from '../../../examples/1-dropzone';

test('media-picker server side rendering', async () => {
	await waitForExpect(() => {
		expect(() => ssr(Example)).not.toThrow();
	});
});
