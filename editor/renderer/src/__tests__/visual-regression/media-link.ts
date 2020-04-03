import { Page } from 'puppeteer';
import { snapshot, initRendererWithADF, animationFrame } from './_utils';
import mediaLink from './__fixtures__/media-link.adf.json';
import wrappedMediaLink from './__fixtures__/wrapped-media-link.adf.json';
import { mediaSingleClassName } from '@atlaskit/editor-common';

const mediaSingleSelector = `.${mediaSingleClassName}`;
// TODO: https://product-fabric.atlassian.net/browse/ED-8011
// ED-8011 Implement proper mock for media client on Renderer VR Tests.
describe.skip('media link:', () => {
  let page: Page;

  beforeEach(async () => {
    page = global.page;
  });

  it(`should render a linked media image correctly when hovered`, async () => {
    await initRendererWithADF(page, {
      adf: mediaLink,
      appearance: 'full-page',
    });
    await page.waitForSelector(mediaSingleSelector);
    await page.hover(mediaSingleSelector);
    await page.waitFor(300);
    await animationFrame(page);
    // the link button is showing up as the larger mobile view as we don't
    // currently have access to puppeteer's Page.emulateMediaFeatures() API
    await snapshot(page, undefined, mediaSingleSelector);
  });

  it(`should render a linked media image below a wrapped image correctly`, async () => {
    await initRendererWithADF(page, {
      adf: wrappedMediaLink,
      appearance: 'full-page',
    });

    await page.waitForSelector(mediaSingleSelector);
    await page.hover(mediaSingleSelector);
    await page.waitFor(300);
    await animationFrame(page);
    await snapshot(page);
  });
});
