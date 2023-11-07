import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { initWysiwygTest } from '@atlaskit/editor-test-helpers/wysiwyg-helpers';
import { tableCode } from '../../__fixtures__/code-block/table-code';
import { basicCode } from '../../__fixtures__/code-block/basic-code';

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

  // FIXME: This test was automatically skipped due to failure on 03/10/2023: https://product-fabric.atlassian.net/browse/ED-20284
  test.skip('code is WYSIWYG when in table header', async () => {
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
