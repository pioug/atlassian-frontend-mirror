import {
  PuppeteerPage,
  emulateDevice,
} from '@atlaskit/visual-regression/helper';
import { initRendererWithADF, snapshot } from '../_utils';
import {
  Alignment,
  getAlignmentADF,
  propsWithHeadingLinksEnabled,
} from './_heading-utils';
import { selectors } from '../../__helpers/page-objects/_renderer';
import { Viewport } from 'puppeteer';

// Headings with anchor links enabled
// FIXME: flaky test https://product-fabric.atlassian.net/browse/ED-13530
describe.skip('Headings with links on mobile', () => {
  let page: PuppeteerPage;

  // Test alignment options (center and right add a wrapper element)
  describe.each(['left', 'center', 'right'])('aligned %s', (alignment) => {
    // Mobile heading levels 1-6
    it('should render persistently visible anchor link', async () => {
      page = global.page;
      /**
       * To validate the default persistently visible experience on mobile we use device emulation
       * as as a shortcut to mimicking the mobile experience.
       *
       * Note that although emulation shrinks the viewport to the mobile device width, the
       * `initRendererWithADF` function resizes the viewport back to the desktop width internally,
       * so we store a reference to the desired device dimensions and pass those through to
       * retain the correct size.
       */
      const disableEmulation = await emulateDevice(page, 'iPhone X');
      const { width, height } = page.viewport() || ({} as Viewport);

      // Init editor
      await initRendererWithADF(page, {
        adf: getAlignmentADF(alignment as Alignment, true),
        rendererProps: propsWithHeadingLinksEnabled,
        appearance: 'mobile',
        viewport: {
          width,
          height,
        },
      });

      // Wait for content then capture the screenshot
      await page.waitForSelector('.heading-anchor-wrapper > button', {
        visible: true,
      });
      await snapshot(page, undefined, selectors.container);

      // Remove emulation so that it doesn't impact subsequent tests
      await disableEmulation();
    });
  });
});
