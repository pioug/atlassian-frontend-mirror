import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { TableAttributes } from '@atlaskit/adf-schema';
import {
  ACTION_SUBJECT,
  EVENT_TYPE,
  TABLE_ACTION,
} from '@atlaskit/editor-common/analytics';
import { akEditorWideLayoutWidth } from '@atlaskit/editor-shared-styles';
import { findTable } from '@atlaskit/editor-tables/utils';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  DocBuilder,
  p,
  table,
  td,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table-plugin';
import {
  ResizableTableContainer,
  TableContainer,
} from '../../../plugins/table/nodeviews/TableContainer';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import { TablePluginState } from '../../../plugins/table/types';

describe('table -> nodeviews -> TableContainer.tsx', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const editor = (
    doc: DocBuilder,
    featureFlags?: { [featureFlag: string]: string | boolean },
  ) => {
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
  const createNode = (attrs?: TableAttributes) => {
    const { editorView } = editor(
      doc(table(attrs)(tr(td()(p('{<>}text')), tdEmpty, tdEmpty))),
    );
    const resolvedTable = findTable(editorView.state.selection);

    return { table: resolvedTable!.node, editorView };
  };

  describe('show correct table container', () => {
    const buildContainer = (
      isTableResizingEnabled: boolean,
      isBreakoutEnabled: boolean = true,
    ) => {
      const { table, editorView } = createNode();

      const { container } = render(
        <TableContainer
          containerWidth={{
            width: 1800,
            lineLength: 720,
          }}
          node={table}
          isTableResizingEnabled={isTableResizingEnabled}
          isBreakoutEnabled={isBreakoutEnabled}
          className={''}
          editorView={editorView}
          getPos={() => 1}
          tableRef={{} as any}
          isNested={false}
        />,
      );

      return container;
    };

    test('should wrap table in resizer when isTableResizingEnabled is true', () => {
      const container = buildContainer(true);
      expect(!!container.querySelector('.resizer-item')).toBeTruthy();
    });

    test('should not wrap table in resizer when isTableResizingEnabled is false', () => {
      const container = buildContainer(false);
      expect(!!container.querySelector('.resizer-item')).toBeFalsy();
    });
  });

  describe('when table is nested', () => {
    const buildContainer = (
      isTableResizingEnabled: boolean,
      isBreakoutEnabled: boolean = true,
    ) => {
      const { table, editorView } = createNode();

      const { container } = render(
        <TableContainer
          containerWidth={{
            width: 1800,
            lineLength: 720,
          }}
          node={table}
          isTableResizingEnabled={isTableResizingEnabled}
          isBreakoutEnabled={isBreakoutEnabled}
          className={''}
          editorView={editorView}
          getPos={() => 1}
          tableRef={{} as any}
          isNested={true}
        />,
      );

      return container;
    };

    test('should not render resizer when isTableResizingEnabled is true', () => {
      const container = buildContainer(true);
      expect(!!container.querySelector('.resizer-item')).toBeFalsy();
    });

    test('should not render resizer when isTableResizingEnabled is false', () => {
      const container = buildContainer(false);
      expect(!!container.querySelector('.resizer-item')).toBeFalsy();
    });
  });

  describe('sets width and margin correctly for resizable container', () => {
    const buildContainer = (attrs: TableAttributes) => {
      const { table, editorView } = createNode(attrs);

      const { container } = render(
        <ResizableTableContainer
          containerWidth={1800}
          lineLength={720}
          node={table}
          className={''}
          editorView={editorView}
          getPos={() => 1}
          tableRef={{} as any}
        />,
      );

      return container;
    };

    test('when width attribute is not set', () => {
      const container = buildContainer({ layout: 'wide' });

      const style = window.getComputedStyle(container.firstChild as Element);
      expect(style.width).toBe(`${akEditorWideLayoutWidth}px`);
      expect(style.marginLeft).toBe('-120px');
    });
  });

  describe('analytics', () => {
    const buildContainer = (attrs: TableAttributes) => {
      const { table, editorView } = createNode(attrs);
      const analyticsMock = jest.fn();

      const { container } = render(
        <ResizableTableContainer
          containerWidth={1800}
          lineLength={720}
          node={table}
          className={''}
          editorView={editorView}
          getPos={() => 0}
          tableRef={
            {
              querySelector: () => null,
              insertBefore: () => {},
              style: {},
            } as any
          }
          pluginInjectionApi={
            {
              dependencies: {
                analytics: { actions: { attachAnalyticsEvent: analyticsMock } },
              },
            } as any
          }
        />,
      );

      return { container, analyticsMock };
    };

    test('fires when resizing is finished', async () => {
      const { container, analyticsMock } = buildContainer({ layout: 'wide' });

      fireEvent.mouseDown(container.querySelector('.resizer-handle-right')!);
      fireEvent.mouseMove(container.querySelector('.resizer-handle-right')!);
      fireEvent.mouseMove(container.querySelector('.resizer-handle-right')!);
      fireEvent.mouseMove(container.querySelector('.resizer-handle-right')!);
      fireEvent.mouseUp(container.querySelector('.resizer-handle-right')!);

      expect(analyticsMock).toHaveBeenLastCalledWith({
        action: TABLE_ACTION.RESIZED,
        actionSubject: ACTION_SUBJECT.TABLE,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          width: undefined, // Can't get the events right to trigger re-resizeable
          prevWidth: null,
          nodeSize: 20,
          totalTableWidth: null,
          totalRowCount: 1,
          totalColumnCount: 3,
        },
      });
    });
  });
});
