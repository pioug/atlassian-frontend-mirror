import waitForExpect from 'wait-for-expect';

import { ssr } from '@atlaskit/ssr';

import Example from '../../../examples/00-file-card-flow';

test('media-card server side rendering', async () => {
	await waitForExpect(() => {
		expect(() => ssr(Example)).not.toThrow();
	});
});
