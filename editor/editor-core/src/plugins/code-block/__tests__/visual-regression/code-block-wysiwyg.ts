import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initWysiwygTest } from '@atlaskit/editor-test-helpers/wysiwyg-helpers';
import { minimalCodeBlock } from '../__fixtures__/minimal-code-block';
import { tableHeaderCodeBlock } from '../__fixtures__/table-header-code-block';
import { overflowCodeBlock } from '../__fixtures__/overflow-code-block';
import { tableHeaderOverflowCodeBlock } from '../__fixtures__/table-header-overflow-code-block';
import { tabCodeBlock } from '../__fixtures__/tab-code-block';

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
      threshold: 0.02,
    });
  });

  test('code-block with tabs is WYSIWYG', async () => {
    const { $editorElement, $rendererElement } = await initWysiwygTest(page, {
      adf: tabCodeBlock,
      editorSelector: '.code-block',
      rendererSelector: '.code-block',
    });

    await expect($editorElement).toMatchVisually($rendererElement, {
      threshold: 0.45,
    });
  });

  test('code-block is WYSIWYG when in table header', async () => {
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
      threshold: 0.02,
    });
  });

  test('code-block is WYSIWYG when overflowing in table header', async () => {
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
