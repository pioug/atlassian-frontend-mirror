import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { initWysiwygTest } from '@atlaskit/editor-test-helpers/wysiwyg-helpers';
import { minimalCodeBlock } from '../../__fixtures__/code-block/minimal-code-block';
import { tableHeaderCodeBlock } from '../../__fixtures__/code-block/table-header-code-block';
import { overflowCodeBlock } from '../../__fixtures__/code-block/overflow-code-block';
import { tableHeaderOverflowCodeBlock } from '../../__fixtures__/code-block/table-header-overflow-code-block';
import { tabCodeBlock } from '../../__fixtures__/code-block/tab-code-block';

/**
 * Note: these WYSIWYG tests don't have corresponding LFS image snapshots.
 * Instead, they compare the state of editor & renderer components live.
 * If your test case needs updating, you need to update the threshold value
 * for the specific toMatchVisually call to accomodate your changes.
 * The -u or --updateSnapshot flag won't do that for you.
 *
 * Obviously, we want to strive for as close to 0.0 as possible.
 * Higher numbers mean more visual divergence between editor & renderer which
 * is undesirable.
 */

describe('code-block: WYSIWYG', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  test('code-block is WYSIWYG', async () => {
    const { $editorElement, $rendererElement } = await initWysiwygTest(page, {
      adf: minimalCodeBlock,
      editorSelector: '.code-block',
      rendererSelector: '.code-block',
    });

    await expect($editorElement).toMatchVisually($rendererElement, {
      threshold: 0.03,
    });
  });

  test('code-block with tabs is WYSIWYG', async () => {
    const { $editorElement, $rendererElement } = await initWysiwygTest(page, {
      adf: tabCodeBlock,
      editorSelector: '.code-block',
      rendererSelector: '.code-block',
    });

    await expect($editorElement).toMatchVisually($rendererElement, {
      threshold: 0.47,
    });
  });

  // FIXME: This test was automatically skipped due to failure on 19/06/2023: https://product-fabric.atlassian.net/browse/ED-18872
  test.skip('code-block is WYSIWYG when in table header', async () => {
    const { $editorElement, $rendererElement } = await initWysiwygTest(page, {
      adf: tableHeaderCodeBlock,
      editorSelector: '.code-block',
      rendererSelector: '.code-block',
    });

    await expect($editorElement).toMatchVisually($rendererElement, {
      threshold: 0.03,
    });
  });

  test('code-block is WYSIWYG when overflowing', async () => {
    const { $editorElement, $rendererElement } = await initWysiwygTest(page, {
      adf: overflowCodeBlock,
      editorSelector: '.code-block',
      rendererSelector: '.code-block',
    });

    await expect($editorElement).toMatchVisually($rendererElement, {
      threshold: 0.03,
    });
  });

  // FIXME: This test was automatically skipped due to failure on 21/06/2023: https://product-fabric.atlassian.net/browse/ED-18894
  test.skip('code-block is WYSIWYG when overflowing in table header', async () => {
    const { $editorElement, $rendererElement } = await initWysiwygTest(page, {
      adf: tableHeaderOverflowCodeBlock,
      editorSelector: '.code-block',
      rendererSelector: '.code-block',
    });

    await expect($editorElement).toMatchVisually($rendererElement, {
      threshold: 0.03,
    });
  });
});
