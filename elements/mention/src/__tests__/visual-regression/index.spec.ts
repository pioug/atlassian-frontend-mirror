import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  ['light', 'dark'].forEach((mode) => {
    it(`should render a mention in legacy ${mode} mode`, async () => {
      const url = getExampleUrl(
        'elements',
        'mention',
        `mention-vr-${mode}`,
        global.__BASEURL__,
      );

      const { page } = global;

      await loadPage(page, url, {
        allowedSideEffects: {
          animation: true,
          transition: true,
        },
      });

      const image = await takeElementScreenShot(
        page,
        `[data-testid="mention"]`,
      );
      return expect(image).toMatchProdImageSnapshot();
    });
  });
});
