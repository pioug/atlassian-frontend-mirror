import React from 'react';
import { replaceRaf } from 'raf-stub';
import { TextSelection } from 'prosemirror-state';

import { Command } from '@atlaskit/editor-common/types';
import { render } from '@testing-library/react';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { selectTableClosestToPos } from '@atlaskit/editor-tables/src/utils/select-nodes';
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
  thEmpty,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  findTable,
  findTableClosestToPos,
  selectTable,
} from '@atlaskit/editor-tables/utils';
import {
  TableCssClassName as ClassName,
  TablePluginState,
} from '../../../plugins/table/types';
import TableComponent from '../../../plugins/table/nodeviews/TableComponent';

import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import * as commands from '../../../plugins/table/commands';
import {
  toggleNumberColumn,
  hoverTable,
} from '../../../plugins/table/commands';

jest.mock('../../../plugins/table/utils/nodes', () =>
  Object.assign({}, jest.requireActual('../../../plugins/table/utils/nodes'), {
    tablesHaveDifferentColumnWidths: jest.fn(),
  }),
);

jest.mock('../../../plugins/table/commands', () =>
  Object.assign({}, jest.requireActual('../../../plugins/table/commands'), {
    clearHoverSelection: jest.fn(),
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

  describe('when a table is selected', () => {
    it('should add table selected css class to the selected table', () => {
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

    it('should not clear the editor state hover selection when changing selection to another table', () => {
      const clearHoverSelectionSpy = jest
        .spyOn(commands, 'clearHoverSelection')
        .mockImplementation(() => (() => {}) as any as Command);

      const { editorView } = editor(
        doc(
          p('text'),
          table()(tr(thEmpty, thEmpty, thEmpty)),
          table()(tr(thEmpty, thEmpty, thEmpty)),
        ),
      );
      const { state, dispatch } = editorView;

      const isInDanger = true;
      hoverTable(isInDanger)(state, dispatch);

      const selectSecondTableTr = selectTableClosestToPos(
        state.tr,
        state.doc.resolve(26),
      );
      dispatch(selectSecondTableTr);
      const secondTable = findTableClosestToPos(state.doc.resolve(26));

      const selectFirstTableTr = selectTableClosestToPos(
        state.tr,
        state.doc.resolve(8),
      );
      dispatch(selectFirstTableTr);
      const firstTable = findTableClosestToPos(state.doc.resolve(8));

      const getTableNode = (index: number) => () =>
        index === 1 ? firstTable!.node : secondTable!.node;

      render(
        <div>
          <TableComponent
            view={editorView}
            eventDispatcher={
              { on: () => {}, off: () => {} } as any as EventDispatcher
            }
            // @ts-ignore
            containerWidth={{}}
            // @ts-ignore
            getNode={getTableNode(1)}
            getEditorFeatureFlags={getEditorFeatureFlags}
            allowControls
            contentDOM={(wrapper: HTMLElement | null) => {
              const node = editorView.dom.getElementsByTagName('table')[0];
              if (!wrapper?.firstChild) {
                wrapper?.appendChild(node);
              }
            }}
            getPos={jest.fn()}
          />
          <TableComponent
            view={editorView}
            eventDispatcher={
              { on: () => {}, off: () => {} } as any as EventDispatcher
            }
            // @ts-ignore
            containerWidth={{}}
            // @ts-ignore
            getNode={getTableNode(2)}
            getEditorFeatureFlags={getEditorFeatureFlags}
            allowControls
            contentDOM={(wrapper: HTMLElement | null) => {
              const node = editorView.dom.getElementsByTagName('table')[0];
              if (!wrapper?.firstChild) {
                wrapper?.appendChild(node);
              }
            }}
            getPos={jest.fn()}
          />
          ,
        </div>,
      );
      expect(clearHoverSelectionSpy).not.toBeCalled();
    });
  });

  describe('when there are no tables in selection', () => {
    it('clears the editor state hover selection if the editor state is in danger flag is set', () => {
      const clearHoverSelectionSpy = jest
        .spyOn(commands, 'clearHoverSelection')
        .mockImplementation(() => (() => {}) as any as Command);

      const { editorView } = editor(
        doc(p('text'), table()(tr(thEmpty, thEmpty, thEmpty))),
      );
      const { state, dispatch } = editorView;

      const isInDanger = true;
      hoverTable(isInDanger)(state, dispatch);
      dispatch(selectTable(state.tr));

      const tableF = findTable(state.selection);
      const getNode = () => tableF!.node;

      const newTr = state.tr.setSelection(TextSelection.create(state.doc, 0));
      dispatch(newTr);

      render(
        <TableComponent
          view={editorView}
          eventDispatcher={
            { on: () => {}, off: () => {} } as any as EventDispatcher
          }
          // @ts-ignore
          containerWidth={{}}
          // @ts-ignore
          getNode={getNode}
          getEditorFeatureFlags={getEditorFeatureFlags}
          allowControls
          contentDOM={(wrapper: HTMLElement | null) => {
            const node = editorView.dom.getElementsByTagName('table')[0];
            if (!wrapper?.firstChild) {
              wrapper?.appendChild(node);
            }
          }}
          getPos={jest.fn()}
        />,
      );
      expect(clearHoverSelectionSpy).toBeCalledTimes(1);
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
            { on: jest.fn(), off: jest.fn() } as unknown as EventDispatcher
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
          getPos={jest.fn()}
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
