import { getExamplesFor, ssr } from '@atlaskit/ssr';
import Loadable from 'react-loadable';

Loadable.preloadAll();

describe('ssr for emoji', () => {
	it('should not throw when rendering any example on the server', async () => {
		const examples = await getExamplesFor('emoji');

		const results = await Promise.allSettled(examples.map((file: any) => ssr(file.filePath)));

		expect(results.every((result) => result.status === 'fulfilled')).toBeTruthy();
	});
});
