import {
  EditorFloatingToolbarModel,
  EditorPasteModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
import type { EditorPageInterface } from '@af/editor-libra';

import { multiLineParagraph } from './__fixtures__/adf-document';

const testText = '*Italic*, **bold**, and `monospace`';

test.describe('Paste toolbar position', () => {
  test.describe('Pasting in a new paragraph', () => {
    test.use({
      platformFeatureFlags: {
        'platform.editor.paste-options-toolbar': true,
      },
    });
    test(`toolbar should be placed on the right side of pasted text`, async ({
      editor,
    }) => {
      await editor.simulatePasteEvent({
        pasteAs: 'text/plain',
        text: testText,
      });

      const { toolbarRect, pasteContainer, expectedXDiff, expectedYDiff } =
        await getToolbarCoords(editor);

      expect(
        (toolbarRect?.x || 0) -
          ((pasteContainer?.x || 0) + (pasteContainer?.width || 0)),
      ).toBeLessThan(expectedXDiff);
      expect(
        (toolbarRect?.y || 0) -
          ((pasteContainer?.y || 0) + (pasteContainer?.height || 0)),
      ).toBeLessThan(expectedYDiff);
    });
  });

  test.describe('pasting in a multiline paragraph', () => {
    test.use({
      adf: multiLineParagraph,
      platformFeatureFlags: {
        'platform.editor.paste-options-toolbar': true,
      },
    });
    test(`toolbar should align with the pasted text in a multiline paragraph`, async ({
      editor,
    }) => {
      editor.selection.set({ anchor: 13, head: 13 });
      await editor.simulatePasteEvent({
        pasteAs: 'text/plain',
        text: testText,
      });
      const { toolbarRect, pasteContainer, expectedXDiff, expectedYDiff } =
        await getToolbarCoords(editor);

      expect(
        (toolbarRect?.x || 0) -
          ((pasteContainer?.x || 0) + (pasteContainer?.width || 0)),
      ).toBeLessThan(expectedXDiff);
      expect(
        (toolbarRect?.y || 0) -
          ((pasteContainer?.y || 0) + (pasteContainer?.height || 0)),
      ).toBeLessThan(expectedYDiff);
    });
  });
});

const getToolbarCoords = async (editor: EditorPageInterface) => {
  const editorPasteModel = EditorPasteModel.from(editor);
  const floatingToolbarModel = EditorFloatingToolbarModel.from(
    editor,
    editorPasteModel,
  );

  await floatingToolbarModel.waitForStable();

  const toolbarRect = await floatingToolbarModel.toolbar.boundingBox();
  const pasteContainer = await editor.page.locator('.code').boundingBox();
  const expectedXDiff = 10;
  const expectedYDiff = 10;
  return { toolbarRect, pasteContainer, expectedXDiff, expectedYDiff };
};
