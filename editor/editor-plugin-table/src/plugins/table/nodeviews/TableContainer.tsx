import React, {
  PropsWithChildren,
  useCallback,
  useRef,
  forwardRef,
} from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import { EditorContainerWidth } from '@atlaskit/editor-common/types';
import { calcTableWidth } from '@atlaskit/editor-common/styles';
import type { GuidelineConfig } from '@atlaskit/editor-plugin-guideline';

import { PluginInjectionAPI, TableCssClassName as ClassName } from '../types';
import { TableResizer } from './TableResizer';
import { TABLE_MAX_WIDTH } from '../pm-plugins/table-resizing/utils';

const getMarginLeft = (lineLength: number, tableWidth: number | 'inherit') => {
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
    marginLeft: number | undefined;
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
      data-test-id="table-container"
    >
      {children}
    </div>
  );
});

type ResizableTableContainerProps = {
  containerWidth: number;
  lineLength: number;
  node: PMNode;
  className: string;
  editorView: EditorView;
  getPos: () => number | undefined;
  tableRef: HTMLTableElement;
  pluginInjectionApi?: PluginInjectionAPI;
};

export const ResizableTableContainer = ({
  children,
  className,
  node,
  lineLength,
  containerWidth,
  editorView,
  getPos,
  tableRef,
  pluginInjectionApi,
}: PropsWithChildren<ResizableTableContainerProps>) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const innerContainerRef = useRef<HTMLDivElement | null>(null);
  const marginLeftRef = useRef<number | undefined>(0);

  const updateWidth = useCallback(
    (width: number) => {
      if (!containerRef.current || !innerContainerRef.current) {
        return;
      }

      const marginLeft = getMarginLeft(lineLength, width);

      if (marginLeftRef.current !== marginLeft) {
        marginLeftRef.current = marginLeft;

        if (Number.isFinite(marginLeft)) {
          containerRef.current.style.marginLeft = `${marginLeft}px`;
        }
      }
    },
    [lineLength],
  );

  const displayGuideline = useCallback(
    (guidelines: GuidelineConfig[]) => {
      return (
        pluginInjectionApi?.dependencies?.guideline?.actions?.displayGuideline(
          editorView,
        )({ guidelines }) ?? false
      );
    },
    [pluginInjectionApi, editorView],
  );

  const tableWidth = getTableContainerWidth(node);

  // 76 is currently an accepted padding value considering the spacing for resizer handle
  const responsiveContainerWidth = containerWidth - 76;

  const width = Math.min(tableWidth, responsiveContainerWidth);

  marginLeftRef.current = getMarginLeft(lineLength, width);

  const maxResizerWidth = Math.min(responsiveContainerWidth, TABLE_MAX_WIDTH);

  return (
    <div
      style={{ marginLeft: marginLeftRef.current, width }}
      className={ClassName.TABLE_RESIZER_CONTAINER}
      ref={containerRef}
    >
      <TableResizer
        width={width}
        maxWidth={maxResizerWidth}
        updateWidth={updateWidth}
        editorView={editorView}
        getPos={getPos}
        node={node}
        tableRef={tableRef}
        displayGuideline={displayGuideline}
      >
        <InnerContainer
          ref={innerContainerRef}
          className={className}
          node={node}
        >
          {children}
        </InnerContainer>
      </TableResizer>
    </div>
  );
};

type TableContainerProps = {
  node: PMNode;
  className: string;
  containerWidth: EditorContainerWidth;
  // TODO: passing through both isFullWidthModeEnabled and isBreakoutEnabled to support custom table widths and
  //  exiting breakout behaviour. In the future these values will be removed and replaced
  // with a single table plugin option - requires changes to editor-core
  isFullWidthModeEnabled: boolean | undefined;
  isBreakoutEnabled: boolean | undefined;
  editorView: EditorView;
  getPos: () => number | undefined;
  tableRef: HTMLTableElement;
  isNested: boolean;
  pluginInjectionApi?: PluginInjectionAPI;
};

export const TableContainer = ({
  children,
  node,
  className,
  containerWidth: { lineLength, width: editorWidth },
  isFullWidthModeEnabled,
  isBreakoutEnabled,
  editorView,
  getPos,
  tableRef,
  isNested,
  pluginInjectionApi,
}: PropsWithChildren<TableContainerProps>) => {
  if (
    (isFullWidthModeEnabled || isBreakoutEnabled) &&
    getBooleanFF('platform.editor.custom-table-width') &&
    !isNested
  ) {
    return (
      <ResizableTableContainer
        className={className}
        node={node}
        lineLength={lineLength!}
        containerWidth={editorWidth!}
        editorView={editorView}
        getPos={getPos}
        tableRef={tableRef}
        pluginInjectionApi={pluginInjectionApi}
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
      className={className}
      style={{
        width: tableWidth,
        marginLeft: getMarginLeft(lineLength!, tableWidth),
      }}
    >
      {children}
    </InnerContainer>
  );
};
