import __noop from '@atlaskit/ds-lib/noop';
import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Text', () => {
  ['font-sizes', 'font-weights', 'line-heights', 'testing'].forEach(
    (testId) => {
      it(`example with ${testId} should match snapshot`, async () => {
        const url = getExampleUrl(
          'design-system',
          'ds-explorations',
          'text',
          global.__BASEURL__,
        );
        const { page } = global;

        await loadPage(page, url);

        const image = await takeElementScreenShot(
          page,
          `[data-testid="${testId}"]`,
        );

        expect(image).toMatchProdImageSnapshot();
      });
    },
  );
});
