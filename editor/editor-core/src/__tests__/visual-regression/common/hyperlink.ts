import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import { selectors } from '../../__helpers/page-objects/_editor';
import {
  waitForFloatingControl,
  retryUntilStablePosition,
} from '../../__helpers/page-objects/_toolbar';
import adf from './__fixtures__/hyperlink-adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

const click = async (page: any, selector: string) => {
  await page.waitForSelector(selector);
  await retryUntilStablePosition(
    page,
    () => page.click(selector),
    '[aria-label*="Hyperlink floating controls"]',
    1000,
  );
};

describe('Hyperlink:', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 800, height: 400 },
    });
  });

  afterEach(async () => {
    await waitForFloatingControl(page, 'Hyperlink floating controls');
    await snapshot(page);
  });

  describe('heading', () => {
    it('should display the link toolbar', async () => {
      await click(page, `${selectors.editor} > h1 > a`);
    });
  });

  describe('paragraph', () => {
    it('should display the link toolbar', async () => {
      await click(page, `${selectors.editor} > p > a`);
    });
  });

  describe('action item', () => {
    it('should display the link toolbar', async () => {
      await click(page, `${selectors.editor} .taskItemView-content-wrap a`);
    });
  });

  describe('decision item', () => {
    it('should display the link toolbar', async () => {
      await click(page, `${selectors.editor} .decisionItemView-content-wrap a`);
    });
  });
});
