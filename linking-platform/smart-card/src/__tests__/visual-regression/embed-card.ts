import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

const sleep = (time: number) => new Promise((r) => setTimeout(r, time));

describe('Embed Card', () => {
  it('shows unresolved views', async () => {
    const url = getURL('vr-embed-card-unresolved-views');
    const page = await setup(url);
    await page.waitForSelector(
      '[data-testid="embed-card-forbidden-view-unresolved-image"]',
    );

    const image = await takeSnapshot(page, 2050);
    expect(image).toMatchProdImageSnapshot();
  });

  describe('frame', () => {
    // TODO: Restore skipped test https://product-fabric.atlassian.net/browse/ED-16713
    it.skip('should render as a link when there is an href', async () => {
      const url = getURL('vr-embed-card-frame');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="href-defined"]', {
        visible: false,
      });
      await page.hover('[data-testid="href-defined"]');
      await page.waitForSelector('[data-testid="href-defined"]', {
        visible: true,
      });
      //sleep to reduce css flakyness
      await sleep(1000);

      const image = await takeSnapshot(page, 2800);
      expect(image).toMatchProdImageSnapshot();
    });

    it('should not render as a link when there is no href', async () => {
      const url = getURL('vr-embed-card-frame');
      const page = await setup(url);
      await page.waitForSelector('[data-testid="no-props"]');
      await page.hover('[data-testid="no-props"]');

      const image = await takeSnapshot(page, 2800);
      expect(image).toMatchProdImageSnapshot();
    });

    it('should not be interactive when isPlaceholder=true and href is defined', async () => {
      const url = getURL('vr-embed-card-frame');
      const page = await setup(url);
      await page.waitForSelector(
        '[data-testid="isplaceholder-true-and-href-defined"]',
      );
      await page.hover('[data-testid="isplaceholder-true-and-href-defined"]');

      const image = await takeSnapshot(page, 2800);
      expect(image).toMatchProdImageSnapshot();
    });
    it('should not be interactive when isPlaceholder=true and onClick is defined', async () => {
      const url = getURL('vr-embed-card-frame');
      const page = await setup(url);
      await page.waitForSelector(
        '[data-testid="isplaceholder-true-and-onclick-defined"]',
      );
      await page.hover(
        '[data-testid="isplaceholder-true-and-onclick-defined"]',
      );

      const image = await takeSnapshot(page, 2800);
      expect(image).toMatchProdImageSnapshot();
    });
    it('should be interactive when isPlaceholder=false and href is defined', async () => {
      const url = getURL('vr-embed-card-frame');
      const page = await setup(url);
      await page.waitForSelector(
        '[data-testid="isplaceholder-false-and-href-defined"]',
        {
          visible: false,
        },
      );
      await page.hover('[data-testid="isplaceholder-false-and-href-defined"]');
      await page.waitForSelector(
        '[data-testid="isplaceholder-false-and-href-defined"]',
        {
          visible: true,
        },
      );
      await sleep(1000);

      const image = await takeSnapshot(page, 2800);
      expect(image).toMatchProdImageSnapshot();
    });
    it('should be interactive when isPlaceholder=false and onClick is defined', async () => {
      const url = getURL('vr-embed-card-frame');
      const page = await setup(url);
      await page.waitForSelector(
        '[data-testid="isplaceholder-false-and-onclick-defined"]',
        {
          visible: false,
        },
      );
      await page.hover(
        '[data-testid="isplaceholder-false-and-onclick-defined"]',
      );
      await page.waitForSelector(
        '[data-testid="isplaceholder-false-and-onclick-defined"]',
        {
          visible: true,
        },
      );
      await sleep(1000);

      const image = await takeSnapshot(page, 2800);
      expect(image).toMatchProdImageSnapshot();
    });

    it('should render different frame styles based on the passed prop', async () => {
      const url = getURL('vr-embed-card-frame-styles');
      const page = await setup(url);

      // make sure all four views have rendered
      await page.waitForSelector('[data-testid="embed-frame-show"]');
      await page.waitForSelector('[data-testid="embed-frame-show-on-hover"]');
      await page.waitForSelector(
        '[data-testid="embed-frame-show-on-hover-mouse-over"]',
      );
      await page.waitForSelector('[data-testid="embed-frame-hide"]');
      await page.waitForSelector('[data-testid="embed-frame-hide-selected"]');
      await page.waitForSelector('[data-testid="embed-frame-show-selected"]');
      await page.waitForSelector(
        '[data-testid="embed-frame-show-on-hover-selected"]',
      );

      // hover over the embed with 'showOnHover' frame style
      await page.hover('[data-testid="embed-frame-show-on-hover-mouse-over"]');
      await sleep(1000);

      const image = await takeSnapshot(page, 3700);
      expect(image).toMatchProdImageSnapshot();
    });
  });
});
/*
  notes ---------------------------
  link wrapper = text decoration: none
  isInteractive = :active : background color grey

  we can test the styles and props in one - two birds
*/
