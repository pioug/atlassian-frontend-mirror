import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initWysiwygTest } from '../../../../__tests__/__helpers/wysiwyg/init-wysiwyg-test';
import { tableCode } from '../__fixtures__/table-code';
import { basicCode } from '../__fixtures__/basic-code';

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
