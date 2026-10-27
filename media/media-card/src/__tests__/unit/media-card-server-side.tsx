import { ssr } from '@atlaskit/ssr/emotion';
import { waitFor } from '@atlassian/testing-library/wait-for';

const noop = () => {};

test('media-card server side rendering', async () => {
	const examplePath = require.resolve('../../../examples/00-file-card-flow');
	const consoleMock = jest.spyOn(console, 'error').mockImplementation(noop);

	await waitFor(() => {
		expect(() => ssr(examplePath)).not.toThrow();
	});

	consoleMock.mockRestore();
});
