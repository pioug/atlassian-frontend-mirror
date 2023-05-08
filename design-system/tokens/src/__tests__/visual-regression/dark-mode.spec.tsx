import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

it('should honour the dark theme', async () => {
  const url = getExampleUrl(
    'design-system',
    'tokens',
    'color-roles',
    global.__BASEURL__,
    'dark',
  );

  await loadPage(global.page, url);

  const image = await takeElementScreenShot(
    global.page,
    '[data-testid="tokens"]',
  );
  expect(image).toMatchProdImageSnapshot();
});
