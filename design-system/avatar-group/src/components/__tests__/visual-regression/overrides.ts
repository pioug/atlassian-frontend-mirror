import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const overflowMenuTriggerSelector =
  '[data-testid="overrides--overflow-menu--trigger"]';
const overflowMenuContentSelector = '[data-testid="overrides--overflow-menu"]';

describe('avatar group override snapshots', () => {
  it('should match the snapshot of the customized overflow menu', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'avatar-group',
      'overrides',
      __BASEURL__,
    );

    await loadPage(page, url);
    await page.waitForSelector(overflowMenuTriggerSelector);
    await page.click(overflowMenuTriggerSelector);

    const image = await takeElementScreenShot(
      page,
      overflowMenuContentSelector,
    );
    expect(image).toMatchProdImageSnapshot();
  });
});
