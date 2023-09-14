import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorExpandModel,
  EditorFloatingToolbarModel,
  expect,
} from '@af/editor-libra';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  p,
  nestedExpand,
  doc,
  table,
  tr,
  thEmpty,
  td,
  tdEmpty,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { simpleTableWithExpandInCell } from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
    allowExpand: true,
    featureFlags: {
      floatingToolbarCopyButton: true,
    },
  },

  adf: simpleTableWithExpandInCell,
});

test.describe('when copy and paste expands in the same cell', () => {
  test('cursor pos should be in the same cell after paste', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const expandModel = EditorExpandModel.from(nodes.expand);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      expandModel,
    );

    // copy expand
    await expandModel.click();
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.copy();

    // paste it after the existing expand
    await editor.selection.set({ anchor: 21, head: 21 });
    await editor.paste();
    const expectedExpand = nestedExpand({})(p(''));
    const expectedTable = doc(
      table()(
        tr(thEmpty, thEmpty, thEmpty),
        tr(td({})(expectedExpand, expectedExpand), tdEmpty, tdEmpty),
        tr(tdEmpty, tdEmpty, tdEmpty),
      ),
    );

    // 2 expands should be in the same cell
    await expect(editor).toMatchDocument(expectedTable);

    // cusor selection should be right after the pasted expand, in the same cell
    await expect(editor).toHaveSelection({
      pos: 25,
      side: 'right',
      type: 'gapcursor',
    });
  });
});
