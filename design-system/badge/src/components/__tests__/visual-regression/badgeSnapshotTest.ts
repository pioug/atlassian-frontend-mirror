import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('badge basic example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'badge',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;

    // Move the mouse away from the first button to avoid
    // the hover effect from triggering.
    await page.mouse.move(400, 0);

    const image = await takeScreenShot(page, url);

    expect(image).toMatchProdImageSnapshot();
  });
});
