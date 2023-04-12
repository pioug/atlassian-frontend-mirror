import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('server action', () => {
  describe('lozenge action', () => {
    const height = 220;
    const testId = 'vr-test-lozenge-action';
    const triggerSelector = `[data-testid="${testId}--trigger"]`;

    it('renders lozenge action', async () => {
      const url = getURL('vr-action-lozenge');
      const page = await setup(url);

      await page.waitForSelector(triggerSelector);
      const image = await takeSnapshot(page, height);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders lozenge action dropdown list', async () => {
      const url = getURL('vr-action-lozenge');
      const page = await setup(url);
      await page.waitForSelector(triggerSelector);

      await page.click(triggerSelector);
      await page.waitForSelector(`[data-testid="${testId}-item-group"]`);
      await page.hover(`[data-testid="${testId}-item-1"]`);
      const image = await takeSnapshot(page, height);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders lozenge action loading', async () => {
      const url = getURL('vr-action-lozenge');
      const page = await setup(url + '&delay=500');
      await page.waitForSelector(triggerSelector);

      await page.click(triggerSelector);
      await page.waitForSelector('[role="status"]');
      const image = await takeSnapshot(page, height);

      expect(image).toMatchProdImageSnapshot();
    });
  });
});
