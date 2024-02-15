import { expect, editorTestCase as test } from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  code_block,
  doc,
  nestedExpand,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { expandInsideTableAdf } from './extended-nested-expand.spec.ts-fixtures/adf';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: true,
    allowExpand: { allowInsertion: true },
  },
  platformFeatureFlags: {
    'platform.editor.allow-extended-nested-expand': true,
  },
});

test.describe('test extended nested expand', () => {
  test.use({
    adf: expandInsideTableAdf,
  });

  test('should be able to insert code-snippet inside nested expand', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 5, head: 5 });

    await editor.typeAhead.searchAndInsert('code snippet');

    await expect(editor).toMatchDocument(
      doc(
        table()(
          tr(td({})(nestedExpand({ localId: 'test' })(code_block({})()))),
        ),
      ),
    );
  });
});
