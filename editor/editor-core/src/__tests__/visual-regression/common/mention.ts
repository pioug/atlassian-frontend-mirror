import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';
import mentionAdf from './__fixtures__/mention-adf.json';
import { mentionSelectors } from '@atlaskit/editor-test-helpers/page-objects/mention';

describe('Mention', () => {
  let page: PuppeteerPage;

  beforeAll(() => {
    page = global.page;
  });

  it('displays as selected when clicked on', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: mentionAdf,
      viewport: { width: 300, height: 150 },
    });

    await page.click(mentionSelectors.mention);
    await snapshot(page);
  });

  // FIXME: This test was automatically skipped due to failure on 28/01/2023: https://product-fabric.atlassian.net/browse/ED-16673
  it.skip('Should repaint when theme mode changes', async () => {
    const url = getExampleUrl('editor', 'editor-core', 'kitchen-sink');

    const { page } = global;
    await loadPage(page, url);

    await page.keyboard.type('@carolyn\n');

    const selector = '.theme-select';
    await page.waitForSelector(selector);
    await page.click(selector);

    await page.keyboard.type('dark theme');
    await page.keyboard.press('Enter');

    await snapshot(page);
  });
});
