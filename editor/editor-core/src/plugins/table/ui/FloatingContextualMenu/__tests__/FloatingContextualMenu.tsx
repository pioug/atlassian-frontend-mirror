import React from 'react';

import { EditorView } from 'prosemirror-view';

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { shallowWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  doc,
  p,
  table,
  tdCursor,
  tdEmpty,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { getPluginState } from '../../../pm-plugins/plugin-factory';
import FloatingContextualMenu from '../index';

describe('FloatingContextualMenu', () => {
  const createEditor = createEditorFactory();
  describe('with right position in plugin state', () => {
    let editorView: EditorView;
    beforeEach(() => {
      ({ editorView } = createEditor({
        doc: doc(table()(tr(th()(p('')), th()(p(''))), tr(tdCursor, tdEmpty))),
        editorProps: {
          allowTables: {
            advanced: true,
          },
        },
      }));
    });

    test('should render floating contextual menu when no tableCellPosition is passed but exist on editor state ', () => {
      const wrapper = shallowWithIntl(
        <FloatingContextualMenu
          editorView={editorView}
          isOpen={true}
          pluginConfig={getPluginState(editorView.state).pluginConfig}
        />,
      );
      expect(wrapper.find('Popup').length).toEqual(1);
    });
  });
});
