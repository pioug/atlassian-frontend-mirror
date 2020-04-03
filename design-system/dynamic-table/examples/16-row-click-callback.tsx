import React from 'react';
import { DynamicTableStateless } from '../src';
import { head, rows as allRows } from './content/sample-data';
import { RankEnd, RowType } from '../src/types';

const rows = allRows.slice(0, 10);

const extendRows = (
  rows: Array<RowType>,
  onClick: (e: React.MouseEvent, rowIndex: number) => void,
) => {
  return rows.map((row, index) => ({
    ...row,
    onClick: (e: React.MouseEvent) => onClick(e, index),
  }));
};

interface StatelessState {
  highlightedRowIndex?: number;
}

class RegularStatelessExample extends React.Component<{}, StatelessState> {
  state = {
    highlightedRowIndex: undefined,
  };

  onRowClick = (e: React.MouseEvent, rowIndex: number) => {
    this.setState({
      highlightedRowIndex: rowIndex,
    });
  };

  render() {
    return (
      <DynamicTableStateless
        head={head}
        highlightedRowIndex={this.state.highlightedRowIndex}
        rows={extendRows(rows, this.onRowClick)}
      />
    );
  }
}

interface RankableProps {
  rows: Array<RowType>;
}

interface RankableState extends RankableProps {
  highlightedRowIndex?: number;
  highlightedRowKey?: string;
}

class RankableStatelessExample extends React.Component<
  RankableProps,
  RankableState
> {
  state = {
    highlightedRowIndex: undefined,
    highlightedRowKey: undefined,
    rows: this.props.rows.slice(),
  };

  onRankStart = () => {
    if (this.state.highlightedRowIndex === undefined) {
      return;
    }

    this.setState({
      highlightedRowKey: rows[this.state.highlightedRowIndex!].key,
    });
  };

  onRankEnd = (rankEnd: RankEnd) => {
    let stateUpdate = {};

    const { highlightedRowIndex, rows } = this.state;
    const highlightedRow =
      highlightedRowIndex === undefined
        ? undefined
        : rows[highlightedRowIndex!];

    if (rankEnd.destination) {
      const { sourceIndex } = rankEnd;
      // const moveBy = rankEnd.destination.index - sourceIndex;
      const movedRow = rows.splice(sourceIndex, 1)[0];

      rows.splice(rankEnd.destination.index, 0, movedRow);

      stateUpdate = {
        rows,
      };
    }

    if (highlightedRow !== undefined) {
      stateUpdate = {
        ...stateUpdate,
        highlightedRowIndex: rows.findIndex(row => row === highlightedRow),
      };
    }

    this.setState(stateUpdate);
  };

  onRowClick = (e: React.MouseEvent, rowIndex: number) => {
    this.setState({
      highlightedRowIndex: rowIndex,
    });
  };

  render() {
    return (
      <DynamicTableStateless
        head={head}
        highlightedRowIndex={this.state.highlightedRowIndex}
        rows={extendRows(this.state.rows, this.onRowClick)}
        isRankable
        onRankStart={this.onRankStart}
        onRankEnd={this.onRankEnd}
      />
    );
  }
}

export default class extends React.Component<{}, {}> {
  render() {
    return (
      <>
        <h4>Click in a row to highlight it</h4>

        <h5>Regular stateless example</h5>
        <RegularStatelessExample />

        <h5>Rankable stateless example</h5>
        <RankableStatelessExample rows={rows} />
      </>
    );
  }
}
