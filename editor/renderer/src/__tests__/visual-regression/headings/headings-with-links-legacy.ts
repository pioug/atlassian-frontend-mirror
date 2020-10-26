import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initRendererWithADF } from '../_utils';
import {
  Alignment,
  hoverOnHeadingWithLinkThenSnapshot,
  getAlignmentADF,
  legacypropsWithHeadingLinksEnabled,
} from './_heading-utils';
import adfHeadingsNestedLayout from '../../__fixtures__/headings-nested-layout.adf.json';
import adfHeading from '../../__fixtures__/heading-tooltip.adf.json';

// Headings with anchor links enabled
describe('Headings with links (legacy)', () => {
  let page: PuppeteerPage;

  const setPage = () => (page = global.page);

  beforeAll(setPage);
  beforeEach(setPage);

  it('should render tooltip on anchor link hover and click', async () => {
    await initRendererWithADF(page, {
      adf: adfHeading,
      rendererProps: legacypropsWithHeadingLinksEnabled,
      appearance: 'full-page',
      viewport: {
        width: 180,
        height: 150,
      },
    });
    await hoverOnHeadingWithLinkThenSnapshot(page, 'h1', {
      snapshotMargin: true,
      screenshotOnCopyTooltip: true,
      screenshotOnCopiedTooltip: true,
    });
  });

  // Test alignment options (center and right add a wrapper element)
  describe.each(['left', 'center', 'right'])('aligned %s', alignment => {
    beforeAll(async () => {
      await initRendererWithADF(page, {
        adf: getAlignmentADF(alignment as Alignment, true),
        rendererProps: legacypropsWithHeadingLinksEnabled,
        appearance: 'full-page',
        viewport: {
          width: 190,
          height: 400,
        },
      });
    });

    // Test heading levels 1-6
    test.each([1, 2, 3, 4, 5, 6])(
      'should render anchor link on h%s hover',
      async headingLevel => {
        await hoverOnHeadingWithLinkThenSnapshot(
          page,
          `h${headingLevel}:first-of-type`,
          { snapshotMargin: true, screenshotOnHeadingHover: true },
        );
      },
    );
  });

  it('should render anchor links when nested inside a layout', async () => {
    await initRendererWithADF(page, {
      adf: adfHeadingsNestedLayout,
      rendererProps: legacypropsWithHeadingLinksEnabled,
      appearance: 'full-page',
      viewport: {
        // smallest width to ensure the 2 col layout doesn't stack vertically.
        // This is a limitation of the testing page, not a general limitation.
        width: 1025,
        height: 400,
      },
    });
    await hoverOnHeadingWithLinkThenSnapshot(page, '#LC-Heading-C');
    await hoverOnHeadingWithLinkThenSnapshot(page, '#RC-Heading-C');
  });
});
