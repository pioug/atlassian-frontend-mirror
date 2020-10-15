import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

const overflowMenuTriggerSelector =
  '[data-testid="within-modal--overflow-menu--trigger"]';
const overflowMenuContentSelector =
  '[data-testid="within-modal--overflow-menu"]';

describe('avatar group within-modal snapshots', () => {
  it('should match the snapshot of the avatar group within a modal', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'avatar-group',
      'within-modal',
      __BASEURL__,
    );

    await loadPage(page, url);

    await page.waitForSelector(overflowMenuTriggerSelector);
    await page.click(overflowMenuTriggerSelector);

    await page.waitForSelector(overflowMenuContentSelector);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
