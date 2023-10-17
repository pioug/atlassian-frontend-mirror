import React from 'react';

// Allowing existing usage of non Pragmatic drag and drop solution
// eslint-disable-next-line @atlaskit/design-system/no-unsupported-drag-and-drop-libraries
import {
  DragDropContext,
  DragStart,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';

import withSortedPageRows, {
  WithSortedPageRowsProps,
} from '../../hoc/with-sorted-page-rows';
import {
  HeadType,
  RankEnd,
  RankEndLocation,
  RankStart,
  RowType,
} from '../../types';

import TableRow from './table-row';

export interface RankableBodyProps extends WithSortedPageRowsProps {
  highlightedRowIndex?: number | number[];
  onRankStart: (rankStart: RankStart) => void;
  onRankEnd: (rankEnd: RankEnd) => void;
  isFixedSize: boolean;
  isRanking: boolean;
  isRankingDisabled: boolean;
  head?: HeadType;
  testId?: string;
  forwardedRef?: React.Ref<HTMLTableSectionElement>;
}

// computes destination of ranking
// - if drag was cancelled returns undefined
// - if drag was finished, returns new position and after/before key
const computeRankDestination = (
  result: DropResult,
  pageRows: RowType[],
): RankEndLocation | undefined => {
  const {
    source: { index: sourceIndex },
    destination,
  } = result;
  if (destination) {
    const { index } = destination;

    const keyIndex = index < sourceIndex ? index - 1 : index;
    const afterKey = keyIndex !== -1 ? pageRows[keyIndex].key : undefined;
    const beforeIndex = keyIndex === -1 ? 0 : keyIndex + 1;
    const beforeKey =
      beforeIndex < pageRows.length ? pageRows[beforeIndex].key : undefined;

    return {
      index,
      afterKey,
      beforeKey,
    };
  }

  return undefined;
};

export class RankableBody extends React.Component<RankableBodyProps, {}> {
  onBeforeDragStart = (dragStart: DragStart) => {
    const {
      draggableId: key,
      source: { index },
    } = dragStart;
    const rankStartProps = {
      index,
      key,
    };

    this.props.onRankStart(rankStartProps);
  };

  onDragEnd = (result: DropResult) => {
    const { pageRows, onRankEnd } = this.props;
    const {
      draggableId: sourceKey,
      source: { index: sourceIndex },
    } = result;
    const destination = computeRankDestination(result, pageRows);

    const rankEndProps = {
      sourceIndex,
      sourceKey,
      destination,
    };

    onRankEnd(rankEndProps);
  };

  render() {
    const {
      highlightedRowIndex,
      pageRows,
      head,
      isFixedSize,
      isRanking,
      isRankingDisabled,
      testId,
      forwardedRef,
    } = this.props;

    return (
      <DragDropContext
        onBeforeDragStart={this.onBeforeDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Droppable
          droppableId="dynamic-table-droppable"
          isDropDisabled={isRankingDisabled}
        >
          {(provided) => (
            <tbody
              data-testid={testId}
              ref={(ref) => {
                if (provided && typeof provided.innerRef === 'function') {
                  provided.innerRef(ref);
                }

                if (forwardedRef) {
                  (
                    forwardedRef as React.MutableRefObject<HTMLTableSectionElement | null>
                  ).current = ref;
                }
              }}
              {...provided.droppableProps}
            >
              {pageRows.map((row, rowIndex) => (
                <TableRow
                  head={head}
                  isRanking={isRanking}
                  isFixedSize={isFixedSize}
                  key={row.key}
                  rowIndex={rowIndex}
                  row={row}
                  isRankingDisabled={isRankingDisabled}
                  isHighlighted={
                    !!highlightedRowIndex &&
                    (typeof highlightedRowIndex === 'number'
                      ? highlightedRowIndex === rowIndex
                      : highlightedRowIndex.indexOf(rowIndex) > -1)
                  }
                  testId={`${testId}--rankable--table--row`}
                />
              ))}
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default withSortedPageRows<RankableBodyProps>(
  React.forwardRef<HTMLTableSectionElement, RankableBodyProps>((props, ref) => {
    return <RankableBody {...props} forwardedRef={ref} />;
  }),
);
