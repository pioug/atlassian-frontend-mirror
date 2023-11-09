import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import type { TableAttributes } from '@atlaskit/adf-schema';
import {
  ACTION_SUBJECT,
  EVENT_TYPE,
  TABLE_ACTION,
} from '@atlaskit/editor-common/analytics';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { akEditorWideLayoutWidth } from '@atlaskit/editor-shared-styles';
import { findTable } from '@atlaskit/editor-tables/utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  table,
  td,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  ResizableTableContainer,
  TableContainer,
} from '../../../plugins/table/nodeviews/TableContainer';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import { pluginKey as tableResizingPluginKey } from '../../../plugins/table/pm-plugins/table-width';
import type { TablePluginState } from '../../../plugins/table/types';
import tablePlugin from '../../../plugins/table-plugin';

const mockStartMeasure = jest.fn();
const mockEndMeasure = jest.fn(() => {
  return [51, 52, 53, 54];
});
const mockCountFrames = jest.fn();

jest.mock('../../../plugins/table/utils/analytics', () => ({
  ...jest.requireActual('../../../plugins/table/utils/analytics'),
  useMeasureFramerate: () => {
    return {
      startMeasure: mockStartMeasure,
      endMeasure: mockEndMeasure,
      countFrames: mockCountFrames,
    };
  },
}));

jest.mock('react-intl-next', () => {
  return {
    ...(jest.requireActual('react-intl-next') as any),
    useIntl: jest.fn().mockReturnValue({
      formatMessage: (descriptor: any) => descriptor.defaultMessage,
    }),
  };
});

describe('table -> nodeviews -> TableContainer.tsx', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const editor = (
    doc: DocBuilder,
    featureFlags?: { [featureFlag: string]: string | boolean },
  ) => {
    return createEditor({
      doc,
      editorProps: {
        appearance: 'full-page',
        allowTables: false,
        dangerouslyAppendPlugins: {
          __plugins: [
            tablePlugin({
              config: { tableResizingEnabled: true, tableOptions: {} },
            }),
          ],
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
              analytics: { actions: { attachAnalyticsEvent: analyticsMock } },
            } as any
          }
        />,
      );

      return { container, analyticsMock };
    };

    test('fires when resizing is finished', async () => {
      const { container, analyticsMock } = buildContainer({ layout: 'wide' });

      fireEvent.mouseDown(container.querySelector('.resizer-handle.right')!);
      fireEvent.mouseMove(container.querySelector('.resizer-handle.right')!);
      fireEvent.mouseMove(container.querySelector('.resizer-handle.right')!);
      fireEvent.mouseMove(container.querySelector('.resizer-handle.right')!);
      fireEvent.mouseUp(container.querySelector('.resizer-handle.right')!);

      expect(analyticsMock).toHaveBeenNthCalledWith(1, {
        action: TABLE_ACTION.RESIZE_PERF_SAMPLING,
        actionSubject: ACTION_SUBJECT.TABLE,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          docSize: 22,
          frameRate: 51,
          isInitialSample: true,
          nodeSize: 20,
        },
      });

      expect(analyticsMock).toHaveBeenNthCalledWith(2, {
        action: TABLE_ACTION.RESIZE_PERF_SAMPLING,
        actionSubject: ACTION_SUBJECT.TABLE,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          docSize: 22,
          frameRate: 53,
          isInitialSample: false,
          nodeSize: 20,
        },
      });

      expect(analyticsMock).toHaveBeenNthCalledWith(3, {
        action: TABLE_ACTION.RESIZED,
        actionSubject: ACTION_SUBJECT.TABLE,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          newWidth: 0, // Can't get the events right to trigger re-resizeable
          prevWidth: 960,
          nodeSize: 20,
          totalTableWidth: null,
          totalRowCount: 1,
          totalColumnCount: 3,
        },
      });

      analyticsMock.mockReset();
    });

    test('calls useMeasureFramerate handlers', async () => {
      const { container } = buildContainer({ layout: 'wide' });

      fireEvent.mouseDown(container.querySelector('.resizer-handle.right')!);
      fireEvent.mouseMove(container.querySelector('.resizer-handle.right')!, {
        clientX: 100,
      });
      fireEvent.mouseUp(container.querySelector('.resizer-handle.right')!);

      expect(mockStartMeasure).toHaveBeenCalled();
      expect(mockEndMeasure).toHaveBeenCalled();
    });
  });

  describe('selection', () => {
    const selectionActionMock = jest.fn().mockReturnValue(() => {});

    const buildContainer = (attrs: TableAttributes) => {
      const { table, editorView } = createNode(attrs);

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
              selection: {
                commands: { displayGapCursor: selectionActionMock },
              },
              // mock core so the selection command will execute
              core: { actions: { execute: jest.fn() } },
            } as any
          }
        />,
      );

      return { container, selectionActionMock };
    };

    afterEach(() => {
      selectionActionMock.mockRestore();
    });

    it('fires selection action to hide gap cursor when present', () => {
      const { container, selectionActionMock } = buildContainer({
        layout: 'wide',
      });

      fireEvent.mouseDown(container.querySelector('.resizer-handle.right')!);
      fireEvent.mouseMove(container.querySelector('.resizer-handle.right')!);
      fireEvent.mouseMove(container.querySelector('.resizer-handle.right')!);
      fireEvent.mouseMove(container.querySelector('.resizer-handle.right')!);
      fireEvent.mouseUp(container.querySelector('.resizer-handle.right')!);

      // when resize starts - call to hide gap cursor
      expect(selectionActionMock).toHaveBeenNthCalledWith(1, false);
      // when resize finishes - call to display gap cursor
      expect(selectionActionMock).toHaveBeenNthCalledWith(2, true);
    });
  });

  describe('deletion', () => {
    const selectionActionMock = jest.fn().mockReturnValue(() => {});
    const actualGuidelineMock = jest.fn();
    const guidelineActionMock = jest.fn().mockReturnValue(actualGuidelineMock);
    const buildContainer = (attrs: TableAttributes) => {
      const { table, editorView } = createNode(attrs);

      const { container, unmount } = render(
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
              selection: {
                commands: { displayGapCursor: selectionActionMock },
              },
              guideline: {
                actions: { displayGuideline: guidelineActionMock },
              },
              // mock core so the selection command will execute
              core: { actions: { execute: jest.fn() } },
            } as any
          }
        />,
      );

      return {
        container,
        unmount,
        editorView,
        selectionActionMock,
        actualGuidelineMock,
      };
    };

    afterEach(() => {
      selectionActionMock.mockClear();
      actualGuidelineMock.mockClear();
      guidelineActionMock.mockClear();
    });

    // this is testing logic inside TableResizer, targeting the clean up in the useEffect
    it('should call selection plugin action to display gapcursor when removed', () => {
      const { container, unmount, selectionActionMock } = buildContainer({});

      fireEvent.mouseDown(container.querySelector('.resizer-handle.right')!);
      fireEvent.mouseMove(container.querySelector('.resizer-handle.right')!);

      unmount();
      expect(selectionActionMock).toHaveBeenCalledWith(true);
    });

    // this is testing logic inside TableResizer, targeting the clean up in the useEffect
    it('should call guideline plugin action to remove guidelines when removed', () => {
      const { container, unmount, actualGuidelineMock } = buildContainer({});

      fireEvent.mouseDown(container.querySelector('.resizer-handle.right')!);
      fireEvent.mouseMove(container.querySelector('.resizer-handle.right')!);

      unmount();
      expect(actualGuidelineMock).toHaveBeenCalledWith({ guidelines: [] });
    });

    // this is testing logic inside TableResizer, targeting the clean up in the useEffect
    it('should call restore resizing plugin state when removed', () => {
      const { container, unmount, editorView } = buildContainer({});

      fireEvent.mouseDown(container.querySelector('.resizer-handle.right')!);
      fireEvent.mouseMove(container.querySelector('.resizer-handle.right')!);

      unmount();
      expect(tableResizingPluginKey.getState(editorView.state)).toStrictEqual({
        resizing: false,
      });
    });
  });
});
