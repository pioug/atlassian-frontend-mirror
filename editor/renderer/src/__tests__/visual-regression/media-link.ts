import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF, animationFrame } from './_utils';
import mediaLink from './__fixtures__/media-link.adf.json';
import wrappedMediaLink from './__fixtures__/wrapped-media-link.adf.json';
import { richMediaClassName } from '@atlaskit/editor-common';
import { waitForAllMedia } from '../__helpers/page-objects/_media';

const mediaSingleSelector = `.${richMediaClassName}`;

describe('media link:', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });

  it(`should render a linked media image correctly when hovered`, async () => {
    await initRendererWithADF(page, {
      adf: mediaLink,
      appearance: 'full-page',
      rendererProps: {
        media: {
          allowLinking: true,
        },
      },
    });

    await waitForAllMedia(page, 1);

    await page.hover(mediaSingleSelector);
    await page.waitForSelector('a.ak-editor-media-link', { visible: true });
    await animationFrame(page);
    // the link button is showing up as the larger mobile view as we don't
    // currently have access to puppeteer's Page.emulateMediaFeatures() API
    await snapshot(page, undefined, mediaSingleSelector);
  });

  it(`should render a linked media image below a wrapped image correctly`, async () => {
    await initRendererWithADF(page, {
      adf: wrappedMediaLink,
      appearance: 'full-page',
      rendererProps: {
        media: {
          allowLinking: true,
        },
      },
    });

    await waitForAllMedia(page, 2);
    await page.hover(mediaSingleSelector);
    await page.waitForSelector('a.ak-editor-media-link', { visible: true });
    await animationFrame(page);
    await snapshot(page);
  });
});
