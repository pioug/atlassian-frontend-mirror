import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

const sleep = (time: number) => new Promise((r) => setTimeout(r, time));

// Skipped in ED-17195
describe.skip('Embed Card', () => {
  describe('frame', () => {
    // FIXME: This test was automatically skipped due to failure on 22/02/2023: https://product-fabric.atlassian.net/browse/EDM-5959
    it.skip('should render as a link when there is an href', async () => {
      const url = getURL('vr-embed-card-frame');
      const page = await setup(url);
      const frame = '[data-testid="href-defined"]';

      await page.waitForSelector(`${frame} .embed-header`, { visible: false });
      await page.hover(frame);
      await page.waitForSelector(`${frame} .embed-header`, { visible: true });
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
      const frame = '[data-testid="isplaceholder-true-and-href-defined"]';

      await page.waitForSelector(frame);
      await page.hover(frame);
      await sleep(1000);

      const image = await takeSnapshot(page, 2800);
      expect(image).toMatchProdImageSnapshot();
    });

    it('should not be interactive when isPlaceholder=true and onClick is defined', async () => {
      const url = getURL('vr-embed-card-frame');
      const page = await setup(url);
      const frame = '[data-testid="isplaceholder-true-and-onclick-defined"]';

      await page.waitForSelector(frame);
      await page.hover(frame);
      await sleep(1000);

      const image = await takeSnapshot(page, 2800);
      expect(image).toMatchProdImageSnapshot();
    });

    // FIXME: This test was automatically skipped due to failure on 21/02/2023: https://product-fabric.atlassian.net/browse/EDM-5946
    it.skip('should be interactive when isPlaceholder=false and href is defined', async () => {
      const url = getURL('vr-embed-card-frame');
      const page = await setup(url);
      const frame = '[data-testid="isplaceholder-false-and-href-defined"]';

      await page.waitForSelector(`${frame} .embed-header`, { visible: false });
      await page.hover(frame);
      await page.waitForSelector(`${frame} .embed-header`, { visible: true });
      await sleep(1000);

      const image = await takeSnapshot(page, 2800);
      expect(image).toMatchProdImageSnapshot();
    });

    // FIXME: This test was automatically skipped due to failure on 21/03/2023: https://product-fabric.atlassian.net/browse/EDM-6186
    it.skip('should be interactive when isPlaceholder=false and onClick is defined', async () => {
      const url = getURL('vr-embed-card-frame');
      const page = await setup(url);
      const frame = '[data-testid="isplaceholder-false-and-onclick-defined"]';

      await page.waitForSelector(`${frame} .embed-header`, { visible: false });
      await page.hover(frame);
      await page.waitForSelector(`${frame} .embed-header`, { visible: true });
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
