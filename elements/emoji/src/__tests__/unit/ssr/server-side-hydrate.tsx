import { getExamplesFor, ssr } from '@atlaskit/ssr';
import Loadable from 'react-loadable';

Loadable.preloadAll();

describe('ssr for emoji', () => {
  // FIXME: This test was automatically skipped due to failure on 30/06/2023: https://product-fabric.atlassian.net/browse/COLLAB-2698
  it.skip('should not throw when rendering any example on the server', async () => {
    const examples = await getExamplesFor('emoji');

    const results = await Promise.allSettled(
      examples.map((file: any) => ssr(file.filePath)),
    );

    expect(
      results.every((result) => result.status === 'fulfilled'),
    ).toBeTruthy();
  });
});
