import { editorTestCase as test, expect, fixTest } from '@af/editor-libra';

// Height + Padding
const DEFAULT_LIST_HEIGHT = 380;

const DEFAULT_WINDOW_WIDTH = 1300;

const DEFAULT_WINDOW_HEIGHT = 850;

const LESS_THAN_DEFAULT_HEIGHT = 260;

// Edge case height with one line of text
const HEIGHT_BREAKPOINT_WITH_TEXT = 500;

const GREATER_THAN_DEFAULT_HEIGHT = 600;

test.describe('typeahead - at different view sizes', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test('typeahead height should be set to default size on normal desktop screen size', async ({
    editor,
  }) => {
    await editor.page.setViewportSize({
      width: DEFAULT_WINDOW_WIDTH,
      height: DEFAULT_WINDOW_HEIGHT,
    });
    await editor.waitForEditorStable();

    await editor.typeAhead.search('');
    const typeAheadSize = await editor.typeAhead.popup.boundingBox();

    expect(typeAheadSize?.height).toBe(DEFAULT_LIST_HEIGHT);
  });

  test('typeahead height should be less than default when view is smaller than default typeahead height', async ({
    editor,
  }) => {
    await editor.page.setViewportSize({
      width: DEFAULT_WINDOW_WIDTH,
      height: LESS_THAN_DEFAULT_HEIGHT,
    });
    await editor.waitForEditorStable();

    await editor.typeAhead.search('');
    const typeAheadSize = await editor.typeAhead.popup.boundingBox();

    expect(typeAheadSize?.height).toBeLessThan(DEFAULT_LIST_HEIGHT);
  });

  test('typeahead should resize when view size changes', async ({ editor }) => {
    await editor.page.setViewportSize({
      width: DEFAULT_WINDOW_WIDTH,
      height: LESS_THAN_DEFAULT_HEIGHT,
    });
    await editor.waitForEditorStable();

    await editor.typeAhead.search('');
    const typeAheadSizeBefore = await editor.typeAhead.popup.boundingBox();

    await editor.page.setViewportSize({
      width: DEFAULT_WINDOW_WIDTH,
      height: GREATER_THAN_DEFAULT_HEIGHT,
    });
    await editor.waitForEditorStable();

    const typeAheadSizeAfter = await editor.typeAhead.popup.boundingBox();
    expect(typeAheadSizeBefore?.height).toBeLessThan(
      typeAheadSizeAfter?.height || 0,
    );
  });

  test('typeahead should not be clipped on smaller window size', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'UTEST-815',
      reason: 'toBeInViewport is available on PlayWright@1.31.0',
    });
    await editor.page.setViewportSize({
      width: DEFAULT_WINDOW_WIDTH,
      height: LESS_THAN_DEFAULT_HEIGHT,
    });
    await editor.waitForEditorStable();

    await editor.typeAhead.search('');

    //await expect(editor.typeAhead.popup).toBeInViewport();
  });

  test('typeahead should not be clipped on smaller window with text above it', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'UTEST-815',
      reason: 'toBeInViewport is available on PlayWright@1.31.0',
    });

    await editor.page.setViewportSize({
      width: DEFAULT_WINDOW_WIDTH,
      height: HEIGHT_BREAKPOINT_WITH_TEXT,
    });
    await editor.waitForEditorStable();

    await editor.keyboard.type('abc\n');
    await editor.typeAhead.search('');

    //await expect(editor.typeAhead.popup).toBeInViewport();
  });
});
