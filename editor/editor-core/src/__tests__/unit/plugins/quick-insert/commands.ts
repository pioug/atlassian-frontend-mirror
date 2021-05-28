import { Fragment } from 'prosemirror-model';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

import {
  doc,
  bodiedExtension,
  extension,
  p,
  blockquote,
  date,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  openElementBrowserModal,
  closeElementBrowserModal,
  insertItem,
} from '../../../../plugins/quick-insert/commands';
import { selectNode } from '../../../../utils/commands';

import { pluginKey } from '../../../../plugins/quick-insert/plugin-key';
import { datePlugin } from '../../../../plugins';

jest.mock('@atlaskit/adf-schema', () => ({
  ...jest.requireActual<Object>('@atlaskit/adf-schema'),
  uuid: {
    generate: () => 'testId',
  },
}));

describe('Quick Insert Commands', () => {
  const createEditor = createEditorFactory();

  describe('openElementBrowserModal', () => {
    it('should set isElementBrowserModalOpen to true', () => {
      const { editorView } = createEditor({});
      openElementBrowserModal()(editorView.state, editorView.dispatch);

      const quickInsertState = pluginKey.getState(editorView.state);

      expect(quickInsertState.isElementBrowserModalOpen).toBe(true);
    });
  });

  describe('closeElementBrowserModal', () => {
    it('should set isElementBrowserModalOpen to false', () => {
      const { editorView } = createEditor({});
      closeElementBrowserModal()(editorView.state, editorView.dispatch);

      const quickInsertState = pluginKey.getState(editorView.state);

      expect(quickInsertState.isElementBrowserModalOpen).toBe(false);
    });
  });

  describe('insertItem', () => {
    // these tests are adapted from the typeahead plugin
    it('should accept a block node', () => {
      const { editorView } = createEditor({});

      editorView.focus();

      insertItem({
        title: 'Paragraph',
        action: (insert, state) => {
          return insert(
            state.schema.nodes.paragraph.createChecked(
              {},
              state.schema.text('foo'),
            ),
          );
        },
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(doc(p('foo')));
    });

    it('should accept an inline node', () => {
      const { editorView } = createEditor({
        doc: doc(p('foo {<>}bar')),
        editorPlugins: [datePlugin()],
      });

      editorView.focus();

      insertItem({
        title: 'Date',
        action: (insert, state) => {
          return insert(
            state.schema.nodes.date.createChecked({ timestamp: '1' }),
          );
        },
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('foo ', date({ timestamp: '1' }), ' bar')),
      );
    });

    it('should accept text', () => {
      const { editorView } = createEditor({
        editorPlugins: [datePlugin()],
      });

      insertItem({
        title: 'Text',
        action: (insert, state) => {
          return insert('some text');
        },
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(doc(p('some text')));
    });

    it('should accept fragment', () => {
      const { editorView } = createEditor({
        editorPlugins: [datePlugin()],
      });

      insertItem({
        title: 'Text example',
        action: (insert, state) => {
          const fragment = Fragment.fromArray([
            state.schema.text('text one'),
            state.schema.text('  '),
            state.schema.text('text two'),
          ]);
          return insert(fragment);
        },
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('text one  text two')),
      );
    });

    it('should replace an empty paragraph node with insert block node', () => {
      const { editorView } = createEditor({
        doc: doc(p('{<>}')),
      });

      insertItem({
        title: 'Blockquote example',
        action: (insert, state) => {
          return insert(
            state.schema.nodes.blockquote.createChecked(
              {},
              state.schema.nodes.paragraph.createChecked(
                {},
                state.schema.text('quote'),
              ),
            ),
          );
        },
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(doc(blockquote(p('quote'))));
    });

    it('should insert a block node below non-empty node', () => {
      const { editorView } = createEditor({
        doc: doc(p('some text {<>}')),
      });

      insertItem({
        title: 'Blockquote example',
        action: (insert, state) => {
          return insert(
            state.schema.nodes.blockquote.createChecked(
              {},
              state.schema.nodes.paragraph.createChecked(
                {},
                state.schema.text('quote'),
              ),
            ),
          );
        },
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('some text '), blockquote(p('quote'))),
      );
    });

    it('should select inserted inline node when selectInlineNode is specified', () => {
      const { editorView } = createEditor({
        doc: doc(p('{<>}')),
        editorPlugins: [datePlugin()],
      });

      insertItem({
        title: 'Date',
        action: (insert, state) => {
          return insert(
            state.schema.nodes.date.createChecked({ timestamp: '1' }),
            { selectInlineNode: true },
          );
        },
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.selection.from).toEqual(1);
      expect(editorView.state.selection.to).toEqual(2);
    });

    it("should move cursor after inline node+space when selectInlineNode isn't specified", () => {
      const { editorView } = createEditor({
        doc: doc(p('{<>}')),
        editorPlugins: [datePlugin()],
      });

      insertItem({
        title: 'Date',
        action: (insert, state) => {
          return insert(
            state.schema.nodes.date.createChecked({ timestamp: '1' }),
          );
        },
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.selection.from).toEqual(3);
      expect(editorView.state.selection.to).toEqual(3);
    });

    it("should normalise a nodes layout if it's being nested.", () => {
      const { editorView } = createEditor({
        doc: doc(
          bodiedExtension({
            extensionKey: 'fake.extension',
            extensionType: 'atlassian.com.editor',
          })(p('{<>}')),
        ),
        editorProps: {
          allowExtension: true,
        },
      });

      insertItem({
        title: 'Extension example',
        action: (insert, state) => {
          return insert(
            state.schema.nodes.extension.createChecked({
              layout: 'full-width',
              localId: 'testId',
            }),
          );
        },
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          bodiedExtension({
            extensionKey: 'fake.extension',
            extensionType: 'atlassian.com.editor',
            localId: 'testId',
          })(
            extension({
              extensionKey: '',
              extensionType: '',
              layout: 'default',
              localId: 'testId',
            })(),
          ),
        ),
      );
    });

    it('should replace a selected block node', () => {
      const { editorView, refs } = createEditor({
        doc: doc(
          '{extensionStart}',
          bodiedExtension({
            extensionKey: 'fake.extension',
            extensionType: 'atlassian.com.editor',
          })(p()),
        ),
        editorProps: {
          allowExtension: true,
        },
      });

      selectNode(refs['extensionStart'])(editorView.state, editorView.dispatch);
      editorView.focus();

      insertItem({
        title: 'Another fake extension',
        action: (insert, state) => {
          return insert(
            state.schema.nodes.extension.createChecked({
              extensionKey: 'fake.extension.two',
              extensionType: 'atlassian.com.editor',
              localId: 'testId',
            }),
          );
        },
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          extension({
            extensionKey: 'fake.extension.two',
            extensionType: 'atlassian.com.editor',
            localId: 'testId',
          })(),
        ),
      );
    });

    it('should not replace bodied extension when selection is inside', () => {
      const { editorView } = createEditor({
        doc: doc(
          bodiedExtension({
            extensionKey: 'fake.extension',
            extensionType: 'atlassian.com.editor',
          })(p('{<>}')),
        ),
        editorProps: {
          allowExtension: true,
        },
      });

      editorView.focus();

      insertItem({
        title: 'Another fake extension',
        action: (insert, state) => {
          return insert(
            state.schema.nodes.extension.createChecked({
              extensionKey: 'fake.extension.two',
              extensionType: 'atlassian.com.editor',
              localId: 'testId',
            }),
          );
        },
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          bodiedExtension({
            extensionKey: 'fake.extension',
            extensionType: 'atlassian.com.editor',
            localId: 'testId',
          })(
            extension({
              extensionKey: 'fake.extension.two',
              extensionType: 'atlassian.com.editor',
              localId: 'testId',
            })(),
          ),
        ),
      );
    });
  });
});
