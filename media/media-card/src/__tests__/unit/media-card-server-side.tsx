import waitForExpect from 'wait-for-expect';

import { ssr } from '@atlaskit/ssr/emotion';

const noop = () => {};

test('media-card server side rendering', async () => {
	const examplePath = require.resolve('../../../examples/00-file-card-flow');
	const consoleMock = jest.spyOn(console, 'error').mockImplementation(noop);

	await waitForExpect(() => {
		expect(() => ssr(examplePath)).not.toThrow();
	});

	consoleMock.mockRestore();
});
