import React from 'react';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  tdEmpty,
  tdCursor,
  th,
  tr,
  table,
  p,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { shallowWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { EditorView } from 'prosemirror-view';

import ContextualMenu from '../ContextualMenu';
import DropdownMenuWrapper from '../../../../../ui/DropdownMenu';

describe('ContextualMenu', () => {
  const createEditor = createEditorFactory();
  describe('with right table cell position in plugin state', () => {
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

    test('should render contextual menu when no tableCellPosition is passed but exist on editor state ', () => {
      const wrapper = shallowWithIntl(
        <ContextualMenu
          editorView={editorView}
          selectionRect={{ bottom: 0, left: 0, right: 0, top: 0 }}
          isOpen
        />,
      );

      expect(wrapper.find(DropdownMenuWrapper).length).toEqual(1);
    });
  });
});
