import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  editorSelector,
} from '../../../../__tests__/visual-regression/_utils';
import { pressKey } from '../../../../__tests__/__helpers/page-objects/_keyboard';
import { basicCodeBlock } from '../__fixtures__/basic-code-block';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Code block:', () => {
  let page: PuppeteerPage;

  beforeAll(() => {
    page = global.page;
  });

  it('displays as selected when click on 1', async () => {
    await initEditorWithAdf(page, {
      adf: basicCodeBlock,
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 500 },
    });
    await page.click('[aria-label="CodeBlock floating controls"]');
    await page.click('input');
    await page.type('input', 'c');
    await pressKey(page, ['ArrowDown', 'ArrowDown']); // Go to option "C"
    await pressKey(page, 'Enter');
    await page.click('[aria-label="CodeBlock floating controls"]');
    await snapshot(page, undefined, editorSelector);
  });
});
