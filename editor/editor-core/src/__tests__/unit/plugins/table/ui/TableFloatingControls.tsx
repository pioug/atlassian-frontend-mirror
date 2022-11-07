import { shallow, mount } from 'enzyme';
import React from 'react';

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  tdEmpty,
  tdCursor,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { TablePluginState } from '@atlaskit/editor-plugin-table/types';
import { hoverTable } from '@atlaskit/editor-plugin-table/commands';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import TableFloatingControls from '@atlaskit/editor-plugin-table/src/plugins/table/ui/TableFloatingControls';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { CornerControls } from '@atlaskit/editor-plugin-table/src/plugins/table/ui/TableFloatingControls/CornerControls';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { RowControls } from '@atlaskit/editor-plugin-table/src/plugins/table/ui/TableFloatingControls/RowControls';
import { pluginKey } from '@atlaskit/editor-plugin-table/plugin-key';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { getDecorations } from '@atlaskit/editor-plugin-table/src/plugins/table/pm-plugins/decorations/plugin';

describe('TableFloatingControls', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const fakeGetEditorFeatureFlags = () => ({});

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
      pluginKey: pluginKey,
    });

  describe('when tableRef is undefined', () => {
    it('should not render table header', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdEmpty))),
      );
      const floatingControls = mount(
        <TableFloatingControls
          editorView={editorView}
          getEditorFeatureFlags={fakeGetEditorFeatureFlags}
        />,
      );
      expect(floatingControls.html()).toEqual(null);
      floatingControls.unmount();
    });
  });

  describe('when tableRef is defined', () => {
    it('should render CornerControls and RowControls', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdEmpty))),
      );
      const floatingControls = shallow(
        <TableFloatingControls
          tableRef={document.querySelector('table')!}
          tableActive={true}
          editorView={editorView}
          getEditorFeatureFlags={fakeGetEditorFeatureFlags}
        />,
      );
      floatingControls.setProps({
        tableElement: document.createElement('table'),
      });
      floatingControls.update();
      expect(floatingControls.find(CornerControls).length).toEqual(1);
      expect(floatingControls.find(RowControls).length).toEqual(1);
    });
  });

  describe('when delete icon is hovered', () => {
    it('should add a node decoration to table nodeView with class="danger"', () => {
      const { editorView } = editor(
        doc(
          p('text'),
          table()(
            tr(tdCursor, tdEmpty),
            tr(tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty),
          ),
        ),
      );
      hoverTable(true)(editorView.state, editorView.dispatch);
      const decorationSet = getDecorations(editorView.state);
      const decoration = decorationSet.find()[0] as any;
      expect(decoration.type.attrs.class.indexOf('danger')).toBeGreaterThan(-1);
    });
  });
});
