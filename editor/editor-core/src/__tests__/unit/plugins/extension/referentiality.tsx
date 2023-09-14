// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  dataConsumer,
  doc,
  extension,
  fragmentMark,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';

import { getSelectedExtension } from '../../../../plugins/extension/utils';
import { removeDescendantNodes } from '../../../../plugins/extension/commands';
import { setNodeSelection } from '../../../../utils';

describe('removeConnectedNodes', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) => {
    const instance = createEditor({
      doc,
      editorProps: {
        allowExtension: true,
        allowTables: {
          advanced: true,
        },
        allowFragmentMark: true,
        allowStatus: true,
      },
    });

    return instance;
  };

  it('should delete all related extension', () => {
    const { editorView } = editor(
      doc(
        p('hello'),
        fragmentMark({ localId: 'frag_A1', name: 'Ext A1' })(
          extension({
            localId: 'id_A1',
            extensionType: 'com.atlassian.extensions.extension',
            extensionKey: 'A1',
            parameters: {},
          })(),
        ),
        fragmentMark({ localId: 'frag_B1', name: 'Ext B1' })(
          dataConsumer({ sources: ['frag_A1'] })(
            extension({
              localId: 'id_B1',
              extensionType: 'com.atlassian.extensions.extension',
              extensionKey: 'B1',
              parameters: {},
            })(),
          ),
        ),
        fragmentMark({ localId: 'frag_C1', name: 'Ext C1' })(
          dataConsumer({ sources: ['frag_A1'] })(
            extension({
              localId: 'id_C1',
              extensionType: 'com.atlassian.extensions.extension',
              extensionKey: 'C1',
              parameters: {},
            })(),
          ),
        ),
      ),
    );
    const positionOfDeletingNode = 7;

    setNodeSelection(editorView, positionOfDeletingNode);
    const extensionObj = getSelectedExtension(editorView.state, true);

    removeDescendantNodes(extensionObj?.node)(
      editorView.state,
      editorView.dispatch,
    );
    expect(editorView.state.doc).toEqualDocument(doc(p('hello')));
  });

  it('should NOT delete extension not connected', () => {
    const { editorView } = editor(
      doc(
        p('hello'),
        fragmentMark({ localId: 'frag_A1', name: 'Ext A1' })(
          extension({
            localId: 'id_A1',
            extensionType: 'com.atlassian.extensions.extension',
            extensionKey: 'A1',
            parameters: {},
          })(),
        ),
        fragmentMark({ localId: 'frag_B1', name: 'Ext B1' })(
          extension({
            localId: 'id_B1',
            extensionType: 'com.atlassian.extensions.extension',
            extensionKey: 'B1',
            parameters: {},
          })(),
        ),
        fragmentMark({ localId: 'frag_C1', name: 'Ext C1' })(
          dataConsumer({ sources: ['frag_B1'] })(
            extension({
              localId: 'id_C1',
              extensionType: 'com.atlassian.extensions.extension',
              extensionKey: 'C1',
              parameters: {},
            })(),
          ),
        ),
      ),
    );
    const positionOfDeletingNode = 7;

    setNodeSelection(editorView, positionOfDeletingNode);
    const extensionObj = getSelectedExtension(editorView.state, true);

    removeDescendantNodes(extensionObj?.node)(
      editorView.state,
      editorView.dispatch,
    );

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p('hello'),
        fragmentMark({ localId: 'frag_B1', name: 'Ext B1' })(
          extension({
            localId: 'id_B1',
            extensionType: 'com.atlassian.extensions.extension',
            extensionKey: 'B1',
            parameters: {},
          })(),
        ),
        fragmentMark({ localId: 'frag_C1', name: 'Ext C1' })(
          dataConsumer({ sources: ['frag_B1'] })(
            extension({
              localId: 'id_C1',
              extensionType: 'com.atlassian.extensions.extension',
              extensionKey: 'C1',
              parameters: {},
            })(),
          ),
        ),
      ),
    );
  });
});
