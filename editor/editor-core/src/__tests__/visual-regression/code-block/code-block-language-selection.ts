// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { codeBlockSelectors } from '@atlaskit/editor-test-helpers/page-objects/code-block';
import { basicCodeBlock } from '../../__fixtures__/code-block/basic-code-block';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

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
    await page.click(codeBlockSelectors.floatingToolbar);
    await page.click('input');
    // workaround to 'unfocus' from the current selected option
    await page.type('input', 'z');
    await pressKey(page, 'Backspace');
    await page.type('input', 'c');
    await pressKey(page, ['ArrowDown', 'ArrowDown']); // Go to option "C"
    await pressKey(page, 'Enter');
    await page.click(codeBlockSelectors.floatingToolbar);
    await snapshot(page);
  });
});
