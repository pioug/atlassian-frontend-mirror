import waitForExpect from 'wait-for-expect';

import { getExamplesFor, ssr } from '@atlaskit/ssr';

test('media-picker server side rendering', async () => {
	const [example] = await getExamplesFor('media-picker');

	await waitForExpect(() => {
		expect(() => ssr(example.filePath)).not.toThrow();
	});
});
