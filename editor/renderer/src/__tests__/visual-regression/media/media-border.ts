import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF, animationFrame } from '../_utils';
import { waitForAllMedia } from '../../__helpers/page-objects/_media';
import type { RendererAppearance } from '../../../ui/Renderer/types';
import borderADF from './__fixtures__/media-border.adf.json';
import borderADFWithLink from './__fixtures__/media-border-with-link.adf.json';
import borderADFWithinTable from './__fixtures__/media-border-within-table.adf.json';

describe('media border', () => {
  let page: PuppeteerPage;
  const initRenderer = async (
    page: PuppeteerPage,
    appearance: RendererAppearance,
    adf: any,
  ) => {
    await initRendererWithADF(page, {
      adf,
      appearance,
      rendererProps: {
        adfStage: 'stage0',
      },
    });
  };

  beforeEach(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await animationFrame(page);
    await snapshot(page);
  });

  it(`should render media single with border mark`, async () => {
    await initRenderer(page, 'full-page', borderADF);
    await waitForAllMedia(page, 1);
    await page.waitForSelector('div[data-mark-type="border"]', {
      visible: true,
    });
  });

  it(`should render media single with border and link mark`, async () => {
    await initRenderer(page, 'full-page', borderADFWithLink);
    await waitForAllMedia(page, 1);
    await page.waitForSelector('div[data-mark-type="border"]', {
      visible: true,
    });
  });

  it(`should render media singles with border mark within table`, async () => {
    await initRenderer(page, 'full-page', borderADFWithinTable);
    await waitForAllMedia(page, 2);
    await page.waitForSelector('div[data-mark-type="border"]', {
      visible: true,
    });
  });
});
