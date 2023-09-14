import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import {
  findParentNodeOfType,
  findSelectedNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
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

import type { DocBuilder } from '../../types';
import { setNodeSelection } from '../index';
import {
  getChildrenInfo,
  getConnections,
  removeConnectedNodes,
} from '../referentiality';

export const getSelectedExtension = (
  state: EditorState,
  searchParent: boolean = false,
) => {
  const { inlineExtension, extension, bodiedExtension } = state.schema.nodes;
  const nodeTypes = [extension, bodiedExtension, inlineExtension];
  return (
    findSelectedNodeOfType(nodeTypes)(state.selection) ||
    (searchParent && findParentNodeOfType(nodeTypes)(state.selection)) ||
    undefined
  );
};

describe('Referentiality API', () => {
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

  describe('name of extension', () => {
    it('should be NULL when name does not exist on fragment mark', () => {
      const { editorView } = editor(
        doc(
          fragmentMark({ localId: 'frag_A1' })(
            extension({
              localId: 'id_A1',
              extensionType: 'com.atlassian.extensions.extension',
              extensionKey: 'A1',
              parameters: {},
            })(),
          ),
        ),
      );

      expect(getConnections(editorView.state)['frag_A1'].name).toEqual(null);
    });
  });

  describe('getChildrenInfo ', () => {
    it('should return chilren array if all children had name', () => {
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
      const expectedResult = getChildrenInfo(
        editorView.state,
        extensionObj?.node,
      );
      expect(expectedResult).toBeInstanceOf(Array);
      expect(expectedResult).toHaveLength(2);
    });

    it('getChildrenInfo should return empty array if any child does not have a name', () => {
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
          fragmentMark({ localId: 'frag_B1' })(
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
      const expectedResult = getChildrenInfo(
        editorView.state,
        extensionObj?.node,
      );
      expect(expectedResult).toBeInstanceOf(Array);
      expect(expectedResult).toHaveLength(0);
    });
  });

  describe('removeConnectedNodes', () => {
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

      editorView.dispatch(
        removeConnectedNodes(editorView.state, extensionObj?.node),
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

      editorView.dispatch(
        removeConnectedNodes(editorView.state, extensionObj?.node),
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
});
