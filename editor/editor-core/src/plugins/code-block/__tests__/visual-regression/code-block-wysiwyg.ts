import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initWysiwygTest } from '../../../../__tests__/__helpers/wysiwyg/init-wysiwyg-test';
import { minimalCodeBlock } from './__fixtures__/minimal-code-block';

describe('code-block: WYSIWYG', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  // Expected to fail via https://product-fabric.atlassian.net/browse/ED-10441
  test.skip('code-block is visually equivalent in editor and renderer', async () => {
    const { $editorElement, $rendererElement } = await initWysiwygTest(page, {
      adf: minimalCodeBlock,
      editorSelector: '.code-block',
      rendererSelector: '.clode-block',
    });

    await expect($editorElement).toMatchVisually($rendererElement);
  });
});
