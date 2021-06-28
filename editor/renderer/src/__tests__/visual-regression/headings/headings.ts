import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initRendererWithADF, snapshot } from '../_utils';
import { selectors as rendererSelectors } from '../../__helpers/page-objects/_renderer';
import {
  Alignment,
  getAlignmentADF,
  propsWithoutHeadingLinksEnabled,
} from './_heading-utils';

// Headings without anchor links
describe('Headings', () => {
  let page: PuppeteerPage;

  const setPage = () => (page = global.page);

  beforeAll(setPage);
  beforeEach(setPage);

  // Test alignment options (center and right add a wrapper element)
  describe.each(['left', 'center', 'right'])('aligned %s', (alignment) => {
    beforeAll(async () => {
      await initRendererWithADF(page, {
        adf: getAlignmentADF(alignment as Alignment),
        rendererProps: propsWithoutHeadingLinksEnabled,
        appearance: 'full-page',
        viewport: {
          width: 200,
          height: 400,
        },
      });
    });

    // Test heading levels 1-6
    it('should render headings', async () => {
      const selector = `h1:first-of-type`;
      await page.waitForSelector(selector);
      await page.hover(selector);
      await snapshot(page, undefined, rendererSelectors.document);
    });
  });
});
