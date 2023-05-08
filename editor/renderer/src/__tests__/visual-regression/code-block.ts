import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import { snapshot, initRendererWithADF } from './_utils';
import * as adf from '../__fixtures__/code-block.adf.json';
import * as adfCodeBlockOutsideViewport from '../__fixtures__/code-block-outside-viewport.adf.json';
import * as adfTrailingNewline from '../__fixtures__/code-block-trailing-newline.adf.json';
import * as adfCodeBlockInsideLayout from '../__fixtures__/code-block-inside-layout.adf.json';
import { selectors } from '../__helpers/page-objects/_codeblock';

const scrollToBottom = (page: PuppeteerPage) =>
  page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

describe('Snapshot Test: CodeBlock', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  describe('codeblock', () => {
    afterEach(async () => {
      await snapshot(page, undefined, selectors.codeBlock);
    });

    // FIXME: This test was automatically skipped due to failure on 07/05/2023: https://product-fabric.atlassian.net/browse/ED-17778
    test.skip('should render copy-to-clipboard button correctly on hover when enabled', async () => {
      await initRendererWithADF(page, {
        appearance: 'full-page',
        rendererProps: { allowCopyToClipboard: true },
        adf,
      });
      await page.waitForSelector(selectors.codeBlock);
      await page.hover(selectors.codeBlock);
      await page.waitForSelector(
        `${selectors.codeBlock} ${selectors.copyToClipboardButton}`,
      );
      await page.hover(
        `${selectors.codeBlock} ${selectors.copyToClipboardButton}`,
      );

      await page.addStyleTag({
        content: `
            /*
              Prevents the tooltip from displaying and blocking the copy button
              from being visible
            */
            .Tooltip { display: none; }
          `,
      });
    });

    // FIXME: This test was automatically skipped due to failure on 13/04/2023: https://product-fabric.atlassian.net/browse/ED-17492
    test.skip('should render wrap button correctly on hover when enabled', async () => {
      await initRendererWithADF(page, {
        appearance: 'full-page',
        rendererProps: { allowWrapCodeBlock: true },
        adf,
      });
      await page.waitForSelector(selectors.codeBlock);
      await page.hover(selectors.codeBlock);
      await page.waitForSelector(
        `${selectors.codeBlock} ${selectors.wrapButton}`,
      );
      await page.hover(`${selectors.codeBlock} ${selectors.wrapButton}`);
    });

    // FIXME: This test was automatically skipped due to failure on 24/04/2023: https://product-fabric.atlassian.net/browse/ED-17592
    test.skip('should render wrap and copy-to-clipboard buttons correctly on hover when both are enabled', async () => {
      await initRendererWithADF(page, {
        appearance: 'full-page',
        rendererProps: { allowWrapCodeBlock: true, allowCopyToClipboard: true },
        adf,
      });
      await page.waitForSelector(selectors.codeBlock);
      await page.hover(selectors.codeBlock);
    });

    // FIXME: This test was automatically skipped due to failure on 11/04/2023: https://product-fabric.atlassian.net/browse/ED-17437
    test.skip('should render wrap and copy-to-clipboard buttons correctly inside a layout', async () => {
      await initRendererWithADF(page, {
        appearance: 'full-page',
        rendererProps: { allowWrapCodeBlock: true, allowCopyToClipboard: true },
        adf: adfCodeBlockInsideLayout,
      });
      await page.waitForSelector(selectors.codeBlock);
      await page.hover(selectors.codeBlock);
    });

    test('should render trailing newline', async () => {
      await initRendererWithADF(page, {
        appearance: 'full-page',
        adf: adfTrailingNewline,
      });
      await page.waitForSelector(selectors.codeBlock);
    });
  });

  describe('windowed codeblock (allowWindowedCodeBlock is enabled)', () => {
    describe('when not scrolled into viewport yet', () => {
      it('should initially render only a LightWeightCodeBlock offscreen', async () => {
        await initRendererWithADF(page, {
          appearance: 'full-page',
          rendererProps: {
            allowCopyToClipboard: true,
            featureFlags: { 'allow-windowed-code-block': true },
          },
          adf: adfCodeBlockOutsideViewport,
        });
        await page.waitForSelector(selectors.lightWeightCodeBlock);
        const akCodeBlockExists = await page.evaluate(
          (selector) => Boolean(document.querySelector(selector)),
          selectors.designSystemCodeBlock,
        );
        expect(akCodeBlockExists).toEqual(false);
      });
    });

    describe('when scrolled into viewport', () => {
      it('should eventually render a normal AkCodeBlock (with syntax highlighting)', async () => {
        await initRendererWithADF(page, {
          appearance: 'full-page',
          rendererProps: {
            allowCopyToClipboard: true,
            featureFlags: { 'allow-windowed-code-block': true },
          },
          adf: adfCodeBlockOutsideViewport,
        });
        const lightWeightCodeBlock = await page.waitForSelector(
          selectors.lightWeightCodeBlock,
        );
        expect(lightWeightCodeBlock).toBeTruthy();
        await scrollToBottom(page);
        const designSystemCodeBlock = await page.waitForSelector(
          selectors.designSystemCodeBlock,
        );
        expect(designSystemCodeBlock).toBeTruthy();
      });
    });
  });
});
