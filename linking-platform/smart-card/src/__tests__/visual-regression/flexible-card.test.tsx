import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Flexible Card', () => {
  it('renders FlexibleCard', async () => {
    const url = getURL('vr-flexible-ui-options');
    const page = await setup(url);
    await page.waitForSelector('[data-testid="smart-links-container"]');

    const image = await takeSnapshot(page, 850);
    expect(image).toMatchProdImageSnapshot();
  });

  describe('blocks', () => {
    it('renders block feature', async () => {
      const url = getURL('vr-flexible-ui-block');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="smart-links-container"]');
      const image = await takeSnapshot(page, 620);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders TitleBlock', async () => {
      const url = getURL('vr-flexible-ui-block-title');
      const screenHeight = 2640;
      const page = await setup(url);
      await page.waitForSelector('[data-testid="smart-links-container"]');

      let image = await takeSnapshot(page, screenHeight, undefined);
      expect(image).toMatchProdImageSnapshot();

      // Hover over "more actions" (three dots) button on "action on hover only" row
      const hoverActionsRowSelector =
        '[data-testid="actions-on-hover-title-block-resolved-view"]';
      await page.waitForSelector(hoverActionsRowSelector);
      await page.hover(hoverActionsRowSelector);

      const moreActionsSelector = `${hoverActionsRowSelector} [data-testid="action-group-more-button"]`;
      await page.waitForSelector(moreActionsSelector, { visible: true });

      image = await takeSnapshot(page, screenHeight, undefined);
      expect(image).toMatchProdImageSnapshot();

      await page.click(moreActionsSelector);

      // Hover over "delete action". We want to test dropdown trigger does not disappear
      const deleteActionSelector = `[data-testid="smart-action-delete-action"]`;
      await page.waitForSelector(deleteActionSelector);
      await page.hover(deleteActionSelector);

      image = await takeSnapshot(page, screenHeight, undefined);
      expect(image).toMatchProdImageSnapshot();
    });

    it('renders MetadataBlock', async () => {
      const url = getURL('vr-flexible-ui-block-metadata');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="smart-links-container"]');
      const image = await takeSnapshot(page, 1150);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders SnippetBlock', async () => {
      const url = getURL('vr-flexible-ui-block-snippet');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="smart-links-container"]');
      const image = await takeSnapshot(page, 400);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders FooterBlock', async () => {
      const url = getURL('vr-flexible-ui-block-footer');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="smart-links-container"]');
      const image = await takeSnapshot(page, 810);

      expect(image).toMatchProdImageSnapshot();

      // Click on "more actions" (three dots) button.
      await page.waitForSelector('[data-testid="action-group-more-button"]');
      await page.click('[data-testid="action-group-more-button"]');

      await page.waitForSelector('[data-testid="third-action-item"]');
      const image2 = await takeSnapshot(page, 810);

      expect(image2).toMatchProdImageSnapshot();
    });

    it('renders PreviewBlock', async () => {
      const url = getURL('vr-flexible-ui-block-preview');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="smart-links-container"]');
      const image = await takeSnapshot(page, 6650);

      expect(image).toMatchProdImageSnapshot();
    });
  });

  describe('actions', () => {
    it('renders Action', async () => {
      const url = getURL('vr-flexible-ui-action');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="vr-test-delete-action"]');

      const image = await takeSnapshot(page, 450);
      expect(image).toMatchProdImageSnapshot();
    });
  });

  describe('elements', () => {
    it('renders link', async () => {
      const url = getURL('vr-flexible-ui-element-link');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="vr-test-title"]');
      const image = await takeSnapshot(page, 630);

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

      const image = await takeSnapshot(page, 650);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders lozenge', async () => {
      const url = getURL('vr-flexible-ui-element-lozenge');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="vr-test-lozenge"]');
      await page.hover('[data-testid="vr-test-lozenge-action-experiment"]');
      const image = await takeSnapshot(page, 230);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders badge', async () => {
      const url = getURL('vr-flexible-ui-element-badge');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="vr-test-badge-comment"]');
      const image = await takeSnapshot(page, 430);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders avatar group', async () => {
      const url = getURL('vr-flexible-ui-element-avatar-group');
      const page = await setup(url);
      await page.waitForSelector(
        '[data-testid="vr-test-author-group-xlarge-0--avatar-group"]',
      );
      const image = await takeSnapshot(page, 390);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders text', async () => {
      const url = getURL('vr-flexible-ui-element-text-and-date');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="vr-test-text"]');
      const image = await takeSnapshot(page, 330);

      expect(image).toMatchProdImageSnapshot();
    });

    it('renders media', async () => {
      const url = getURL('vr-flexible-ui-element-media');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="vr-test-media"]');
      const image = await takeSnapshot(page, 690);

      expect(image).toMatchProdImageSnapshot();
    });
  });

  describe('integrated', () => {
    it('renders various compositions', async () => {
      const url = getURL('vr-flexible-ui-composition');
      const page = await setup(url);

      await page.waitForSelector('[data-testid="smart-links-container"]');

      const buttonSelector = '[data-testid="smart-action-delete-action"]';
      await page.waitForSelector(buttonSelector);
      await page.hover(buttonSelector);

      const image = await takeSnapshot(page, 860);

      expect(image).toMatchProdImageSnapshot();
    });

    it('able to navigate with keyboard', async () => {
      const height = 240;
      const url = getURL('vr-flexible-ui-accessibility');
      const page = await setup(url);

      await page.waitForSelector('[data-testid="smart-links-container"]');
      await page.waitForSelector('[data-testid="keyboard-1-resolved-view"]');

      // Focus on link
      const linkSelector = '[data-testid="smart-element-link"]';
      await page.waitForSelector(linkSelector);
      await page.focus(linkSelector);
      await page.waitForSelector('[data-testid="smart-element-link-tooltip"]');
      const imageFocusOnLink = await takeSnapshot(page, height);
      expect(imageFocusOnLink).toMatchProdImageSnapshot();

      // Focus on More action button
      await page.keyboard.press('Tab');
      await page.waitForSelector('[data-testid="smart-element-link-tooltip"]', {
        hidden: true,
      });
      const imageMoreAction = await takeSnapshot(page, height);
      expect(imageMoreAction).toMatchProdImageSnapshot();

      // Open More action menu and focus on the first action
      await page.keyboard.press('Enter');
      await page.waitForSelector('[data-testid="action-item-custom"]');
      await page.waitForSelector(
        '[data-testid="action-group-more-button-tooltip"]',
        { hidden: true },
      );
      const imageOpenMoreAction = await takeSnapshot(page, height);
      expect(imageOpenMoreAction).toMatchProdImageSnapshot();

      // Focus on second action
      await page.keyboard.press('Tab');
      const imageSecondAction = await takeSnapshot(page, height);
      expect(imageSecondAction).toMatchProdImageSnapshot();

      // Unresolved view: Focus on link
      await page.waitForSelector('[data-testid="keyboard-2-errored-view"]');
      await page.keyboard.press('Escape'); // Close more menu
      await page.waitForSelector(
        '.atlaskit-portal-container [data-testid="action-item-custom"]',
        { hidden: true },
      );
      await page.keyboard.press('Tab'); // Go to next link
      await page.waitForSelector('[data-testid="smart-element-link-tooltip"]');
      const imageUnresolvedLink = await takeSnapshot(page, height);
      expect(imageUnresolvedLink).toMatchProdImageSnapshot();

      // Unresolved view: Focus on try to connect
      await page.keyboard.press('Tab');
      await page.waitForSelector('[data-testid="smart-element-link-tooltip"]', {
        hidden: true,
      });
      const imageUnresolvedAuthenticate = await takeSnapshot(page, height);
      expect(imageUnresolvedAuthenticate).toMatchProdImageSnapshot();

      // Unresolved view: Focus on first action
      await page.keyboard.press('Tab');
      const imageUnresolvedAction = await takeSnapshot(page, height);
      expect(imageUnresolvedAction).toMatchProdImageSnapshot();
    });
  });

  it('renders Unresolved views of FlexibleCard', async () => {
    const url = getURL('vr-flexible-ui-block-card-errored-states');
    const page = await setup(url);
    await page.waitForSelector('[data-testid="smart-block-not-found-view"]');

    const image = await takeSnapshot(page, 800);
    expect(image).toMatchProdImageSnapshot();
  });

  it('renders variants of Forbidden views of Block Card with Flexible UI', async () => {
    const url = getURL('vr-flexible-block-card-variants-of-forbidden-views');
    const page = await setup(url);
    await page.waitForSelector('[data-testid="default-forbidden-view"]');
    await page.waitForSelector('[data-testid="direct-access-forbidden-view"]');
    await page.waitForSelector('[data-testid="request-access-forbidden-view"]');
    await page.waitForSelector(
      '[data-testid="pending-request-forbidden-view"]',
    );
    await page.waitForSelector('[data-testid="forbidden-forbidden-view"]');
    await page.waitForSelector('[data-testid="denied-request-forbidden-view"]');

    const image = await takeSnapshot(page, 1000);
    expect(image).toMatchProdImageSnapshot();
  });
});
