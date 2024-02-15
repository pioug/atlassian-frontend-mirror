// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { initWysiwygTest } from '@atlaskit/editor-test-helpers/wysiwyg-helpers';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import { basicCode } from '../../__fixtures__/code-block/basic-code';
import { tableCode } from '../../__fixtures__/code-block/table-code';

describe('code: WYSIWYG', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  test('code is WYSIWYG', async () => {
    const { $editorElement, $rendererElement } = await initWysiwygTest(page, {
      adf: basicCode,
      editorSelector: '.code',
      rendererSelector: '.code',
    });

    await expect($editorElement).toMatchVisually($rendererElement, {
      threshold: 0.02,
    });
  });

  test('code is WYSIWYG when in table header', async () => {
    const { $editorElement, $rendererElement } = await initWysiwygTest(page, {
      adf: tableCode,
      editorSelector: '.code',
      rendererSelector: '.code',
    });

    await expect($editorElement).toMatchVisually($rendererElement, {
      threshold: 0.02,
    });
  });
});
