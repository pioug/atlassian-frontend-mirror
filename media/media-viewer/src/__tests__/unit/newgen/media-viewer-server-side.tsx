import waitForExpect from 'wait-for-expect';

import { getExamplesFor, ssr } from '@atlaskit/ssr';

test('media-viewer server side rendering', async () => {
	const [example] = await getExamplesFor('media-viewer');

	await waitForExpect(() => {
		expect(() => ssr(example.filePath)).not.toThrow();
	});
});
