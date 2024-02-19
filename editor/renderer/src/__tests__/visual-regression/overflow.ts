import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { waitForElementCount } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initRendererWithADF,
  setScrollPosition,
  getMaxScrollWidth,
} from './_utils';
import * as document from '../../../examples/helper/overflow.adf.json';
import { animationFrame, selectors } from '../__helpers/page-objects/_renderer';
import { shadowClassNames } from '@atlaskit/editor-common/ui';

const initRenderer = async (page: PuppeteerPage, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport: { width: 1280, height: 1280 },
    adf,
  });

  await page.waitForSelector(selectors.code, { visible: true });
};

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Snapshot Test: Overflow shadows', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  describe('rendered for the elements with overflow content', () => {
    it('initially', async () => {
      await initRenderer(page, document);
      await animationFrame(page);
      await waitForElementCount(page, `.${shadowClassNames.RIGHT_SHADOW}`, 5);
    });

    it('after scolling', async () => {
      await initRenderer(page, document);
      await page.waitForSelector(selectors.extension);
      await animationFrame(page);
      await setScrollPosition(page, selectors.extensionScrollContainer, 100, 0);
      await animationFrame(page);
      // with 2 extensions in the doc - first should be half scrolled
      await waitForElementCount(
        page,
        `${selectors.extension}.${shadowClassNames.RIGHT_SHADOW}`,
        2,
      );
      await waitForElementCount(
        page,
        `${selectors.extension}.${shadowClassNames.LEFT_SHADOW}`,
        1,
      );

      const scrollWidth = await getMaxScrollWidth(
        page,
        selectors.extensionScrollContainer,
      );
      await snapshot(page);
      await setScrollPosition(
        page,
        selectors.extensionScrollContainer,
        scrollWidth,
        0,
      );
      await animationFrame(page);

      // with 2 extensions in the doc - first should be fully scrolled to the right now
      await waitForElementCount(
        page,
        `${selectors.extension}.${shadowClassNames.RIGHT_SHADOW}`,
        1,
      );
      await waitForElementCount(
        page,
        `${selectors.extension}.${shadowClassNames.LEFT_SHADOW}`,
        1,
      );
    });
  });
});
