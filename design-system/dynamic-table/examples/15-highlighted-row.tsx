import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import { DynamicTableStateless } from '../src';

import { head, rows } from './content/sample-data';

interface State {
  highlightedRows: number[];
}

const paddingStyle = { padding: `${token('space.100', '8px')} 0` };

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component<{}, State> {
  state = {
    highlightedRows: [3],
  };

  toggleHighlightedRow = (rowNumber: number) =>
    this.setState(({ highlightedRows }) => {
      const newHighlightedRowIndex = [...highlightedRows];
      const existingIndex = newHighlightedRowIndex.indexOf(rowNumber);
      if (existingIndex > -1) {
        newHighlightedRowIndex.splice(existingIndex, 1);
      } else {
        newHighlightedRowIndex.push(rowNumber);
      }
      return { highlightedRows: newHighlightedRowIndex };
    });

  render() {
    return (
      <>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <p id="row-highlight-control" style={paddingStyle}>
          Select a button to highlight its' corresponding row
        </p>
        <ButtonGroup titleId="row-highlight-control">
          {[0, 2, 5, 6, 8, 9].map((rowIndex) => (
            <Button
              onClick={() => this.toggleHighlightedRow(rowIndex)}
              key={rowIndex}
            >
              {/* Needs to be this, because a raw `0` number won't render anything */}
              {`${rowIndex}`}
            </Button>
          ))}
        </ButtonGroup>
        <DynamicTableStateless
          head={head}
          highlightedRowIndex={this.state.highlightedRows}
          rows={rows}
          rowsPerPage={10}
          page={1}
        />
      </>
    );
  }
}
