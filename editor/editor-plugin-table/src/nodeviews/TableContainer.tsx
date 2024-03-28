import type { PropsWithChildren } from 'react';
import React, { forwardRef, useCallback, useRef, useState } from 'react';

import classNames from 'classnames';

import type { TableEventPayload } from '@atlaskit/editor-common/analytics';
import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import { calcTableWidth } from '@atlaskit/editor-common/styles';
import type { EditorContainerWidth } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
  akEditorDefaultLayoutWidth,
  akEditorGutterPadding,
  akEditorMediaResizeHandlerPaddingWide,
  akEditorMobileBreakoutPoint,
} from '@atlaskit/editor-shared-styles';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { TABLE_MAX_WIDTH } from '../pm-plugins/table-resizing/utils';
import type { PluginInjectionAPI, TableSharedStateInternal } from '../types';
import { TableCssClassName as ClassName } from '../types';

import { TableResizer } from './TableResizer';
import type { TableResizerImprovementProps } from './TableResizer';

const getMarginLeft = (
  lineLength: number | undefined,
  tableWidth: number | 'inherit',
) => {
  let marginLeft;
  if (tableWidth !== 'inherit' && lineLength) {
    const containerWidth = tableWidth;

    if (containerWidth) {
      marginLeft = (lineLength - containerWidth) / 2;
    }
  }

  return marginLeft;
};

type InnerContainerProps = {
  className: string;
  style?: {
    width: number | 'inherit';
    marginLeft?: number;
  };
  node: PMNode;
};

export const InnerContainer = forwardRef<
  HTMLDivElement,
  PropsWithChildren<InnerContainerProps>
>(({ className, style, node, children }, ref) => {
  return (
    <div
      ref={ref}
      style={style}
      className={className}
      data-number-column={node.attrs.isNumberColumnEnabled}
      data-layout={node.attrs.layout}
      data-testid="table-container"
    >
      {children}
    </div>
  );
});

type ResizableTableContainerProps = {
  containerWidth: number;
  node: PMNode;
  className: string;
  editorView: EditorView;
  getPos: () => number | undefined;
  tableRef: HTMLTableElement;
  isResizing?: boolean;
  pluginInjectionApi?: PluginInjectionAPI;
  isTableScalingEnabled?: boolean;
  tableWrapperHeight?: number;
  isWholeTableInDanger?: boolean;
};

export const ResizableTableContainer = React.memo(
  ({
    children,
    className,
    node,
    containerWidth,
    editorView,
    getPos,
    tableRef,
    isResizing,
    pluginInjectionApi,
    isTableScalingEnabled,
    tableWrapperHeight,
    isWholeTableInDanger,
  }: PropsWithChildren<ResizableTableContainerProps>) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const tableWidthRef = useRef<number>(akEditorDefaultLayoutWidth);
    const [resizing, setIsResizing] = useState(false);

    const updateContainerHeight = useCallback((height: number | 'auto') => {
      // current StickyHeader State is not stable to be fetch.
      // we need to update stickyHeader plugin to make sure state can be
      //    consistently fetch and refactor below
      const stickyHeaders =
        containerRef.current?.getElementsByClassName('pm-table-sticky');
      if (!stickyHeaders || stickyHeaders.length < 1) {
        // when starting to drag, we need to keep the original space,
        // -- When sticky header not appear, margin top(24px) and margin bottom(16px), should be 40px,
        //    1px is border width but collapse make it 0.5.
        // -- When sticky header appear, we should add first row height but reduce
        //    collapsed border
        return typeof height === 'number' ? `${height + 40.5}px` : 'auto';
      } else {
        const stickyHeaderHeight =
          containerRef.current
            ?.getElementsByTagName('th')[0]
            .getBoundingClientRect().height || 0;

        return typeof height === 'number'
          ? `${height + stickyHeaderHeight + 39.5}px`
          : 'auto';
      }
    }, []);

    const onResizeStart = useCallback(() => {
      setIsResizing(true);
    }, []);

    const onResizeStop = useCallback(() => {
      setIsResizing(false);
    }, []);

    const updateWidth = useCallback((width: number) => {
      if (!containerRef.current) {
        return;
      }

      // make sure during resizing
      // the pm-table-resizer-container width is the same as its child div resizer-item
      // otherwise when resize table from wider to narrower , pm-table-resizer-container stays wider
      // and cause the fabric-editor-popup-scroll-parent to overflow
      if (containerRef.current.style.width !== `${width}px`) {
        containerRef.current.style.width = `${width}px`;
      }
    }, []);

    const displayGuideline = useCallback(
      (guidelines: GuidelineConfig[]) => {
        return (
          pluginInjectionApi?.guideline?.actions?.displayGuideline(editorView)({
            guidelines,
          }) ?? false
        );
      },
      [pluginInjectionApi, editorView],
    );

    const attachAnalyticsEvent = useCallback(
      (payload: TableEventPayload) => {
        return pluginInjectionApi?.analytics?.actions.attachAnalyticsEvent(
          payload,
        );
      },
      [pluginInjectionApi],
    );

    const displayGapCursor = useCallback(
      (toggle: boolean) => {
        return (
          pluginInjectionApi?.core?.actions.execute(
            pluginInjectionApi?.selection?.commands.displayGapCursor(toggle),
          ) ?? false
        );
      },
      [pluginInjectionApi],
    );

    const tableWidth = getTableContainerWidth(node);
    const { tableState } = useSharedPluginState(pluginInjectionApi, ['table']);
    const { widthToWidest } = tableState as TableSharedStateInternal;
    const currentTableNodeLocalId = node?.attrs?.localId ?? '';

    // 76 is currently an accepted padding value considering the spacing for resizer handle
    const responsiveContainerWidth = isTableScalingEnabled
      ? containerWidth -
        akEditorGutterPadding * 2 -
        akEditorMediaResizeHandlerPaddingWide / 2
      : containerWidth -
        akEditorGutterPadding * 2 -
        akEditorMediaResizeHandlerPaddingWide;

    let width = Math.min(tableWidth, responsiveContainerWidth);

    if (
      isTableScalingEnabled &&
      currentTableNodeLocalId &&
      widthToWidest &&
      widthToWidest[currentTableNodeLocalId]
    ) {
      width = TABLE_MAX_WIDTH;
    }

    if (!isResizing) {
      tableWidthRef.current = width;
    }
    const maxResizerWidth = Math.min(responsiveContainerWidth, TABLE_MAX_WIDTH);

    let tableResizerProps: TableResizerImprovementProps = {
      width,
      maxWidth: maxResizerWidth,
      containerWidth,
      updateWidth,
      editorView,
      getPos,
      node,
      tableRef,
      displayGuideline,
      attachAnalyticsEvent,
      displayGapCursor,
      isTableScalingEnabled,
      isWholeTableInDanger,
      pluginInjectionApi,
    };

    if (getBooleanFF('platform.editor.resizing-table-height-improvement')) {
      tableResizerProps = {
        ...tableResizerProps,
        onResizeStart: onResizeStart,
        onResizeStop: onResizeStop,
      };
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: tableWidthRef.current,
            height: resizing
              ? updateContainerHeight(tableWrapperHeight ?? 'auto')
              : 'auto',
          }}
          className={ClassName.TABLE_RESIZER_CONTAINER}
          ref={containerRef}
        >
          <TableResizer {...tableResizerProps}>
            <InnerContainer className={className} node={node}>
              {children}
            </InnerContainer>
          </TableResizer>
        </div>
      </div>
    );
  },
);

type TableContainerProps = {
  node: PMNode;
  className: string;
  containerWidth: EditorContainerWidth;
  isTableResizingEnabled: boolean | undefined;
  isBreakoutEnabled: boolean | undefined;
  editorView: EditorView;
  getPos: () => number | undefined;
  tableRef: HTMLTableElement;
  isNested: boolean;
  isResizing?: boolean;
  pluginInjectionApi?: PluginInjectionAPI;
  isTableScalingEnabled?: boolean;
  tableWrapperHeight?: number;
  isWholeTableInDanger?: boolean;
};

export const TableContainer = ({
  children,
  node,
  className,
  containerWidth: { lineLength, width: editorWidth },
  isTableResizingEnabled,
  isBreakoutEnabled,
  editorView,
  getPos,
  tableRef,
  isNested,
  tableWrapperHeight,
  isResizing,
  pluginInjectionApi,
  isTableScalingEnabled,
  isWholeTableInDanger,
}: PropsWithChildren<TableContainerProps>) => {
  if (isTableResizingEnabled && !isNested) {
    return (
      <ResizableTableContainer
        className={className}
        node={node}
        containerWidth={editorWidth!}
        editorView={editorView}
        getPos={getPos}
        tableRef={tableRef}
        tableWrapperHeight={tableWrapperHeight}
        isResizing={isResizing}
        pluginInjectionApi={pluginInjectionApi}
        isTableScalingEnabled={isTableScalingEnabled}
        isWholeTableInDanger={isWholeTableInDanger}
      >
        {children}
      </ResizableTableContainer>
    );
  }

  const tableWidth = isBreakoutEnabled
    ? calcTableWidth(node.attrs.layout, editorWidth)
    : 'inherit';

  return (
    <InnerContainer
      node={node}
      className={classNames(className, {
        'less-padding': editorWidth < akEditorMobileBreakoutPoint && !isNested,
      })}
      style={{
        width: tableWidth,
        marginLeft: getMarginLeft(lineLength!, tableWidth),
      }}
    >
      {children}
    </InnerContainer>
  );
};
