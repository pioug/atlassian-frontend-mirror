import React from 'react';
import { shallow } from 'enzyme';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  td,
  tdEmpty,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { selectTable } from 'prosemirror-utils';
import { TableCssClassName as ClassName } from '../../../../../plugins/table/types';
import { TablePluginState } from '../../../../../plugins/table/types';
import TableComponent from '../../../../../plugins/table/nodeviews/TableComponent';
import { findTable } from 'prosemirror-utils';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';

describe('table -> nodeviews -> TableComponent.tsx', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        allowTables: { advanced: true },
      },
      pluginKey,
    });

  describe('when the table is selected', () => {
    it('should add table selected css class', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdEmpty))),
      );
      const { state, dispatch } = editorView;
      dispatch(selectTable(state.tr));

      const tableContainer = document.querySelector(
        `.${ClassName.TABLE_CONTAINER}`,
      );
      expect(
        tableContainer!.classList.contains(ClassName.TABLE_SELECTED),
      ).toBeTruthy();
    });
  });

  describe('when allowControls is false', () => {
    it('should not add WITH_CONTROLS css class', () => {
      const { editorView: view } = editor(
        doc(p('text'), table()(tr(td()(p('{<>}text')), tdEmpty, tdEmpty))),
      );

      const tableF = findTable(view.state.selection);

      const wrapper = shallow(
        <TableComponent
          view={view}
          // @ts-ignore
          containerWidth={{}}
          // @ts-ignore
          pluginState={{
            pluginConfig: {
              allowControls: false,
            },
          }}
          node={tableF!.node}
        />,
      );

      expect(wrapper.hasClass(ClassName.WITH_CONTROLS)).toBeFalsy();
    });
  });

  describe('when allowControls is true', () => {
    it('should add WITH_CONTROLS css class', () => {
      const { editorView: view } = editor(
        doc(p('text'), table()(tr(td()(p('{<>}text')), tdEmpty, tdEmpty))),
      );

      const tableF = findTable(view.state.selection);

      const wrapper = shallow(
        <TableComponent
          view={view}
          // @ts-ignore
          containerWidth={{}}
          // @ts-ignore
          pluginState={{
            pluginConfig: {
              allowControls: true,
            },
          }}
          node={tableF!.node}
        />,
      );

      expect(wrapper.hasClass(ClassName.WITH_CONTROLS)).toBeTruthy();
    });
  });
});
