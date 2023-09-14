// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  fragmentMark,
  p,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { findNodePosByFragmentLocalIds } from '../../nodes-by-localIds';

describe('findNodePosByFragmentLocalIds', () => {
  /**
   * Use `createEditorFactory` here when `allowReferentiliaty: true`, as
   * `createProsemirrorEditorFactory` has some issues with correctly mimicking
   * old state for the unique localId plugin
   */
  const createEditorFn = createEditorFactory<{}>();
  const createEditor = (doc: DocBuilder) => {
    const { editorView } = createEditorFn({
      doc,
      editorProps: {
        allowExtension: true,
        allowFragmentMark: true,
        allowTables: true,
        allowLayouts: true,
        allowExpand: true,
      },
    });
    return editorView;
  };

  it('should return empty array when fragment localId is not found', () => {
    const initDoc = doc(
      fragmentMark({ localId: 'fragment-local-id-1' })(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      ),
    );
    const { state } = createEditor(initDoc);
    const result = findNodePosByFragmentLocalIds(state, ['fakeId']);

    expect(result).toEqual([]);
  });

  it('should return NodePos when localId is found', () => {
    const initDoc = doc(
      fragmentMark({ localId: 'fragment-local-id-1' })(
        table({ localId: 'table-id-1' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      ),
      fragmentMark({ localId: 'fragment-local-id-2' })(
        table({ localId: 'table-id-2' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      ),
      fragmentMark({ localId: 'fragment-local-id-3' })(
        table({ localId: 'table-id-3' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      ),
    );
    const { state } = createEditor(initDoc);
    const result = findNodePosByFragmentLocalIds(state, [
      'fragment-local-id-2',
    ]);

    expect(result.length).toBe(1);
    // expect(result[0].pos).toEqual(1);
    expect(result[0].node.type.name).toEqual('table');
    expect(result[0].node.attrs.localId).toEqual('table-id-2');
  });
});
