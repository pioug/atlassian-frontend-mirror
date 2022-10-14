import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { isTableSelected } from '@atlaskit/editor-tables/utils';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  tr,
  thEmpty,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { TablePluginState } from '../../../plugins/table/types';
import { CornerControls } from '../../../plugins/table/ui/TableFloatingControls/CornerControls';
import { getPluginState } from '../../../plugins/table/pm-plugins/plugin-factory';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import tablePlugin from '../../../plugins/table-plugin';

describe('CornerControls', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: {
        allowTables: false,
        dangerouslyAppendPlugins: { __plugins: [tablePlugin()] },
      },
      pluginKey,
    });

  describe('when button is clicked', () => {
    it('should select the table', () => {
      const { editorView } = editor(
        doc(table()(tr(thEmpty, thEmpty, thEmpty))),
      );

      const ref = editorView.dom.querySelector('table') || undefined;

      render(
        <IntlProvider locale="en">
          <CornerControls tableRef={ref} editorView={editorView} />
        </IntlProvider>,
      );

      const cornerControl = screen.getByLabelText('Highlight table');

      fireEvent.click(cornerControl);

      expect(isTableSelected(editorView.state.selection)).toBe(true);
    });
  });

  describe('when button is hovered', () => {
    it('should highlight the table with hover decoration', () => {
      const { editorView } = editor(
        doc(
          table()(tr(thEmpty, thEmpty, thEmpty), tr(thEmpty, thEmpty, thEmpty)),
        ),
      );

      const ref = editorView.dom.querySelector('table') || undefined;

      render(
        <IntlProvider locale="en">
          <CornerControls tableRef={ref} editorView={editorView} />
        </IntlProvider>,
      );

      const cornerControl = screen.getByLabelText('Highlight table');

      fireEvent.mouseOver(cornerControl);

      const { hoveredColumns, hoveredRows } = getPluginState(editorView.state);
      expect(hoveredColumns).toEqual([0, 1, 2]);
      expect(hoveredRows).toEqual([0, 1]);
    });
  });
});
