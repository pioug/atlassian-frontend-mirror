import React from 'react';
import { shallow } from 'enzyme';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  td,
  tdEmpty,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { findTable, selectTable } from '@atlaskit/editor-tables/utils';
import { TableCssClassName as ClassName } from '../../../../../plugins/table/types';
import { TablePluginState } from '../../../../../plugins/table/types';
import TableComponent from '../../../../../plugins/table/nodeviews/TableComponent';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';
import { EventDispatcher } from '../../../../../event-dispatcher';

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

  describe('WITH_CONTROLS css class', () => {
    it.each<[string, object, boolean]>([
      [
        'is added when allowControls is set',
        {
          allowControls: true,
          tableActive: true,
        },
        true,
      ],
      [
        'is added by default when allowControls is not provided',
        {
          tableActive: true,
        },
        true,
      ],
      [
        'is not added when allowControls is false',
        {
          allowControls: false,
          tableActive: true,
        },
        false,
      ],
      [
        'is not added when table is not active',
        {
          allowControls: true,
          tableActive: false,
        },
        false,
      ],
    ])('%s', (_, props, expected) => {
      const { editorView: view } = editor(
        doc(p('text'), table()(tr(td()(p('{<>}text')), tdEmpty, tdEmpty))),
      );

      const tableF = findTable(view.state.selection);
      const getNode = () => tableF!.node;
      const wrapper = shallow(
        <TableComponent
          view={view}
          eventDispatcher={({ on: () => {} } as any) as EventDispatcher}
          // @ts-ignore
          containerWidth={{}}
          // @ts-ignore
          getNode={getNode}
          {...props}
        />,
      );

      expect(wrapper.hasClass(ClassName.WITH_CONTROLS)).toBe(expected);
    });
  });
});
