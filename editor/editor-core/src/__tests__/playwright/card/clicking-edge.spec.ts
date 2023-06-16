import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorInlineCardModel,
  EditorFloatingToolbarModel,
  expect,
} from '@af/editor-libra';
import { inlineCardWithinTableAdf } from './clicking-edge.spec.ts-fixtures/adf';

test.use({
  adf: inlineCardWithinTableAdf,
  editorProps: {
    appearance: 'full-page',
    allowTextAlignment: true,
    allowTables: {
      advanced: true,
    },
    smartLinks: {
      allowBlockCards: true,
      allowEmbeds: true,
    },
  },
});

test.describe('card', () => {
  test('should select when clicking on the edge of the smart link', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardModel,
    );

    await inlineCardModel.waitForStable();

    const boundingBox = await nodes.inlineCard.boundingBox();
    expect(boundingBox).not.toBe(null);

    // click on an edge, similar to what is shown in this DTR: https://product-fabric.atlassian.net/browse/DTR-199
    const targetX = boundingBox!.x + boundingBox!.width / 2;
    const targetY = boundingBox!.y;
    await editor.page.mouse.move(targetX, targetY);
    await editor.page.mouse.click(targetX, targetY);

    await floatingToolbarModel.waitForStable();

    await expect(editor).toHaveSelection({
      anchor: 4,
      type: 'node',
    });
  });
});
