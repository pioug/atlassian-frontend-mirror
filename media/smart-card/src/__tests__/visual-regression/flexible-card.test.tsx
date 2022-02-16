import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Flexible Card', () => {
  it('renders FlexibleCard', async () => {
    const url = getURL('vr-flexible-ui-options');
    const page = await setup(url);
    await page.waitForSelector('[data-testid="smart-links-container"]');

    const image = await takeSnapshot(page, 750);
    expect(image).toMatchProdImageSnapshot();
  });

  describe('blocks', () => {
    it('renders TitleBlock', async () => {
      const url = getURL('vr-flexible-ui-block-title');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="smart-links-container"]');
      const image = await takeSnapshot(page, 1340);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders MetadataBlock', async () => {
      const url = getURL('vr-flexible-ui-block-metadata');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="smart-links-container"]');
      const image = await takeSnapshot(page, 1120);

      expect(image).toMatchProdImageSnapshot();
    });
  });

  describe('actions', () => {
    it('renders DeleteAction', async () => {
      const url = getURL('vr-flexible-ui-action-delete');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="vr-test-delete-action"]');

      const image = await takeSnapshot(page, 300);
      expect(image).toMatchProdImageSnapshot();
    });
  });

  describe('elements', () => {
    it('renders link', async () => {
      const url = getURL('vr-flexible-ui-element-link');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="vr-test-title"]');
      const image = await takeSnapshot(page, 580);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders icon', async () => {
      const url = getURL('vr-flexible-ui-element-icon');
      const page = await setup(url);
      await page.waitForSelector(`[data-testid="vr-test-icon-0-0"]`);

      await page.evaluate(() => {
        // @ts-ignore TS2339: Property 'setLoadingIconUrl' does not exist on type 'Window & typeof globalThis'
        setLoadingIconUrl();
      });
      await page.waitForSelector('[data-testid="vr-test-image-icon-loading"]');

      const image = await takeSnapshot(page, 570);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders lozenge', async () => {
      const url = getURL('vr-flexible-ui-element-lozenge');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="vr-test-lozenge"]');
      const image = await takeSnapshot(page, 120);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders badge', async () => {
      const url = getURL('vr-flexible-ui-element-badge');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="vr-test-badge-comment"]');
      const image = await takeSnapshot(page, 360);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders avatar group', async () => {
      const url = getURL('vr-flexible-ui-element-avatar-group');
      const page = await setup(url);
      await page.waitForSelector(
        '[data-testid="vr-test-author-group-xlarge-0--avatar-group"]',
      );
      const image = await takeSnapshot(page, 340);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders text', async () => {
      const url = getURL('vr-flexible-ui-element-text-and-date');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="vr-test-text"]');
      const image = await takeSnapshot(page, 120);

      expect(image).toMatchProdImageSnapshot();
    });
  });
});
