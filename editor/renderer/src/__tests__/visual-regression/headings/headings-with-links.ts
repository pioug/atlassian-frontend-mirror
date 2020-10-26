import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initRendererWithADF } from '../_utils';
import {
  Alignment,
  hoverOnHeadingWithLinkThenSnapshot,
  getAlignmentADF,
  propsWithHeadingLinksEnabled,
  spoofMediaQuery,
} from './_heading-utils';
import { snapshot } from '../_utils';
import { selectors } from '../../__helpers/page-objects/_renderer';
import adfHeading from '../../__fixtures__/heading-tooltip.adf.json';
import adfHeadings from '../../__fixtures__/headings-aligned-left.adf.json';
import adfHeadingsWithLink from '../../__fixtures__/headings-with-link.adf.json';
import adfHeadingsMultilined from '../../__fixtures__/headings-multilined.adf.json';

// Headings with anchor links enabled
describe('Headings with links', () => {
  let page: PuppeteerPage;

  const setPage = () => (page = global.page);

  beforeAll(setPage);
  beforeEach(setPage);

  it('should render tooltip on anchor link hover and click', async () => {
    await initRendererWithADF(page, {
      adf: adfHeading,
      rendererProps: propsWithHeadingLinksEnabled,
      appearance: 'full-page',
      viewport: {
        // Minimum width to see the whole tooltip without the link icon residing
        // in the middle of the viewport (since the heading is block and we want
        // the tooltip to dissapear on clicking of the heading).
        width: 245,
        height: 150,
      },
    });
    await hoverOnHeadingWithLinkThenSnapshot(page, 'h1', {
      screenshotOnCopyTooltip: true,
      screenshotOnCopiedTooltip: true,
    });
  });

  // Test alignment options (center and right add a wrapper element)
  describe.each(['left', 'center', 'right'])('aligned %s', alignment => {
    beforeAll(async () => {
      await initRendererWithADF(page, {
        adf: getAlignmentADF(alignment as Alignment, true),
        rendererProps: propsWithHeadingLinksEnabled,
        appearance: 'full-page',
      });
      await spoofMediaQuery(page);
    });

    beforeEach(async () => {
      switch (alignment) {
        case 'center':
          await page.setViewport({ width: 255, height: 400 });
          break;
        case 'left':
        case 'right':
          await page.setViewport({ width: 220, height: 400 });
          break;
      }
    });

    // Test heading levels 1-6
    test.each([1, 2, 3, 4, 5, 6])(
      'should render anchor link on h%s hover',
      async headingLevel => {
        // Note: some of these may end up showing a tooltip on hover because Puppeteer's
        // element.click uses the center of the element and for some of these that ends
        // up being over the top of the copy link button since headings are block (full width).
        await hoverOnHeadingWithLinkThenSnapshot(
          page,
          `h${headingLevel}:first-of-type`,
        );
      },
    );
  });

  it('should NOT render heading anchor link for comment appearance', async () => {
    await initRendererWithADF(page, {
      adf: adfHeadings,
      rendererProps: propsWithHeadingLinksEnabled,
      appearance: 'comment',
      viewport: {
        width: 130,
        height: 400,
      },
    });
    // Hover over heading
    const selector = 'h2:first-of-type';
    await page.waitForSelector(selector);
    await page.hover(selector);
    await snapshot(page, undefined, selectors.document);
  });

  it('should render anchor link when heading is hyperlinked', async () => {
    await initRendererWithADF(page, {
      adf: adfHeadingsWithLink,
      rendererProps: propsWithHeadingLinksEnabled,
      appearance: 'full-page',
      viewport: {
        width: 320,
        height: 400,
      },
    });
    await spoofMediaQuery(page);
    await hoverOnHeadingWithLinkThenSnapshot(page, 'h3:first-of-type');
  });

  it('should render anchor link when heading is multilined', async () => {
    await initRendererWithADF(page, {
      adf: adfHeadingsMultilined,
      rendererProps: propsWithHeadingLinksEnabled,
      appearance: 'full-page',
      viewport: {
        width: 400,
        height: 400,
      },
    });
    await spoofMediaQuery(page);
    await hoverOnHeadingWithLinkThenSnapshot(page, 'h3:first-of-type');
    await hoverOnHeadingWithLinkThenSnapshot(
      page,
      '.fabric-editor-block-mark[data-align="center"] h3:first-of-type',
    );
    await hoverOnHeadingWithLinkThenSnapshot(
      page,
      '.fabric-editor-block-mark[data-align="end"] h3:first-of-type',
    );
  });
});
