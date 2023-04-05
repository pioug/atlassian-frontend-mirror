import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF, animationFrame } from '../_utils';
import { waitForAllMedia } from '../../__helpers/page-objects/_media';
import { RendererAppearance } from '../../../ui/Renderer/types';
import borderADF from './__fixtures__/media-border.adf.json';

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
    await initRenderer(page, 'full-page', borderADF);
  });

  it(`should render media single with border mark`, async () => {
    await waitForAllMedia(page, 1);
    await page.waitForSelector('div[data-mark-type="border"]', {
      visible: true,
    });

    await animationFrame(page);
    await snapshot(page);
  });
});
