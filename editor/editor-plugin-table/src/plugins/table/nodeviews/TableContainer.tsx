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

import { TableCssClassName as ClassName } from '../types';
import { TableResizer } from './TableResizer';

interface GetMarginLeftOpts {
  lineLength: number;
  tableWidth: number | 'inherit';
}

const getMarginLeft = ({ lineLength, tableWidth }: GetMarginLeftOpts) => {
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
  marginLeft: number | undefined;
  width: number | 'inherit';
  node: PMNode;
};

export const InnerContainer = forwardRef<
  HTMLDivElement,
  PropsWithChildren<InnerContainerProps>
>(({ marginLeft, className, width, node, children }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width,
        marginLeft,
      }}
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
};

export const ResizableTableContainer = ({
  children,
  className,
  node,
  lineLength,
  editorView,
  getPos,
  tableRef,
}: PropsWithChildren<ResizableTableContainerProps>) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const innerContainerRef = useRef<HTMLDivElement | null>(null);

  const updateWidth = useCallback(
    (width: number) => {
      if (!containerRef.current || !innerContainerRef.current) {
        return;
      }

      innerContainerRef.current.style.width = `${width}px`;

      const marginLeft = getMarginLeft({
        lineLength,
        tableWidth: width,
      });

      containerRef.current.style.width = `${width}px`;
      containerRef.current.style.marginLeft = `${marginLeft}px`;
    },
    [lineLength],
  );

  const width = getTableContainerWidth(node);
  const marginLeft = getMarginLeft({
    lineLength,
    tableWidth: width,
  });

  return (
    <div
      style={{ marginLeft, width }}
      className={ClassName.TABLE_RESIZER_CONTAINER}
      ref={containerRef}
    >
      <TableResizer
        width={width}
        updateWidth={updateWidth}
        editorView={editorView}
        getPos={getPos}
        node={node}
        tableRef={tableRef}
      >
        <InnerContainer
          ref={innerContainerRef}
          className={className}
          node={node}
          width={width}
          marginLeft={0}
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
}: PropsWithChildren<TableContainerProps>) => {
  if (
    (isFullWidthModeEnabled || isBreakoutEnabled) &&
    getBooleanFF('platform.editor.custom-table-width')
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
      width={tableWidth}
      marginLeft={getMarginLeft({
        lineLength: lineLength!,
        tableWidth,
      })}
    >
      {children}
    </InnerContainer>
  );
};
