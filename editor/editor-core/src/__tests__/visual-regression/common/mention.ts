import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import {
  getExampleUrl,
  navigateToUrl,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';
import mentionAdf from './__fixtures__/mention-adf.json';
import { mentionSelectors } from '../../__helpers/page-objects/_mention';

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

  it('Should repaint when theme mode changes', async () => {
    const url = getExampleUrl('editor', 'editor-core', 'kitchen-sink');
    await navigateToUrl(page, url, false);
    await page.keyboard.type('@carolyn\n');

    const frames = await page.frames();
    const exampleFrame = frames.find(async (f) => {
      return (await f.title()) === 'example';
    });

    if (exampleFrame != null) {
      const themeSelector = await exampleFrame!.$('.theme-select');
      await themeSelector!.click();
      await page.keyboard.type('dark theme');
      await page.keyboard.press('Enter');
      await snapshot(page);
    }
  });
});
