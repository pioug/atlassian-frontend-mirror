import {
  doc,
  DocBuilder,
  p,
  table,
  tr,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { ExtensionAPI } from '@atlaskit/editor-common/extensions';

import { EditorView } from 'prosemirror-view';
import {
  createExtensionAPI,
  findNodePosWithLocalId,
} from '../../extension-api';

const ParagraphADF = {
  type: 'paragraph',
  content: [{ type: 'text', text: 'hello API!' }],
};

describe('ExtensionAPI', () => {
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
        allowReferentiality: true,
        allowExtension: true,
        allowTables: true,
        allowLayouts: true,
        allowExpand: true,
      },
    });
    return editorView;
  };

  const createAPI = (editorView: EditorView): ExtensionAPI => {
    return createExtensionAPI({ editorView });
  };

  // TODO: api.editInContextPanel
  // TODO: api._editInLegacyMacroBrowser ?

  describe('doc.insertAfter()', () => {
    it('should insert ADF content after the given localId', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      );
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);

      api.doc.insertAfter('tableId', ParagraphADF);

      expect(editorView.state).toEqualDocumentAndSelection(
        doc(
          table({ localId: 'tableId' })(
            tr(td({})(p()), td({})(p()), td({})(p())),
          ),
          p('hello API!'),
        ),
      );
    });

    it('should throw error when localId type is mismatched', () => {
      const initDoc = doc(p('hello'));
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);

      expect(() => {
        api.doc.insertAfter(
          // @ts-ignore
          {},
          ParagraphADF,
        );
      }).toThrowError("insertAfter(): Invalid localId '[object Object]'.");
    });

    it('should throw error when localId type is empty string', () => {
      const initDoc = doc(p(''));
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);

      expect(() => {
        api.doc.insertAfter('', ParagraphADF);
      }).toThrowError("insertAfter(): Invalid localId ''.");
    });

    it('should throw error when adf type is mismatched', () => {
      const initDoc = doc(p(''));
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);

      expect(() => {
        // @ts-ignore
        api.doc.insertAfter('tableId', []);
      }).toThrowError('insertAfter(): Invalid ADF given.');
    });

    it('should throw error when invalid localId is given', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
        p('hello API!'),
      );
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);
      expect(() => {
        api.doc.insertAfter('fakeId', ParagraphADF);
      }).toThrowError("insertAfter(): Could not find node with ID 'fakeId'.");
    });

    it('should throw error when invalid adf.type specified', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      );
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);

      expect(() => {
        api.doc.insertAfter('tableId', {
          type: '😑',
          content: [{ type: 'text', text: 'hello API!' }],
        });
      }).toThrowError("insertAfter(): Invalid ADF type '😑'.");
    });

    it('should throw error when invalid adf is given', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
        p('hello API!'),
      );
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);

      expect(() => {
        const badContentsADF = {
          type: 'paragraph',
          content: [{ type: 'text', donut: 'hello API!' }],
        };
        api.doc.insertAfter('tableId', badContentsADF);
      }).toThrowError('Invalid text node in JSON');
    });

    it('should throw error when invalid marks given', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      );
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);
      expect(() => {
        const badMarksADF = {
          type: 'paragraph',
          content: [{ type: 'text', text: 'hello API!' }],
          marks: [{ type: 'lololol' }],
        };
        api.doc.insertAfter('tableId', badMarksADF);
      }).toThrowError('There is no mark type lololol in this schema');
    });

    // TODO: find a way to test this
    // it('should throw error when node created but doc in invalid state', () => {
    //   const initDoc = doc(
    //     table({ localId: 'tableId' })(tr(td()(p()), td({})(p()), td({})(p()))),
    //   );
    //   const editorView = createEditor(initDoc);
    //   const api = createAPI(editorView);

    //   expect(() => {
    //     api.doc.insertAfter('tableId', {
    //       type: 'doc',
    //       content: [
    //         {
    //           type: 'paragraph',
    //         },
    //       ],
    //     });
    //   }).toThrowError(
    //     'insertAfter(): The given ADFEntity cannot not be inserted in the current position.',
    //   );
    // });
  });
});

describe('findNodePosWithLocalId', () => {
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
        allowReferentiality: true,
        allowExtension: true,
        allowTables: true,
        allowLayouts: true,
        allowExpand: true,
      },
    });
    return editorView;
  };

  it('should return undefined when localId is not found', () => {
    const initDoc = doc(
      table({ localId: 'tableId' })(tr(td({})(p()), td({})(p()), td({})(p()))),
    );
    const { state } = createEditor(initDoc);
    const result = findNodePosWithLocalId(state, 'fakeId');

    expect(result).toBeUndefined();
  });

  it('should return NodePos when localId is found', () => {
    const initDoc = doc(
      table({ localId: 'tableId' })(tr(td({})(p()), td({})(p()), td({})(p()))),
    );
    const { state } = createEditor(initDoc);
    const result = findNodePosWithLocalId(state, 'tableId');

    expect(result).not.toBeUndefined();
    expect(result!.pos).toEqual(0);
    expect(result!.node.type.name).toEqual('table');
  });
});
