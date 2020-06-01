import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Avatar', () => {
  it('should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'avatar',
      'basicAvatar',
      global.__BASEURL__,
    );

    await global.page.setViewport({ width: 500, height: 400 });

    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should render a tooltip on hover', async () => {
    const url = getExampleUrl(
      'design-system',
      'avatar',
      'basicAvatar',
      global.__BASEURL__,
    );

    await global.page.goto(url);
    await global.page.hover('[data-testid="avatar"]');
    await global.page.waitFor(800);

    const image = await global.page.screenshot({
      clip: {
        width: 140,
        height: 200,
        x: 0,
        y: 0,
      },
    });

    expect(image).toMatchProdImageSnapshot();
  });
});
