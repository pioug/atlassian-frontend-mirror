import React from 'react';
import { isTableSelected } from '@atlaskit/editor-tables/utils';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  doc,
  table,
  tr,
  thEmpty,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  TablePluginState,
  TableCssClassName as ClassName,
} from '../../../../../plugins/table/types';
import CornerControls from '../../../../../plugins/table/ui/TableFloatingControls/CornerControls';
import {
  getPluginState,
  pluginKey,
} from '../../../../../plugins/table/pm-plugins/plugin-factory';

const CornerButton = `.${ClassName.CONTROLS_CORNER_BUTTON}`;

describe('CornerControls', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
      pluginKey,
    });

  describe('when button is clicked', () => {
    it('should select the table', () => {
      const { editorView } = editor(
        doc(table()(tr(thEmpty, thEmpty, thEmpty))),
      );

      const controls = mountWithIntl(
        <CornerControls
          tableRef={document.querySelector('table')!}
          editorView={editorView}
        />,
      );

      controls.find(CornerButton).simulate('click');

      expect(isTableSelected(editorView.state.selection)).toBe(true);
      controls.unmount();
    });
  });

  describe('when button is hovered', () => {
    it('should highlight the table with hover decoration', () => {
      const { editorView } = editor(
        doc(
          table()(tr(thEmpty, thEmpty, thEmpty), tr(thEmpty, thEmpty, thEmpty)),
        ),
      );

      const controls = mountWithIntl(
        <CornerControls
          tableRef={document.querySelector('table')!}
          editorView={editorView}
        />,
      );

      controls.find(CornerButton).simulate('mouseover');

      const { hoveredColumns, hoveredRows } = getPluginState(editorView.state);
      expect(hoveredColumns).toEqual([0, 1, 2]);
      expect(hoveredRows).toEqual([0, 1]);
      controls.unmount();
    });
  });
});
