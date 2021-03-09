import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initWysiwygTest } from '../../../../__tests__/__helpers/wysiwyg/init-wysiwyg-test';
import { minimalCodeBlock } from '../__fixtures__/minimal-code-block';
import { tableHeaderCodeBlock } from '../__fixtures__/table-header-code-block';
import { overflowCodeBlock } from '../__fixtures__/overflow-code-block';
import { tableHeaderOverflowCodeBlock } from '../__fixtures__/table-header-overflow-code-block';
import { tabCodeBlock } from '../__fixtures__/tab-code-block';
import { highlightingCodeBlock } from '../__fixtures__/highlighting-code-block';

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

  test('code-block is WYSIWYG when highlighting', async () => {
    const { $editorElement, $rendererElement } = await initWysiwygTest(page, {
      adf: highlightingCodeBlock,
      editorSelector: '.code-block',
      rendererSelector: '.code-block',
      editorProps: {
        featureFlags: {
          'code-block-syntax-highlighting': true,
        },
      },
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
      threshold: 0.02,
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
