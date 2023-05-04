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

    it('renders lozenge error when there are no status transitions', async () => {
      const url = getURL('vr-action-lozenge-load-no-data-error');
      const page = await setup(url + '&delay=800');
      await page.waitForSelector(triggerSelector);

      await page.click(triggerSelector);
      await page.waitForSelector(`[data-testid="${testId}-error-item-group"]`);
      const image = await takeSnapshot(page, height);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders lozenge error when there is an unknown error', async () => {
      const url = getURL('vr-action-lozenge-load-unknown-error');
      const page = await setup(url + '&delay=500');
      await page.waitForSelector(triggerSelector);

      await page.click(triggerSelector);
      await page.waitForSelector(`[data-testid="${testId}-error-item-group"]`);
      const image = await takeSnapshot(page, height);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders lozenge action update failure default message', async () => {
      const url = getURL('vr-action-lozenge-update-failed-error');
      const page = await setup(url + '&delay=500');
      await page.waitForSelector(triggerSelector);

      await page.click(triggerSelector);
      await page.waitForSelector(`[data-testid="${testId}-item-group"]`);
      await page.waitForSelector(`[data-testid="${testId}-item-0"]`);
      await page.click(`[data-testid="${testId}-item-0"]`);
      await page.waitForSelector(`[data-testid="${testId}-error-item-group"]`);

      const image = await takeSnapshot(page, height);
      expect(image).toMatchProdImageSnapshot();
    });

    it('renders lozenge action update failure custom user message', async () => {
      const url = getURL('vr-action-lozenge-custom-update-error');
      const page = await setup(url + '&delay=500');
      await page.waitForSelector(triggerSelector);

      await page.click(triggerSelector);
      await page.waitForSelector(`[data-testid="${testId}-item-group"]`);
      await page.waitForSelector(`[data-testid="${testId}-item-0"]`);
      await page.click(`[data-testid="${testId}-item-0"]`);
      await page.waitForSelector(`[data-testid="${testId}-error-item-group"]`);

      const image = await takeSnapshot(page, height);
      expect(image).toMatchProdImageSnapshot();
    });

    it('renders lozenge action update failure without preview modal availability', async () => {
      const url = getURL('vr-action-lozenge-error-without-preview-data');
      const page = await setup(url);
      await page.waitForSelector(triggerSelector);

      await page.click(triggerSelector);
      await page.waitForSelector(`[data-testid="${testId}-item-group"]`);
      await page.waitForSelector(`[data-testid="${testId}-item-0"]`);
      await page.click(`[data-testid="${testId}-item-0"]`);
      await page.waitForSelector(`[data-testid="${testId}-error-item-group"]`);

      const image = await takeSnapshot(page, height);
      expect(image).toMatchProdImageSnapshot();
    });

    it('renders preview modal when user clicks on error link', async () => {
      const url = getURL('vr-action-lozenge-custom-update-error');
      const page = await setup(url);
      await page.waitForSelector(triggerSelector);

      await page.click(triggerSelector);
      await page.waitForSelector(`[data-testid="${testId}-item-group"]`);
      await page.waitForSelector(`[data-testid="${testId}-item-0"]`);
      await page.click(`[data-testid="${testId}-item-0"]`);
      await page.waitForSelector(`[data-testid="${testId}-error-item-group"]`);

      await page.click(`[data-testid="${testId}-open-embed"]`);
      await page.waitForSelector(
        '[data-testid="smart-embed-preview-modal-embed"]',
      );

      const image = await takeSnapshot(page, 550, 0);
      expect(image).toMatchProdImageSnapshot();
    });
  });
});
