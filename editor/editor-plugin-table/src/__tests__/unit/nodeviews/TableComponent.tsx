import React from 'react';
import { replaceRaf } from 'raf-stub';
import { render } from '@testing-library/react';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import tablePlugin from '../../../plugins/table-plugin';
import {
  doc,
  p,
  table,
  tr,
  td,
  tdEmpty,
  tdCursor,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { findTable, selectTable } from '@atlaskit/editor-tables/utils';
import {
  TableCssClassName as ClassName,
  TablePluginState,
} from '../../../plugins/table/types';
import TableComponent from '../../../plugins/table/nodeviews/TableComponent';

import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { toggleNumberColumn } from '../../../plugins/table/commands';

jest.mock('../../../plugins/table/utils/nodes', () =>
  Object.assign({}, jest.requireActual('../../../plugins/table/utils/nodes'), {
    tablesHaveDifferentColumnWidths: jest.fn(),
  }),
);

replaceRaf();
const requestAnimationFrame = window.requestAnimationFrame as any;

describe('table -> nodeviews -> TableComponent.tsx', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const getEditorFeatureFlags = jest.fn();
  const editor = (
    doc: DocBuilder,
    featureFlags?: { [featureFlag: string]: string | boolean },
  ) => {
    getEditorFeatureFlags.mockReturnValue(featureFlags || {});
    return createEditor({
      doc,
      editorProps: {
        allowTables: false,
        dangerouslyAppendPlugins: {
          __plugins: [tablePlugin()],
        },
        featureFlags,
      },
      pluginKey,
    });
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when the table is selected', () => {
    it('should add table selected css class', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdCursor))),
        {
          tableCellOptimization: true,
          tableRenderOptimization: true,
          stickyHeadersOptimization: true,
          initialRenderOptimization: true,
        },
      );
      const { state, dispatch } = editorView;
      dispatch(selectTable(state.tr));
      requestAnimationFrame.step();
      const tableContainer = document.querySelector(
        `.${ClassName.TABLE_CONTAINER}`,
      );
      expect(
        tableContainer!.classList.contains(ClassName.TABLE_SELECTED),
      ).toBeTruthy();
    });
  });

  describe('when the numbered column attribute is changed', () => {
    it('should not resize the columns', () => {
      const { editorView } = editor(
        doc(
          table({ isNumberColumnEnabled: false, layout: 'default' })(
            tr(
              td({ colwidth: [1400] })(p('{<>}')),
              td({ colwidth: [48] })(p()),
              td({ colwidth: [48] })(p()),
            ),
          ),
        ),
      );
      const { state, dispatch } = editorView;
      const tableCell = state.schema.nodes.tableCell;
      const columnWidths: number[][] = [];

      toggleNumberColumn(state, dispatch);
      requestAnimationFrame.step();

      editorView.state.doc.nodesBetween(3, 14, (node) => {
        if (node.type === tableCell) {
          columnWidths.push(node.attrs.colwidth);
        }

        return node.type !== tableCell;
      });

      expect(columnWidths).toEqual([[1400], [48], [48]]);
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
      const { container } = render(
        <TableComponent
          view={view}
          eventDispatcher={
            ({ on: jest.fn(), off: jest.fn() } as unknown) as EventDispatcher
          }
          // @ts-ignore
          containerWidth={{}}
          getNode={getNode}
          contentDOM={(contentElement: HTMLElement | null) => {
            const node = view.dom.getElementsByTagName('table')[0];

            if (!contentElement?.firstChild) {
              contentElement?.appendChild(node);
            }
          }}
          getEditorFeatureFlags={getEditorFeatureFlags}
          {...props}
        />,
      );
      const controlsContainer = container.querySelector(
        `.${ClassName.WITH_CONTROLS}`,
      );
      expect(!!controlsContainer).toBe(expected);
    });
  });
});
