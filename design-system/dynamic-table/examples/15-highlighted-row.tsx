import React from 'react';

import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import DeprecatedThemeProvider from '@atlaskit/theme/deprecated-provider-please-do-not-use';

import { DynamicTableStateless } from '../src';

import { head, rows } from './content/sample-data';

enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

interface State {
  highlightedRows: number[];
  themeMode: ThemeMode;
}

const getOppositeTheme = (themeMode: ThemeMode) =>
  themeMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
const paddingStyle = { padding: '8px 0' };

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component<{}, State> {
  state = {
    highlightedRows: [3],
    themeMode: ThemeMode.LIGHT,
  };

  switchTheme = () => {
    const { themeMode } = this.state;
    this.setState({
      themeMode: getOppositeTheme(themeMode),
    });
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
      <DeprecatedThemeProvider
        mode={this.state.themeMode}
        provider={StyledThemeProvider}
      >
        <h4 style={paddingStyle}>
          Click on the buttons to highlight the corresponding row
        </h4>
        <ButtonGroup>
          {[0, 2, 5, 6, 8, 9].map((rowIndex) => (
            <Button
              onClick={() => this.toggleHighlightedRow(rowIndex)}
              key={rowIndex}
            >
              {rowIndex}
            </Button>
          ))}
        </ButtonGroup>
        <div style={paddingStyle}>
          <Button onClick={this.switchTheme}>
            Switch theme to {getOppositeTheme(this.state.themeMode)}
          </Button>
        </div>
        <DynamicTableStateless
          head={head}
          highlightedRowIndex={this.state.highlightedRows}
          rows={rows}
          rowsPerPage={40}
          page={1}
        />
      </DeprecatedThemeProvider>
    );
  }
}
